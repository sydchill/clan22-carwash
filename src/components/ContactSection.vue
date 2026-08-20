<script setup lang="ts">
import WhatsAppIcon from './WhatsAppIcon.vue'
import { contactFacts } from '../content'
import { waLink } from '../lib/contact'
</script>

<template>
  <section id="contact" class="c22-section contact">
    <div class="panel c22-grid-auto">
      <div>
        <div class="eyebrow">Talk to me</div>
        <h2 class="title">Not sure what your<br />car needs? Just ask.</h2>
        <p class="copy">
          The booking form is the quickest way in, but you are welcome to message me first. Send a
          photo of the car and I will tell you what I would do and what it costs.
        </p>
        <a
          class="c22-button c22-button--primary c22-button--on-deep cta"
          :href="waLink"
          target="_blank"
          rel="noopener"
        >
          <WhatsAppIcon />
          Message me on WhatsApp
        </a>
      </div>

      <div class="facts">
        <div v-for="fact in contactFacts" :key="fact.label" class="fact">
          <div class="fact-label">{{ fact.label }}</div>
          <div :class="['fact-value', { 'fact-value--lead': fact.emphasis }]">{{ fact.value }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding-bottom: 96px;
}

.panel {
  --c22-focus: var(--c22-focus-on-dark);
  background: var(--c22-deep);
  color: #ffffff;
  border-radius: 22px;
  padding: 56px clamp(28px, 5vw, 60px);
  gap: 48px;
  align-items: center;
}

.eyebrow {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c22-teal-light);
}

.title {
  font-size: clamp(28px, 3.2vw, 40px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-top: 16px;
}

.copy {
  font-size: 15px;
  line-height: 1.7;
  color: var(--c22-on-deep);
  margin-top: 16px;
  max-width: 28em;
}

.cta {
  margin-top: 30px;
}

.facts {
  display: grid;
  gap: 10px;
}

.fact {
  background: var(--c22-deep-panel);
  border-radius: 14px;
  padding: 20px 22px;
}

.fact-label {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c22-on-deep-soft);
}

.fact-value {
  font-size: 18px;
  margin-top: 6px;
}

.fact-value--lead {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
</style>
