"""Build favicon.ico (16/32/48) from public/logo-mark.png, stdlib only.

Area-average downscaling: every destination pixel is the mean of the source
pixels it covers, weighted by how much of each it overlaps. For a 512px source
this is effectively a box filter and gives clean edges without a resampling
library.
"""
import struct, zlib, io, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pngcrop import read_chunks, unfilter, write_png, SIG

PUBLIC = r"C:/Users/stmol/OneDrive/Documents/clan22_carwash/public"


def decode(path):
    data = open(path, 'rb').read()
    chunks = read_chunks(data)
    ihdr = next(b for t, b in chunks if t == b'IHDR')
    w, h, depth, ctype = struct.unpack('>IIBB', ihdr[:10])
    assert depth == 8 and ctype in (2, 6), f'unsupported ({depth}bit type {ctype})'
    bpp = 4 if ctype == 6 else 3
    idat = b''.join(b for t, b in chunks if t == b'IDAT')
    px = unfilter(zlib.decompress(idat), w, h, bpp)
    if bpp == 3:  # normalise to RGBA so the rest of the code has one shape
        rgba = bytearray(w * h * 4)
        for i in range(w * h):
            rgba[i*4:i*4+3] = px[i*3:i*3+3]
            rgba[i*4+3] = 255
        px, bpp = bytes(rgba), 4
    return px, w, h


def downscale(px, sw, sh, size):
    out = bytearray(size * size * 4)
    for dy in range(size):
        y0, y1 = dy * sh / size, (dy + 1) * sh / size
        iy0, iy1 = int(y0), min(int(y1 - 1e-9) + 1, sh)
        for dx in range(size):
            x0, x1 = dx * sw / size, (dx + 1) * sw / size
            ix0, ix1 = int(x0), min(int(x1 - 1e-9) + 1, sw)
            r = g = b = a = wsum = 0.0
            for sy in range(iy0, iy1):
                wy = min(sy + 1, y1) - max(sy, y0)
                if wy <= 0: continue
                row = sy * sw * 4
                for sx in range(ix0, ix1):
                    wx = min(sx + 1, x1) - max(sx, x0)
                    if wx <= 0: continue
                    wt = wy * wx
                    i = row + sx * 4
                    r += px[i] * wt; g += px[i+1] * wt; b += px[i+2] * wt; a += px[i+3] * wt
                    wsum += wt
            o = (dy * size + dx) * 4
            out[o]   = min(255, round(r / wsum))
            out[o+1] = min(255, round(g / wsum))
            out[o+2] = min(255, round(b / wsum))
            out[o+3] = min(255, round(a / wsum))
    return bytes(out)


def png_bytes(px, size):
    tmp = os.path.join(PUBLIC, f'.tmp-{size}.png')
    write_png(tmp, px, size, size, 6, 4)
    data = open(tmp, 'rb').read()
    os.remove(tmp)
    return data


src, sw, sh = decode(os.path.join(PUBLIC, 'logo-mark.png'))
print(f'source {sw}x{sh}')

sizes = [16, 32, 48]
pngs = {}
for s in sizes:
    pngs[s] = png_bytes(downscale(src, sw, sh, s), s)
    print(f'  {s}px -> {len(pngs[s])} bytes')

# ICO may embed PNG payloads directly; every current browser reads them.
buf = io.BytesIO()
buf.write(struct.pack('<HHH', 0, 1, len(sizes)))
offset = 6 + 16 * len(sizes)
for s in sizes:
    buf.write(struct.pack('<BBBBHHII', s, s, 0, 0, 1, 32, len(pngs[s]), offset))
    offset += len(pngs[s])
for s in sizes:
    buf.write(pngs[s])
open(os.path.join(PUBLIC, 'favicon.ico'), 'wb').write(buf.getvalue())
print(f'favicon.ico {len(buf.getvalue())} bytes')

# 32px also ships standalone for browsers that prefer a PNG favicon.
open(os.path.join(PUBLIC, 'favicon-32.png'), 'wb').write(pngs[32])
print('favicon-32.png rewritten from the real mark')
