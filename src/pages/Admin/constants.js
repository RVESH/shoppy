export const ADMIN_API = "https://shoppy-api.rishabh-gaurav-verma.workers.dev/api";

export const CATEGORIES = [
  { slug: "women-essentials",      name: "Women Essentials",   icon: "👗" },
  { slug: "mobile-accessories",    name: "Mobile Accessories", icon: "📱" },
  { slug: "grocery-fmcg",          name: "Grocery & FMCG",     icon: "🛒" },
  { slug: "service-hub",           name: "Services",           icon: "🛠️" },
  { slug: "household-essentials",  name: "Household",          icon: "🏠" },
  { slug: "tailoring-accessories", name: "Tailoring",          icon: "🧵" },
];

export const EMPTY_PRODUCT = {
  id: "", name: "", category: "women-essentials", subCategory: "",
  brand: "", description: "", price: "", mrp: "", stock: "", rating: "4.5",
  image: "", isService: false, deliveryAvailable: true, priceType: "fixed",
  processingTime: "", tags: "", variants: {}, documentsRequired: [],
};

export const calcDiscount = (price, mrp) =>
  mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;