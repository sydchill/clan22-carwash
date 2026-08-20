<script setup lang="ts">
import BrandMark from './BrandMark.vue'
import { displayPhone, waLink } from '../lib/contact'
</script>

<template>
  <footer class="footer c22-section">
    <div class="brand">
      <BrandMark :size="22" />
      Clan22 Carwash
    </div>
    <span>Hand car wash at your home · Midrand</span>
    <a :href="waLink" target="_blank" rel="noopener">{{ displayPhone }}</a>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  padding-top: 28px;
  padding-bottom: 36px;
  border-top: 1px solid rgba(11, 58, 69, 0.1);
  font-size: 14px;
  color: var(--c22-muted);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--c22-ink);
  font-weight: 700;
}
</style>
