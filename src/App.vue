<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import BookingSection from './components/booking/BookingSection.vue'
import WhyHandWash from './components/WhyHandWash.vue'
import ServicesSection from './components/ServicesSection.vue'
import HowItWorks from './components/HowItWorks.vue'
import AreasSection from './components/AreasSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import FloatingBookButton from './components/FloatingBookButton.vue'
import { siteConfig } from './site.config'
</script>

<template>
  <a class="skip-link" href="#book">Skip to booking</a>
  <SiteHeader />
  <main>
    <HeroSection />
    <BookingSection />
    <WhyHandWash />
    <ServicesSection />
    <HowItWorks />
    <AreasSection />
    <ContactSection />
  </main>
  <SiteFooter />
  <FloatingBookButton v-if="siteConfig.showFloatingButton" />
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: 12px;
  top: -60px;
  z-index: 60;
  padding: 12px 18px;
  border-radius: 0 0 10px 10px;
  background: var(--c22-deep);
  color: #ffffff;
  font-weight: 500;
  transition: top 150ms ease;
}

.skip-link:focus-visible {
  top: 0;
  color: #ffffff;
}
</style>
