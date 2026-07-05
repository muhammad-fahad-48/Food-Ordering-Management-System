// ============================================================
// ICONS — small hand-drawn line icons, 24x24, stroke-based.
// Kept intentionally simple and consistent (same stroke width,
// rounded caps) so the whole set reads as one family.
// ============================================================

const ICON_PATHS = {
  grid: `<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>`,

  user: `<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-4.1 3.4-6.8 7.5-6.8s7.5 2.7 7.5 6.8"/>`,

  store: `<path d="M4 9.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5"/><path d="M3 4h18l1.4 4.6a2 2 0 0 1-2 2.4h-.3a2.1 2.1 0 0 1-2-1.6 2.1 2.1 0 0 1-2 1.6 2.1 2.1 0 0 1-2-1.6 2.1 2.1 0 0 1-2 1.6 2.1 2.1 0 0 1-2-1.6 2.1 2.1 0 0 1-2 1.6 2.1 2.1 0 0 1-2-1.6 2.1 2.1 0 0 1-2 1.6h-.3a2 2 0 0 1-2-2.4z"/>`,

  tag: `<path d="M20 12.6 12.6 20a2 2 0 0 1-2.8 0l-6.8-6.8a2 2 0 0 1-.6-1.4V5a1 1 0 0 1 1-1h6.8a2 2 0 0 1 1.4.6l6.8 6.8a2 2 0 0 1 0 2.2z"/><circle cx="7.5" cy="7.5" r="1.2"/>`,

  utensils: `<path d="M6 2.5v7.6a1.9 1.9 0 0 0 3.8 0V2.5M7.9 10.1V21.5"/><path d="M16.5 2.5c-1.7 0-3 2-3 4.6 0 2 .9 3.2 2.1 3.6v10.8"/>`,

  box: `<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>`,

  card: `<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19"/><path d="M6 15h4"/>`,

  pin: `<path d="M12 21s-6.8-6.8-6.8-11.6a6.8 6.8 0 0 1 13.6 0C18.8 14.2 12 21 12 21z"/><circle cx="12" cy="9.4" r="2.4"/>`,

  cart: `<circle cx="9.5" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M2.5 3h2.2l2.1 11.3a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.6L20.8 7H5.3"/>`,

  list: `<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>`,

  truck: `<rect x="1.5" y="7" width="13" height="9.5" rx="1"/><path d="M14.5 10h3.8l3.2 3.2v3.3h-7z"/><circle cx="6" cy="18.5" r="1.7"/><circle cx="17" cy="18.5" r="1.7"/>`,

  bike: `<circle cx="6" cy="17" r="3.2"/><circle cx="18" cy="17" r="3.2"/><path d="M6 17l4-8h4l3.5 8M10 9h3.5M10 9l2.5 4"/>`,

  star: `<path d="M12 2.8l2.7 5.9 6.4.6-4.8 4.4 1.4 6.3L12 16.9l-5.7 3.1 1.4-6.3-4.8-4.4 6.4-.6z"/>`,

  percent: `<circle cx="7" cy="7" r="2.6"/><circle cx="17" cy="17" r="2.6"/><path d="M19 5 5 19"/>`,

  shield: `<path d="M12 3l7.5 3.4v5.4c0 5-3.2 8.3-7.5 9.8-4.3-1.5-7.5-4.8-7.5-9.8V6.4z"/>`,

  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.3 2"/>`,

  plus: `<path d="M12 5v14M5 12h14"/>`,

  edit: `<path d="M4 20h4.2L19 9.2a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L4 15.8z"/><path d="M13.5 6.5l4 4"/>`,

  trash: `<path d="M4.5 7h15M9.5 7V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4A1.3 1.3 0 0 1 14.5 4.8V7M18.5 7l-.8 12a2 2 0 0 1-2 1.9H8.3a2 2 0 0 1-2-1.9L5.5 7"/>`,
};

// Brand mark: a small route arriving at a pin — echoes the login illustration
const BRAND_MARK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3.5 17c3.5-1 6-4 8-7.5" stroke-dasharray="0.5 3.2"/>
  <circle cx="3.5" cy="17" r="1.1" fill="currentColor" stroke="none"/>
  <path d="M16 3.2a3.6 3.6 0 0 1 3.6 3.6c0 2.6-3.6 6-3.6 6s-3.6-3.4-3.6-6A3.6 3.6 0 0 1 16 3.2z"/>
  <circle cx="16" cy="6.8" r="1.15" fill="currentColor" stroke="none"/>
</svg>`;

function icon(name, size = 18) {
  const path = ICON_PATHS[name] || ICON_PATHS.grid;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}
