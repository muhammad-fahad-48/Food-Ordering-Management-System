// ============================================================
// ENTITY CONFIG
// One entry per database table / API file.
// `fields` describes the add/edit form for tables with POST/PUT.
// GET-only tables omit `fields` — columns are read from the API
// response itself, since we don't need a form for them.
// `icon` refers to a key in ICONS (see icons.js).
// ============================================================

const ENTITIES = {

  customers: {
    label: "Customers",
    group: "manage",
    icon: "user",
    idField: "customer_id",
    endpoints: {
      list:   { method: "GET",    url: "/customers" },
      create: { method: "POST",   url: "/customers" },
      update: { method: "PUT",    url: "/customers/:id" },
      remove: { method: "DELETE", url: "/customers/:id" },
    },
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "password", label: "Password", type: "text", required: true },
    ],
  },

  restaurants: {
    label: "Restaurants",
    group: "manage",
    icon: "store",
    idField: "restaurant_id",
    endpoints: {
      list:   { method: "GET",    url: "/restaurant" },
      create: { method: "POST",   url: "/restaurants" },
      remove: { method: "DELETE", url: "/restaurants/:id" },
    },
    fields: [
      { name: "restaurant_name", label: "Restaurant name", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "contact_no", label: "Contact no.", type: "text", required: true },
    ],
  },

  categories: {
    label: "Categories",
    group: "manage",
    icon: "tag",
    idField: "category_id",
    endpoints: {
      list:   { method: "GET",    url: "/categories" },
      create: { method: "POST",   url: "/categories" },
      remove: { method: "DELETE", url: "/categories/:id" },
    },
    fields: [
      { name: "category_name", label: "Category name", type: "text", required: true },
    ],
  },

  fooditems: {
    label: "Food Items",
    group: "manage",
    icon: "utensils",
    idField: "food_id",
    endpoints: {
      list:   { method: "GET",    url: "/fooditem" },
      create: { method: "POST",   url: "/fooditem" },
      update: { method: "PUT",    url: "/fooditem/:id" },
      remove: { method: "DELETE", url: "/fooditem/:id" },
    },
    fields: [
      { name: "restaurant_id", label: "Restaurant ID", type: "number", required: true },
      { name: "category_id", label: "Category ID", type: "number", required: true },
      { name: "food_name", label: "Food name", type: "text", required: true },
      { name: "price", label: "Price", type: "number", step: "0.01", required: true },
      { name: "available", label: "Available", type: "select", options: [
        { value: "true", label: "Yes" }, { value: "false", label: "No" },
      ], required: true },
    ],
  },

  orders: {
    label: "Orders",
    group: "manage",
    icon: "box",
    idField: "order_id",
    endpoints: {
      list:   { method: "GET",    url: "/customerOrders" },
      create: { method: "POST",   url: "/customerOrders" },
      update: { method: "PUT",    url: "/customerOrders/:id" },
      remove: { method: "DELETE", url: "/customerOrders/:id" },
    },
    fields: [
      { name: "customer_id", label: "Customer ID", type: "number", required: true },
      { name: "total_amount", label: "Total amount", type: "number", step: "0.01", required: true },
      { name: "status", label: "Status", type: "select", options: [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "preparing", label: "Preparing" },
        { value: "out_for_delivery", label: "Out for delivery" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
      ], required: true },
    ],
  },

  payments: {
    label: "Payments",
    group: "manage",
    icon: "card",
    idField: "payment_id",
    endpoints: {
      list:   { method: "GET",  url: "/payment" },
      create: { method: "POST", url: "/payment" },
      update: { method: "PUT",  url: "/payment/:id" },
    },
    fields: [
      { name: "order_id", label: "Order ID", type: "number", required: true },
      { name: "payment_method", label: "Payment method", type: "select", options: [
        { value: "cash", label: "Cash" }, { value: "card", label: "Card" }, { value: "wallet", label: "Wallet" },
      ], required: true },
      { name: "amount", label: "Amount", type: "number", step: "0.01", required: true },
      { name: "payment_status", label: "Payment status", type: "select", options: [
        { value: "pending", label: "Pending" }, { value: "paid", label: "Paid" }, { value: "failed", label: "Failed" },
      ], required: true },
    ],
  },

  // ---- Read-only tables (GET only — columns rendered dynamically) ----
  addresses:          { label: "Customer Address",     group: "other", icon: "pin",     endpoints: { list: { method: "GET", url: "/addresses" } } },
  carts:              { label: "Cart",                 group: "other", icon: "cart",    endpoints: { list: { method: "GET", url: "/carts" } } },
  cartitems:          { label: "Cart Item",             group: "other", icon: "list",    endpoints: { list: { method: "GET", url: "/cartitems" } } },
  orderdetails:       { label: "Order Detail",          group: "other", icon: "list",    endpoints: { list: { method: "GET", url: "/orderdetails" } } },
  deliveries:         { label: "Delivery",              group: "other", icon: "truck",   endpoints: { list: { method: "GET", url: "/deliveries" } } },
  deliveryagents:     { label: "Delivery Agent",        group: "other", icon: "bike",    endpoints: { list: { method: "GET", url: "/deliveryagents" } } },
  reviews:            { label: "Review",                group: "other", icon: "star",    endpoints: { list: { method: "GET", url: "/reviews" } } },
  coupons:            { label: "Coupon",                group: "other", icon: "percent", endpoints: { list: { method: "GET", url: "/coupon" } } },
  admins:             { label: "Admin",                 group: "other", icon: "shield",  endpoints: { list: { method: "GET", url: "/admin" } } },
  orderstatushistory: { label: "Order Status History",  group: "other", icon: "clock",   endpoints: { list: { method: "GET", url: "/orderstatushistory" } } },
};

// Cards shown on the dashboard home screen
const DASHBOARD_CARDS = ["customers", "restaurants", "fooditems", "orders", "categories", "payments"];

// Entities whose live counts appear in the dashboard's overview strip
const OVERVIEW_STATS = ["customers", "restaurants", "orders", "fooditems"];
