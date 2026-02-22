// ============================================
//   SHoppy - Central Data Index
//   Import this file anywhere in your React app
// ============================================

import categories from './categories.json'

import women    from './products/women.json'
import grocery  from './products/grocery.json'
import household from './products/household.json'
import mobile   from './products/mobile.json'
import services from './products/services.json'
import tailoring from './products/tailoring.json'

// All products combined in one array
export const allProducts = [
  ...women,
  ...grocery,
  ...household,
  ...mobile,
  ...services,
  ...tailoring
]

// Export categories list
export { categories }

// Get products by category slug
export const getByCategory = (slug) =>
  allProducts.filter(p => p.category === slug)

// Get only services
export const allServices = allProducts.filter(p => p.isService === true)

// Get only physical products
export const physicalProducts = allProducts.filter(p => p.isService === false)

// Search products by keyword
export const searchProducts = (keyword) => {
  const query = keyword.toLowerCase()
  return allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.tags.some(tag => tag.toLowerCase().includes(query)) ||
    p.brand.toLowerCase().includes(query) ||
    p.subCategory.toLowerCase().includes(query)
  )
}

// Get product by ID
export const getProductById = (id) =>
  allProducts.find(p => p.id === id)
