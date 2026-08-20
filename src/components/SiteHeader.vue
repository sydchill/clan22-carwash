<script setup lang="ts">
import BrandMark from './BrandMark.vue'
import { navLinks } from '../content'
</script>

<template>
  <header class="header">
    <a class="brand" href="#top">
      <BrandMark :size="26" />
      <span class="brand-name">Clan22 Carwash</span>
    </a>
    <nav class="nav">
      <a v-for="link in navLinks" :key="link.href" class="nav-link" :href="link.href">
        {{ link.label }}
      </a>
      <a class="nav-cta" href="#book">Book a wash</a>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px var(--c22-gutter);
  background: rgba(244, 248, 248, 0.9);
  backdrop-filter: blur(10px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--c22-ink);
}

.brand:hover {
  color: var(--c22-ink);
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.nav {
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 15px;
}

.nav-link {
  color: var(--c22-ink);
}

.nav-link:hover {
  color: var(--c22-teal);
}

.nav-cta {
  white-space: nowrap;
  background: var(--c22-teal-cta);
  color: #ffffff;
  padding: 11px 20px;
  border-radius: var(--c22-radius-control);
  font-weight: 500;
  font-size: 15px;
  transition: background-color 150ms ease;
}

.nav-cta:hover {
  background: var(--c22-deep);
  color: #ffffff;
}

/* The design canvas is desktop-width; on phones the link list has nowhere to
   go, so it drops away and the CTA carries the header on its own. */
@media (max-width: 860px) {
  .nav-link {
    display: none;
  }
}

@media (max-width: 420px) {
  .brand-name {
    font-size: 17px;
  }

  .nav-cta {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>
