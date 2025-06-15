<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// Global app configuration
useHead({
  title: 'Blizy Smartphones - Browse & Compare',
  meta: [
    { name: 'description', content: 'Browse and compare refurbished smartphones from Blizy.pl' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>
