// Copy and option lists taken from the live FoodOS marketing site.

export const homeModules = [
  { no: '01', label: 'Billing', title: 'GST bills in two taps', text: 'Split bills, discounts, UPI, card and cash — handled the way Indian counters actually run them.' },
  { no: '02', label: 'Orders', title: 'Kitchen-ready fast', text: 'Dine-in, takeaway and delivery in one clean queue.' },
  { no: '03', label: 'Inventory', title: 'Stock that counts itself', text: 'Auto-deplete ingredients from every bill you raise, with low-stock alerts.' },
  { no: '04', label: 'Reports', title: 'Clear daily reads', text: 'Sales, peak hours, bestsellers — no spreadsheets.' },
  { no: '05', label: 'WhatsApp', title: 'Guests who return', text: 'Receipts, offers and follow-ups on the channel they actually use.' },
  { no: '06', label: 'Multi-outlet', title: 'One screen, every branch', text: 'Menus and prices synced across kitchens and cities.' },
];

export const featureModules = [
  { no: '01', label: 'Fast Billing', title: 'GST bills in two taps', text: 'Quick billing, discounts, split payments, and multiple payment methods. Bills print or go to WhatsApp.', bullets: ['Split and merge bills', 'UPI, card and cash', 'GST-ready invoices', 'Offline fallback'] },
  { no: '02', label: 'Order Management', title: 'One queue for every order', text: 'Dine-in, takeaway, and delivery orders appear on one screen for the kitchen.', bullets: ['Dine-in and takeaway', 'Delivery orders', 'Kitchen display', 'At-a-glance order status'] },
  { no: '03', label: 'Menu Management', title: 'Your menu, always current', text: 'Update items, prices, variants, and availability instantly, without support tickets.', bullets: ['Instant price edits', 'Variants and combos', 'Live sold-out ("86") marking', 'Per-outlet menus'] },
  { no: '04', label: 'Inventory', title: 'Stock that counts itself', text: 'Real-time ingredient and stock tracking, with alerts before stock runs out.', bullets: ['Recipe-level tracking', 'Automatic deduction on sale', 'Low-stock alerts', 'Wastage logging'] },
  { no: '05', label: 'Reports & Analytics', title: 'Clear daily reads', text: 'Sales, peak hours, best sellers, and performance, without manual spreadsheets.', bullets: ['Daily closing reports', 'Best sellers and margins', 'Peak-hour analysis', 'Export on demand'] },
  { no: '06', label: 'Customer Management', title: 'Guests who come back', text: 'Builds a customer database from each bill and flags the most valuable guests.', bullets: ['Automatic customer profiles', 'Visit and spend history', 'Segments and tags', 'WhatsApp engagement'] },
  { no: '07', label: 'Staff Management', title: 'The right access for everyone', text: 'Role-based access, staff activity tracking, and accountability for cash handling.', bullets: ['Roles and permissions', 'Shift activity logs', 'Cash-handling accountability', 'PIN-based login'] },
  { no: '08', label: 'Multi-Outlet', title: 'One screen, every branch', text: 'One dashboard to manage multiple restaurants, with menus, prices, and reports synced across kitchens and cities.', bullets: ['Central dashboard', 'Synced menus and prices', 'Outlet comparison', 'Consolidated reports'] },
];

export const compareRows = [
  ['Monthly fee', '₹999', '₹2,499+'],
  ['WhatsApp receipts', 'Included', 'Paid add-on'],
  ['Setup & onboarding', 'Same day, assisted', 'Weeks, DIY'],
  ['Extra modules', "None — it's all in", 'Surprise upgrades'],
  ['Support', 'People who know restaurants', 'Generic helpdesk'],
];

export const retentionSteps = [
  { title: 'Customer orders', text: 'Every transaction is captured and linked to a customer profile automatically.' },
  { title: 'FoodOS understands', text: 'Visit frequency, spend patterns and favourite items — no manual work.' },
  { title: 'Smart segments', text: 'VIPs, inactive guests, high spenders, birthdays this month.' },
  { title: 'Engage on WhatsApp', text: 'Personalised offers and updates — without another marketing tool.' },
  { title: 'Repeat orders', text: 'Bring back lapsed customers and increase visit frequency.' },
];


export const providers = [
{ name: 'Urban Piper', defaultAnnualCost: 36000 },
{ name: 'Adlogg', defaultAnnualCost: 36000 },
{ name: 'Shiprocket', defaultAnnualCost: 36000 },
{ name: 'ONDC', defaultAnnualCost: 36000 },
];

export const demoBusinessTypes = ['Restaurant / café', 'QSR', 'Cloud kitchen', 'Bar / brewery', 'Bakery'];
export const contactBusinessTypes = ['Restaurant / café', 'QSR', 'Cloud kitchen', 'Bar / brewery', 'Bakery', 'Restaurant chain'];
export const outletOptions = ['1', '2–5', '6–15', '15+'];

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '918484956995';
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hello@orders24.in';
