<template>
  <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <!-- Mobile view -->
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        @click="$emit('previous')"
        :disabled="!hasPrevious"
        :class="[
          'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
          hasPrevious
            ? 'text-gray-700 bg-white hover:bg-gray-50'
            : 'text-gray-300 bg-gray-100 cursor-not-allowed'
        ]"
      >
        Previous
      </button>
      <button
        @click="$emit('next')"
        :disabled="!hasNext"
        :class="[
          'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
          hasNext
            ? 'text-gray-700 bg-white hover:bg-gray-50'
            : 'text-gray-300 bg-gray-100 cursor-not-allowed'
        ]"
      >
        Next
      </button>
    </div>

    <!-- Desktop view -->
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          {{ ' ' }}
          <span class="font-medium">{{ startItem }}</span>
          {{ ' ' }}
          to
          {{ ' ' }}
          <span class="font-medium">{{ endItem }}</span>
          {{ ' ' }}
          of
          {{ ' ' }}
          <span class="font-medium">{{ total }}</span>
          {{ ' ' }}
          results
        </p>
      </div>

      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <!-- Previous button -->
          <button
            @click="$emit('previous')"
            :disabled="!hasPrevious"
            :class="[
              'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium',
              hasPrevious
                ? 'bg-white text-gray-500 hover:bg-gray-50'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            ]"
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>

          <!-- Page numbers -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="typeof page === 'number'"
              @click="$emit('goto-page', page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
            >
              ...
            </span>
          </template>

          <!-- Next button -->
          <button
            @click="$emit('next')"
            :disabled="!hasNext"
            :class="[
              'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium',
              hasNext
                ? 'bg-white text-gray-500 hover:bg-gray-50'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            ]"
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>

    <!-- Per page selector removed -->
  </div>
</template>

<script setup>
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  offset: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['previous', 'next', 'goto-page'])

const hasPrevious = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.totalPages)

const startItem = computed(() => {
  if (props.total === 0) return 0
  return props.offset + 1
})

const endItem = computed(() => {
  return Math.min(props.offset + props.limit, props.total)
})

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (
    let i = Math.max(2, props.currentPage - delta);
    i <= Math.min(props.totalPages - 1, props.currentPage + delta);
    i++
  ) {
    range.push(i)
  }

  if (props.currentPage - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (props.currentPage + delta < props.totalPages - 1) {
    rangeWithDots.push('...', props.totalPages)
  } else if (props.totalPages > 1) {
    rangeWithDots.push(props.totalPages)
  }

  return rangeWithDots
})

// No watch needed anymore since we removed itemsPerPage
</script>
