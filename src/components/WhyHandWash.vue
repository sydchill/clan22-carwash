<script setup lang="ts">
import { pillars } from '../content'
</script>

<template>
  <section class="c22-section why">
    <div class="panel">
      <div class="panel-head c22-grid-auto">
        <div>
          <div class="c22-eyebrow">Why hand wash</div>
          <h2 class="panel-title">Careful work, done<br />in your driveway.</h2>
        </div>
        <p class="panel-copy">
          Machine washes are quick but rough on paint. I wash panel by panel with clean mitts and
          fresh water, so your car keeps its finish and you never leave home.
        </p>
      </div>

      <div class="pillars">
        <div v-for="pillar in pillars" :key="pillar.mark">
          <div class="pillar-mark">{{ pillar.mark }}</div>
          <div class="pillar-title">{{ pillar.title }}</div>
          <div class="c22-body pillar-body">{{ pillar.body }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why {
  padding-bottom: 92px;
}

.panel {
  background: var(--c22-surface);
  border-radius: var(--c22-radius-panel);
  padding: clamp(30px, 4vw, 56px);
  box-shadow: var(--c22-shadow-flat);
}

.panel-head {
  gap: 40px;
}

.panel-title {
  font-size: clamp(28px, 3.1vw, 40px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-top: 14px;
}

.panel-copy {
  font-size: 15px;
  line-height: 1.7;
  color: var(--c22-muted);
  align-self: end;
}

.pillars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 34px;
  margin-top: 48px;
}

.pillar-mark {
  width: 40px;
  height: 40px;
  border-radius: var(--c22-radius-control);
  background: var(--c22-tint);
  color: var(--c22-teal-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 700;
}

.pillar-title {
  font-size: 17px;
  font-weight: 700;
  margin-top: 16px;
}

.pillar-body {
  margin-top: 8px;
}
</style>
