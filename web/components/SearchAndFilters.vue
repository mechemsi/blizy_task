<template>
  <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-6">Filters</h3>
    
    <!-- Filter Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      <!-- Brand Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Brand</label>
        <Listbox v-model="selectedBrand">
          <div class="relative">
            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm border border-gray-300">
              <span class="block truncate">{{ selectedBrand || 'All Brands' }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" :value="null">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">All Brands</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption v-for="brand in filterOptions.brands" :key="brand" :value="brand" v-slot="{ active, selected }">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">{{ brand }}</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <!-- Model Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Model</label>
        <Listbox v-model="selectedModel">
          <div class="relative">
            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm border border-gray-300">
              <span class="block truncate">{{ selectedModel || 'All Models' }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" :value="null">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">All Models</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption v-for="model in filterOptions.models" :key="model" :value="model" v-slot="{ active, selected }">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">{{ model }}</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <!-- Category Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <Listbox v-model="selectedCategory">
          <div class="relative">
            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm border border-gray-300">
              <span class="block truncate">{{ selectedCategory || 'All Categories' }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" :value="null">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">All Categories</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption v-for="category in filterOptions.categories" :key="category" :value="category" v-slot="{ active, selected }">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">{{ category }}</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <!-- Grade Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Grade</label>
        <Listbox v-model="selectedGrade">
          <div class="relative">
            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm border border-gray-300">
              <span class="block truncate">{{ selectedGrade || 'All Grades' }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" :value="null">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">All Grades</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption v-for="grade in filterOptions.grades" :key="grade" :value="grade" v-slot="{ active, selected }">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">{{ grade }}</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <!-- Storage Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Storage</label>
        <Listbox v-model="selectedStorage">
          <div class="relative">
            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm border border-gray-300">
              <span class="block truncate">{{ selectedStorage || 'All Storage' }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" :value="null">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">All Storage</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption v-for="storage in filterOptions.storage" :key="storage" :value="storage" v-slot="{ active, selected }">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">{{ storage }}</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <!-- Color Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <Listbox v-model="selectedColor">
          <div class="relative">
            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm border border-gray-300">
              <span class="block truncate">{{ selectedColor || 'All Colors' }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" :value="null">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">All Colors</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption v-for="color in filterOptions.colors" :key="color" :value="color" v-slot="{ active, selected }">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">{{ color }}</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <!-- Availability Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
        <Listbox v-model="selectedAvailability">
          <div class="relative">
            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm border border-gray-300">
              <span class="block truncate">{{ selectedAvailability || 'All Availability' }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" :value="null">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">All Availability</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption v-for="availability in filterOptions.availability" :key="availability" :value="availability" v-slot="{ active, selected }">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">{{ availability }}</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <!-- Currency Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
        <Listbox v-model="selectedCurrency">
          <div class="relative">
            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm border border-gray-300">
              <span class="block truncate">{{ selectedCurrency || 'All Currencies' }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption v-slot="{ active, selected }" :value="null">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">All Currencies</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption v-for="currency in filterOptions.currencies" :key="currency" :value="currency" v-slot="{ active, selected }">
                <li :class="[active ? 'bg-blue-100 text-blue-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                  <span :class="[selected ? 'font-medium' : 'font-normal']">{{ currency }}</span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <!-- Price Range -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div class="flex space-x-2">
          <div class="flex-1">
            <input
              v-model="minPrice"
              type="number"
              placeholder="Min Price"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
            />
          </div>
          <div class="flex-1">
            <input
              v-model="maxPrice"
              type="number"
              placeholder="Max Price"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between">
      <button
        @click="clearFilters"
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <XMarkIcon class="w-4 h-4 mr-2" />
        Clear Filters
      </button>
      
      <button
        @click="$emit('apply')"
        :disabled="loading"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FunnelIcon class="w-4 h-4 mr-2" />
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import {
  CheckIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  filterOptions: {
    type: Object,
    required: true,
    default: () => ({
      brands: [],
      models: [],
      categories: [],
      grades: [],
      storage: [],
      colors: [],
      availability: [],
      currencies: []
    })
  },
  brand: { type: String, default: null },
  model: { type: String, default: null },
  category: { type: String, default: null },
  grade: { type: String, default: null },
  storage: { type: String, default: null },
  color: { type: String, default: null },
  availability: { type: String, default: null },
  currency: { type: String, default: null },
  minPrice: { type: String, default: '' },
  maxPrice: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits([
  'apply',
  'clear',
  'update:brand',
  'update:model',
  'update:category',
  'update:grade',
  'update:storage',
  'update:color',
  'update:availability',
  'update:currency',
  'update:minPrice',
  'update:maxPrice'
])

// Filter states with v-model sync
const selectedBrand = computed({
  get: () => props.brand,
  set: (value) => emit('update:brand', value)
})
const selectedModel = computed({
  get: () => props.model,
  set: (value) => emit('update:model', value)
})
const selectedCategory = computed({
  get: () => props.category,
  set: (value) => emit('update:category', value)
})
const selectedGrade = computed({
  get: () => props.grade,
  set: (value) => emit('update:grade', value)
})
const selectedStorage = computed({
  get: () => props.storage,
  set: (value) => emit('update:storage', value)
})
const selectedColor = computed({
  get: () => props.color,
  set: (value) => emit('update:color', value)
})
const selectedAvailability = computed({
  get: () => props.availability,
  set: (value) => emit('update:availability', value)
})
const selectedCurrency = computed({
  get: () => props.currency,
  set: (value) => emit('update:currency', value)
})
const minPrice = computed({
  get: () => props.minPrice,
  set: (value) => emit('update:minPrice', value)
})
const maxPrice = computed({
  get: () => props.maxPrice,
  set: (value) => emit('update:maxPrice', value)
})

const applyFilters = () => {
  emit('apply-filters', {
    brand: selectedBrand.value,
    model: selectedModel.value,
    category: selectedCategory.value,
    grade: selectedGrade.value,
    storage: selectedStorage.value,
    color: selectedColor.value,
    availability: selectedAvailability.value,
    currency: selectedCurrency.value,
    minPrice: minPrice.value || '',
    maxPrice: maxPrice.value || ''
  })
  
}

const clearFilters = () => {
  // Update v-model bindings
  emit('update:brand', null)
  emit('update:model', null)
  emit('update:category', null)
  emit('update:grade', null)
  emit('update:storage', null)
  emit('update:color', null)
  emit('update:availability', null)
  emit('update:currency', null)
  emit('update:minPrice', '')
  emit('update:maxPrice', '')
  // Trigger clear
  emit('clear-filters')
}

// Remove auto-apply on individual filter changes as it might cause too many API calls
// Instead, let user click Apply Filters button explicitly
</script>
