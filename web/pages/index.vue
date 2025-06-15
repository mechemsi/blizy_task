<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justconst applyFilters = async () => {
  console.log('Index: Applying filters from store state:', store.filters)
  await store.fetchSmartphones(1)
}

const clearFilters = async () => {
  store.clearFilters()
  await store.fetchSmartphones(1)
}en">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900">
              Blizy Smartphones
            </h1>
            <span class="badge badge-blue">
              {{ store.pagination.total }} devices
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="refreshData"
              :disabled="store.loading"
              class="btn btn-secondary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Enhanced Search and Filters Component -->
      <SearchAndFilters 
        v-model:brand="store.filters.brand"
        v-model:model="store.filters.model"
        v-model:category="store.filters.category"
        v-model:grade="store.filters.grade"
        v-model:storage="store.filters.storage"
        v-model:color="store.filters.color"
        v-model:availability="store.filters.availability"
        v-model:currency="store.filters.currency"
        v-model:min-price="store.filters.minPrice"
        v-model:max-price="store.filters.maxPrice"
        :filter-options="store.filterOptions"
        :loading="store.loading"
        @apply="applyFilters"
        @clear="clearFilters"
        class="mb-8"
      />

      <!-- Loading State -->
      <LoadingSpinner v-if="store.loading" text="Loading smartphones..." />

      <!-- Error State -->
      <ErrorMessage 
        v-else-if="store.error" 
        :message="store.error"
        :retry="true"
        @retry="refreshData"
      />

      <!-- Results -->
      <div v-else>
        <!-- Desktop Table View -->
        <div class="hidden lg:block card">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="table-header">
                <tr>
                  <th class="table-cell font-medium text-gray-900">Image</th>
                  <th class="table-cell font-medium text-gray-900">Device</th>
                  <th class="table-cell font-medium text-gray-900">Brand</th>
                  <th class="table-cell font-medium text-gray-900">Storage</th>
                  <th class="table-cell font-medium text-gray-900">Grade</th>
                  <th class="table-cell font-medium text-gray-900">Price</th>
                  <th class="table-cell font-medium text-gray-900">Updated</th>
                  <th class="table-cell font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="smartphone in store.smartphones" :key="smartphone.id" class="hover:bg-gray-50">
                  <td class="table-cell">
                    <img 
                      v-if="smartphone.imageUrl"
                      :src="smartphone.imageUrl" 
                      :alt="smartphone.model"
                      class="w-12 h-12 rounded object-cover"
                      @error="$event.target.style.display='none'"
                    />
                    <div v-else class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </td>
                  <td class="table-cell">
                    <div class="text-sm font-medium text-gray-900">{{ smartphone.model || 'Unknown' }}</div>
                    <div class="text-sm text-gray-500">{{ smartphone.color || 'N/A' }}</div>
                  </td>
                  <td class="table-cell">
                    <span class="badge badge-blue">{{ smartphone.brand || 'Unknown' }}</span>
                  </td>
                  <td class="table-cell text-gray-900">{{ smartphone.storage || 'N/A' }}</td>
                  <td class="table-cell">
                    <span :class="getGradeBadgeClass(smartphone.grade)">
                      {{ smartphone.grade || 'N/A' }}
                    </span>
                  </td>
                  <td class="table-cell">
                    <div class="text-sm font-medium text-gray-900">
                      {{ smartphone.price ? `€${smartphone.price}` : 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-500">{{ smartphone.currency || 'EUR' }}</div>
                  </td>
                  <td class="table-cell text-gray-500">
                    {{ formatDate(smartphone.updatedAt) }}
                  </td>
                  <td class="table-cell">
                    <a 
                      v-if="smartphone.url"
                      :href="smartphone.url" 
                      target="_blank"
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden space-y-4">
          <div v-for="smartphone in store.smartphones" :key="smartphone.id" class="card">
            <div class="card-body">
              <div class="flex items-start space-x-4">
                <img 
                  v-if="smartphone.imageUrl"
                  :src="smartphone.imageUrl" 
                  :alt="smartphone.model"
                  class="w-16 h-16 rounded object-cover flex-shrink-0"
                  @error="$event.target.style.display='none'"
                />
                <div v-else class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900 truncate">
                        {{ smartphone.model || 'Unknown Model' }}
                      </h3>
                      <p class="text-sm text-gray-500">{{ smartphone.brand || 'Unknown Brand' }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-semibold text-gray-900">
                        {{ smartphone.price ? `€${smartphone.price}` : 'N/A' }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="mt-3 flex flex-wrap gap-2">
                    <span class="badge badge-blue">{{ smartphone.storage || 'N/A' }}</span>
                    <span :class="getGradeBadgeClass(smartphone.grade)">
                      {{ smartphone.grade || 'N/A' }}
                    </span>
                    <span class="badge badge-gray">{{ smartphone.color || 'N/A' }}</span>
                  </div>
                  
                  <div class="mt-3 flex items-center justify-between">
                    <span class="text-sm text-gray-500">
                      Updated {{ formatDate(smartphone.updatedAt) }}
                    </span>
                    <a 
                      v-if="smartphone.url"
                      :href="smartphone.url" 
                      target="_blank"
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Component -->
        <PaginationControls 
          :current-page="store.currentPage"
          :total-pages="store.totalPages"
          :total="store.pagination.total"
          :limit="store.pagination.limit"
          :offset="store.pagination.offset"
          @previous="store.prevPage"
          @next="store.nextPage"
          @goto-page="store.goToPage"
          class="mt-8"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSmartphoneStore } from '~/stores/smartphone'
import { computed, onMounted, ref } from 'vue'

const store = useSmartphoneStore()

const getGradeBadgeClass = (grade) => {
  if (!grade) return 'badge badge-gray'
  
  const gradeUpper = grade.toUpperCase()
  if (gradeUpper.includes('A') || gradeUpper.includes('EXCELLENT') || gradeUpper.includes('NEW')) {
    return 'badge badge-green'
  } else if (gradeUpper.includes('B') || gradeUpper.includes('GOOD')) {
    return 'badge badge-blue'
  } else if (gradeUpper.includes('C') || gradeUpper.includes('FAIR')) {
    return 'badge badge-gray'
  } else {
    return 'badge badge-red'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const applyFilters = async (filters) => {
  console.log('Applying filters:', filters) // Debug log
  await store.fetchSmartphones(1) // Fetch with current filters
}

const clearFilters = async () => {
  store.clearFilters()
  await store.fetchSmartphones(1)
}

const refreshData = async () => {
  try {
    await store.fetchSmartphones(1)
    await store.fetchFilterOptions()
  } catch (error) {
    console.error('Error refreshing data:', error)
  }
}

onMounted(async () => {
  await refreshData()
})
</script>
