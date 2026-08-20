<script setup lang="ts">
import BrandWordmark from './BrandWordmark.vue'
import { steps } from '../content'
</script>

<template>
  <section id="how" class="c22-section how">
    <BrandWordmark class="band-logo" :height="34" variant="light" />
    <div class="eyebrow">How it works</div>
    <h2 class="title">Three taps and your car<br />is clean by this afternoon.</h2>

    <a class="c22-button c22-button--primary title-cta" href="#book">Start a booking</a>

    <div class="grid">
      <div v-for="step in steps" :key="step.n" class="card">
        <div class="card-number">{{ step.n }}</div>
        <div class="card-title">{{ step.title }}</div>
        <div class="card-body">{{ step.body }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how {
  --c22-focus: var(--c22-focus-on-dark);
  scroll-margin-top: 90px;
  background: var(--c22-deep);
  color: #ffffff;
  padding-block: 84px;
}

.band-logo {
  margin-bottom: 22px;
  opacity: 0.9;
}

.eyebrow {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c22-teal-light);
}

.title {
  font-size: clamp(28px, 3.3vw, 42px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-top: 16px;
  max-width: 22em;
}

.title-cta {
  margin-top: 26px;
}

.title-cta:hover {
  background: #ffffff;
  color: var(--c22-deep);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 18px;
  margin-top: 42px;
}

.card {
  background: var(--c22-deep-panel);
  border-radius: 16px;
  padding: 28px 26px;
}

.card-number {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  margin-top: 18px;
}

.card-body {
  font-size: 14px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
  text-wrap: pretty;
}
</style>
