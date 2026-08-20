"""Minimal PNG crop-to-alpha-bbox using only the standard library.

Pillow is not installed here, and the alternative (round-tripping ~100KB of
base64 through the browser) is far more expensive than decoding the format.
Handles 8-bit RGB and RGBA, which is what the brand exports use.
"""
import struct, zlib, sys

SIG = b'\x89PNG\r\n\x1a\n'


def read_chunks(data):
    assert data[:8] == SIG, 'not a PNG'
    pos, chunks = 8, []
    while pos < len(data):
        (length,) = struct.unpack('>I', data[pos:pos + 4])
        ctype = data[pos + 4:pos + 8]
        body = data[pos + 8:pos + 8 + length]
        chunks.append((ctype, body))
        pos += 12 + length
    return chunks


def paeth(a, b, c):
    p = a + b - c
    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    return b if pb <= pc else c


def unfilter(raw, width, height, bpp):
    stride = width * bpp
    out = bytearray(stride * height)
    pos = 0
    for y in range(height):
        ft = raw[pos]; pos += 1
        line = raw[pos:pos + stride]; pos += stride
        base = y * stride
        prev = base - stride
        for i in range(stride):
            x = line[i]
            a = out[base + i - bpp] if i >= bpp else 0
            b = out[prev + i] if y > 0 else 0
            c = out[prev + i - bpp] if (y > 0 and i >= bpp) else 0
            if ft == 0:   v = x
            elif ft == 1: v = x + a
            elif ft == 2: v = x + b
            elif ft == 3: v = x + (a + b) // 2
            elif ft == 4: v = x + paeth(a, b, c)
            else: raise ValueError(f'bad filter {ft}')
            out[base + i] = v & 0xFF
    return bytes(out)


def write_png(path, pixels, width, height, colortype, bpp):
    stride = width * bpp
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filter: None
        raw += pixels[y * stride:(y + 1) * stride]
    def chunk(ctype, body):
        return (struct.pack('>I', len(body)) + ctype + body
                + struct.pack('>I', zlib.crc32(ctype + body) & 0xFFFFFFFF))
    ihdr = struct.pack('>IIBBBBB', width, height, 8, colortype, 0, 0, 0)
    with open(path, 'wb') as f:
        f.write(SIG + chunk(b'IHDR', ihdr)
                + chunk(b'IDAT', zlib.compress(bytes(raw), 9))
                + chunk(b'IEND', b''))


def crop_to_alpha(src, dst, alpha_threshold=8):
    data = open(src, 'rb').read()
    chunks = read_chunks(data)
    ihdr = next(b for t, b in chunks if t == b'IHDR')
    width, height, depth, colortype = struct.unpack('>IIBB', ihdr[:10])
    assert depth == 8 and colortype in (2, 6), f'unsupported PNG ({depth}bit type {colortype})'
    bpp = 4 if colortype == 6 else 3

    idat = b''.join(b for t, b in chunks if t == b'IDAT')
    pixels = unfilter(zlib.decompress(idat), width, height, bpp)

    if colortype != 6:
        write_png(dst, pixels, width, height, colortype, bpp)
        return width, height, width, height

    stride = width * bpp
    min_x, min_y, max_x, max_y = width, height, -1, -1
    for y in range(height):
        row = y * stride
        for x in range(width):
            if pixels[row + x * 4 + 3] > alpha_threshold:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
    if max_x < 0:
        raise ValueError('image is fully transparent')

    cw, ch = max_x - min_x + 1, max_y - min_y + 1
    cropped = bytearray()
    for y in range(min_y, max_y + 1):
        start = y * stride + min_x * 4
        cropped += pixels[start:start + cw * 4]
    write_png(dst, bytes(cropped), cw, ch, 6, 4)
    return width, height, cw, ch


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    ow, oh, cw, ch = crop_to_alpha(src, dst)
    print(f'{src.split("/")[-1]}: {ow}x{oh} -> {cw}x{ch} (ratio {cw/ch:.3f})')
