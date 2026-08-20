<script setup lang="ts">
import { areas } from '../content'
import { useBookingForm } from '../composables/useBookingForm'

const { form, chooseSuburb } = useBookingForm()

/** Tapping an area preselects it in the booking form and jumps you there. */
function bookArea(area: string): void {
  chooseSuburb(area)
  document.getElementById('book')?.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <section id="areas" class="c22-section areas">
    <div class="intro">
      <div class="c22-eyebrow">Areas covered</div>
      <h2 class="c22-heading">I work around Midrand</h2>
      <p class="c22-lede">
        Travel is free inside these areas. A little further out is fine too — pick
        “Somewhere else nearby” in the booking form and I will confirm.
      </p>
    </div>

    <ul class="grid">
      <li v-for="area in areas" :key="area">
        <button
          type="button"
          class="tile"
          :class="{ 'tile--selected': form.suburb === area }"
          @click="bookArea(area)"
        >
          <span>{{ area }}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" />
          </svg>
          <span class="c22-visually-hidden">— book a wash in {{ area }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.areas {
  padding-block: 84px;
  scroll-margin-top: 90px;
}

.intro {
  text-align: center;
  max-width: 32em;
  margin-inline: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin: 40px 0 0;
  padding: 0;
  list-style: none;
}

.tile {
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: var(--c22-surface);
  border: 1.5px solid transparent;
  border-radius: 12px;
  padding: 16px 18px;
  color: var(--c22-ink);
  font: inherit;
  font-size: 16px;
  text-align: left;
  box-shadow: var(--c22-shadow-flat);
  cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease;
}

.tile svg {
  flex: none;
  color: var(--c22-faint);
  transition: color 150ms ease, transform 150ms ease;
}

.tile:hover {
  border-color: var(--c22-teal);
}

.tile:hover svg {
  color: var(--c22-teal);
  transform: translateX(2px);
}

.tile--selected {
  border-color: var(--c22-teal);
  background: var(--c22-tint);
}

.tile--selected svg {
  color: var(--c22-teal);
}
</style>
