<script setup lang="ts">
import { computed } from 'vue'
import ImageSlot from './ImageSlot.vue'
import { DEFAULT_SERVICE_ID, heroAssurances, services } from '../content'
import { formatDuration, formatRand } from '../lib/format'
import { waLink } from '../lib/contact'

const featured = computed(() => services.find((s) => s.id === DEFAULT_SERVICE_ID) ?? services[0]!)
</script>

<template>
  <section id="top" class="hero c22-section c22-grid-auto">
    <div>
      <h1 class="hero-title">Book a hand car wash<br />at your house today.</h1>
      <p class="hero-copy">
        I wash cars by hand, house to house, around Midrand. Choose your wash and a time below —
        it takes under a minute and lands straight in my WhatsApp.
      </p>
      <div class="hero-actions">
        <a class="c22-button c22-button--primary" href="#book">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4.8" width="18" height="16.2" rx="2.6" />
            <path d="M3 9.6h18M8 3v3.6M16 3v3.6" />
            <path d="M8.6 14.4l2.2 2.2 4.4-4.4" />
          </svg>
          Book a wash
        </a>
        <a class="c22-button c22-button--quiet" href="#services">See prices</a>
      </div>
      <p class="hero-alt">
        Rather just chat?
        <a :href="waLink" target="_blank" rel="noopener">Message me on WhatsApp</a>
      </p>
      <div class="hero-assurances">
        <span v-for="item in heroAssurances" :key="item">{{ item }}</span>
      </div>
    </div>

    <div class="hero-figure">
      <div class="hero-frame">
        <ImageSlot placeholder="A photo of you washing a car goes here" />
      </div>
      <div class="hero-badge">
        <span class="hero-badge-label">{{ featured.name }}</span>
        <span class="hero-badge-price">{{ formatRand(featured.price) }}</span>
        <span class="hero-badge-note">{{ formatDuration(featured.minutes) }} at your gate</span>
      </div>
      <a class="hero-badge-link" href="#book">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4.8" width="18" height="16.2" rx="2.6" />
          <path d="M3 9.6h18M8 3v3.6M16 3v3.6" />
          <path d="M8.6 14.4l2.2 2.2 4.4-4.4" />
        </svg>
        Book this wash
      </a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  gap: 56px;
  align-items: center;
  padding-top: 56px;
  padding-bottom: 84px;
}

.hero-title {
  font-size: clamp(38px, 4.4vw, 60px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.035em;
}

.hero-copy {
  font-size: 17px;
  line-height: 1.65;
  color: var(--c22-muted);
  max-width: 30em;
  margin-top: 22px;
  text-wrap: pretty;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero-alt {
  margin-top: 14px;
  font-size: 14px;
  color: var(--c22-muted);
}

.hero-assurances {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  margin-top: 32px;
  font-size: 14px;
  color: var(--c22-muted);
}

.hero-figure {
  position: relative;
}

.hero-frame {
  height: 480px;
  border-radius: var(--c22-radius-card);
  overflow: hidden;
  background: var(--c22-tint-warm);
  box-shadow: var(--c22-shadow-hero);
}

.hero-badge {
  position: absolute;
  left: 20px;
  bottom: 20px;
  display: grid;
  gap: 4px;
  background: var(--c22-surface);
  border-radius: 14px;
  padding: 18px 22px;
  box-shadow: var(--c22-shadow-lift);
}

.hero-badge-label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c22-teal-dark);
}

.hero-badge-price {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.hero-badge-note {
  font-size: 13px;
  color: var(--c22-muted);
}

.hero-badge-link {
  position: absolute;
  right: 20px;
  top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 12px 18px;
  border-radius: 999px;
  background: var(--c22-deep);
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  box-shadow: var(--c22-shadow-lift);
  transition: background-color 150ms ease;
}

.hero-badge-link:hover {
  background: var(--c22-teal-cta);
  color: #ffffff;
}

@media (max-width: 560px) {
  .hero-frame {
    height: 340px;
  }

  .hero-badge,
  .hero-badge-link {
    position: static;
  }

  .hero-badge {
    margin-top: 12px;
  }

  .hero-badge-link {
    margin-top: 10px;
    justify-content: center;
  }
}
</style>
