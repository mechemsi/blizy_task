<template>
  <div class="flex items-center justify-center p-8">
    <div class="relative">
      <!-- Spinner -->
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      
      <!-- Pulse effect -->
      <div class="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-primary-300 opacity-75"></div>
    </div>
    
    <span v-if="text" class="ml-3 text-gray-600">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Loading...'
  }
})
</script>
