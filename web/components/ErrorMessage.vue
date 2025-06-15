<template>
  <div class="bg-red-50 border border-red-200 rounded-md p-4">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium text-red-800">
          {{ title || 'Error' }}
        </h3>
        <div class="mt-1 text-sm text-red-700">
          <p>{{ message || 'An unexpected error occurred.' }}</p>
        </div>
        <div v-if="retry" class="mt-3">
          <button
            @click="$emit('retry')"
            class="text-sm font-medium text-red-800 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  retry: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry'])
</script>
