import { defineStore } from 'pinia'
import axios from 'axios'

interface Smartphone {
  id: number
  category: string | null
  brand: string | null
  model: string | null
  grade: string | null
  storage: string | null
  color: string | null
  conditionDescription: string | null
  price: number | null
  currency: string | null
  url: string | null
  imageUrl: string | null
  availability: string | null
  productCode: string | null
  scrapedAt: string
  updatedAt: string
}

interface FilterOptions {
  brands: string[]
  models: string[]
  categories: string[]
  grades: string[]
  storage: string[]
  colors: string[]
  availability: string[]
  currencies: string[]
}

interface PaginationInfo {
  total: number
  limit: number
  offset: number
  has_more: boolean
}

interface ApiPlatformResponse {
  '@context': string
  '@id': string
  '@type': string
  'member': Smartphone[]
  'totalItems': number
  'view'?: {
    '@id': string
    '@type': string
    'first'?: string
    'last'?: string
    'next'?: string
    'previous'?: string
  }
}

interface Filters {
  brand: string | null
  model: string | null
  category: string | null
  grade: string | null
  storage: string | null
  color: string | null
  availability: string | null
  currency: string | null
  minPrice: string
  maxPrice: string
}

export const useSmartphoneStore = defineStore('smartphone', {
  state: () => ({
    smartphones: [] as Smartphone[],
    loading: false,
    error: null as string | null,
    pagination: {
      total: 0,
      limit: 20,
      offset: 0,
      has_more: false
    } as PaginationInfo,
    filters: {
      brand: null,
      model: null,
      category: null,
      grade: null,
      storage: null,
      color: null,
      availability: null,
      currency: null,
      minPrice: '',
      maxPrice: ''
    } as Filters,
    filterOptions: {
      brands: [],
      models: [],
      categories: [],
      grades: [],
      storage: [],
      colors: [],
      availability: [],
      currencies: []
    } as FilterOptions
  }),

  getters: {
    currentPage: (state) => Math.floor(state.pagination.offset / state.pagination.limit) + 1,
    totalPages: (state) => Math.ceil(state.pagination.total / state.pagination.limit),
    hasNextPage: (state) => state.pagination.has_more,
    hasPrevPage: (state) => state.pagination.offset > 0
  },

  actions: {
    async fetchSmartphones(page: number = 1) {
      console.log('Store: fetchSmartphones called with page', page)
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        
        // Add filters with type safety
        if (this.filters.brand) params.append('brand', this.filters.brand)
        if (this.filters.model) params.append('model', this.filters.model)
        if (this.filters.category) params.append('category', this.filters.category)
        if (this.filters.grade) params.append('grade', this.filters.grade)
        if (this.filters.storage) params.append('storage', this.filters.storage)
        if (this.filters.color) params.append('color', this.filters.color)
        if (this.filters.availability) params.append('availability', this.filters.availability)
        if (this.filters.currency) params.append('currency', this.filters.currency)
        if (this.filters.minPrice) params.append('price[gte]', this.filters.minPrice)
        if (this.filters.maxPrice) params.append('price[lte]', this.filters.maxPrice)
        
        // Add default ordering
        params.append('order[updatedAt]', 'desc')
        
        console.log('Store: Making API call with params:', params.toString())

        const response = await axios.get<ApiPlatformResponse>(
          `/breezy_smartphones?${params.toString()}`,
          {
            headers: {
              'Accept': 'application/ld+json',
              'Content-Type': 'application/json'
            }
          }
        )

        console.log('Store: Received API response:', response.data)
        
        // Update store state with response data
        this.smartphones = response.data.member || []
        this.pagination = {
          total: response.data.totalItems || 0,
          limit: 20,
          offset: (page - 1) * 20,
          has_more: response.data.view?.next !== undefined
        }

      } catch (error: any) {
        console.error('Store: Error fetching smartphones:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to fetch smartphones'
      } finally {
        this.loading = false
      }
    },

    async fetchFilterOptions() {
      try {
        // Fetch filter options from the dedicated endpoint
        const response = await axios.get('/smartphones/filter-metadata', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        
        // Set filter options directly from response
        this.filterOptions = {
          brands: response.data.brands || [],
          models: response.data.models || [],
          categories: response.data.categories || [],
          grades: response.data.grades || [],
          storage: response.data.storage || [],
          colors: response.data.colors || [],
          availability: response.data.availability || [],
          currencies: response.data.currencies || []
        }
      } catch (error: any) {
        console.error('Error fetching filter options:', error)
        // Set fallback empty options if there's an error
        this.filterOptions = {
          brands: [],
          models: [],
          categories: [],
          grades: [],
          storage: [],
          colors: [],
          availability: [],
          currencies: []
        }
      }
    },

    setFilters(filters: Partial<Filters>) {
      console.log('Store: setFilters called with', filters)
      // Ensure we're not setting undefined values
      const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        acc[key] = value === undefined ? null : value;
        return acc;
      }, {} as Partial<Filters>);
      
      this.filters = { ...this.filters, ...cleanedFilters }
    },

    clearFilters() {
      this.filters = {
        brand: null,
        model: null,
        category: null,
        grade: null,
        storage: null,
        color: null,
        availability: null,
        currency: null,
        minPrice: '',
        maxPrice: ''
      }
      this.fetchSmartphones(1)
    },

    async nextPage() {
      if (this.hasNextPage) {
        await this.fetchSmartphones(this.currentPage + 1)
      }
    },

    async prevPage() {
      if (this.hasPrevPage) {
        await this.fetchSmartphones(this.currentPage - 1)
      }
    },

    async goToPage(page: number) {
      await this.fetchSmartphones(page)
    }
  }
})
