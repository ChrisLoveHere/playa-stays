// ============================================================
// PlayaStays — Structured location data
//
// Single source of truth for:
//   - Service area cities (major markets; includes Akumal — broader than the 6-slug featured grid)
//   - Neighborhoods per city
//   - Buildings / developments per city (and neighborhood where known)
//
// Used by: admin property editor, future browse/filter, SEO, collections.
// ============================================================

import { BUILDINGS_EXTRA } from './location-buildings-extra'

export interface CityDef {
  slug: string
  label: string
}

export interface NeighborhoodDef {
  value: string
  label: string
  city: string
}

export interface BuildingDef {
  value: string
  label: string
  city: string
  neighborhood?: string
}

// ── Service area cities ──────────────────────────────────

export const SERVICE_CITIES: CityDef[] = [
  { slug: 'playa-del-carmen', label: 'Playa del Carmen' },
  { slug: 'tulum',            label: 'Tulum' },
  { slug: 'puerto-morelos',   label: 'Puerto Morelos' },
  { slug: 'xpu-ha',           label: 'Xpu-Ha' },
  { slug: 'akumal',           label: 'Akumal' },
  { slug: 'cozumel',          label: 'Cozumel' },
  { slug: 'isla-mujeres',     label: 'Isla Mujeres' },
]

export const CITY_BY_SLUG = new Map(SERVICE_CITIES.map(c => [c.slug, c]))

/** Map stored city names (from WP meta) to slugs */
export function cityNameToSlug(name: string): string {
  const lower = name.toLowerCase().trim()
  for (const c of SERVICE_CITIES) {
    if (c.label.toLowerCase() === lower || c.slug === lower) return c.slug
  }
  return ''
}

export function citySlugToLabel(slug: string): string {
  return CITY_BY_SLUG.get(slug)?.label || slug
}

// ── Neighborhoods ────────────────────────────────────────

export const NEIGHBORHOODS: NeighborhoodDef[] = [
  // Playa del Carmen
  { value: 'centro',              label: 'Centro',               city: 'playa-del-carmen' },
  { value: 'zazil-ha',            label: 'Zazil-Ha',             city: 'playa-del-carmen' },
  { value: 'gonzalo-guerrero',    label: 'Gonzalo Guerrero',     city: 'playa-del-carmen' },
  { value: 'playacar',            label: 'Playacar',             city: 'playa-del-carmen' },
  { value: 'playacar-fase-1',     label: 'Playacar Fase 1',     city: 'playa-del-carmen' },
  { value: 'playacar-fase-2',     label: 'Playacar Fase 2',     city: 'playa-del-carmen' },
  { value: 'ejidal',              label: 'Ejidal',               city: 'playa-del-carmen' },
  { value: 'colosio',             label: 'Colosio',              city: 'playa-del-carmen' },
  { value: 'mision-del-carmen',   label: 'Misión del Carmen',    city: 'playa-del-carmen' },
  { value: 'mayakoba',            label: 'Mayakoba',             city: 'playa-del-carmen' },
  { value: 'corasol',             label: 'Corasol',              city: 'playa-del-carmen' },
  { value: 'grand-coral',         label: 'Grand Coral',          city: 'playa-del-carmen' },
  { value: 'selvamar',            label: 'Selvamar',             city: 'playa-del-carmen' },
  { value: 'punta-estrella',      label: 'Punta Estrella',       city: 'playa-del-carmen' },
  { value: 'real-ibiza',          label: 'Real Ibiza',           city: 'playa-del-carmen' },
  { value: 'el-cielo',            label: 'El Cielo',             city: 'playa-del-carmen' },
  { value: 'nicte-ha',            label: 'Nicte-Ha',             city: 'playa-del-carmen' },
  { value: 'loltun',              label: 'Loltún',               city: 'playa-del-carmen' },
  { value: 'bellavista',          label: 'Bellavista',           city: 'playa-del-carmen' },
  { value: 'bali',                label: 'Bali',                 city: 'playa-del-carmen' },
  { value: 'quinta-avenida',      label: '5th Avenue / Quinta Avenida', city: 'playa-del-carmen' },
  { value: 'playa-mamitas',       label: 'Playa Mamitas area',   city: 'playa-del-carmen' },
  { value: 'calle-34',            label: 'Calle 34 area',        city: 'playa-del-carmen' },
  { value: 'calle-38',            label: 'Calle 38 area',        city: 'playa-del-carmen' },
  { value: 'xcalacoco',           label: 'Xcalacoco',            city: 'playa-del-carmen' },
  { value: 'la-veleta-pdc',       label: 'La Veleta',            city: 'playa-del-carmen' },
  { value: 'bosque-real',         label: 'Bosque Real',          city: 'playa-del-carmen' },
  { value: 'playa-del-carmen-other', label: 'Other (Playa del Carmen)', city: 'playa-del-carmen' },

  // Tulum
  { value: 'tulum-centro',        label: 'Tulum Centro / Pueblo',  city: 'tulum' },
  { value: 'aldea-zama',          label: 'Aldea Zamá',             city: 'tulum' },
  { value: 'la-veleta',           label: 'La Veleta',              city: 'tulum' },
  { value: 'region-15',           label: 'Región 15',              city: 'tulum' },
  { value: 'tulum-hotel-zone',    label: 'Tulum Hotel Zone / Beach Road', city: 'tulum' },
  { value: 'holistika',           label: 'Holistika area',         city: 'tulum' },
  { value: 'tumben-kah',          label: 'Tumben Kah',             city: 'tulum' },
  { value: 'tankah',              label: 'Tankah Bay',             city: 'tulum' },
  { value: 'soliman-bay',         label: 'Solimán Bay',            city: 'tulum' },
  { value: 'tulum-other',         label: 'Other (Tulum)',          city: 'tulum' },

  // Puerto Morelos
  { value: 'puerto-morelos-centro', label: 'Centro / Town',         city: 'puerto-morelos' },
  { value: 'puerto-morelos-beach',  label: 'Beachfront',            city: 'puerto-morelos' },
  { value: 'ruta-cenotes',          label: 'Ruta de los Cenotes',   city: 'puerto-morelos' },
  { value: 'puerto-morelos-other',  label: 'Other (Puerto Morelos)', city: 'puerto-morelos' },

  // Xpu-Ha
  { value: 'xpu-ha-beach',         label: 'Xpu-Ha Beach',          city: 'xpu-ha' },
  { value: 'xpu-ha-inland',        label: 'Inland / Highway side',  city: 'xpu-ha' },

  // Akumal
  { value: 'akumal-centro',        label: 'Akumal Centro',         city: 'akumal' },
  { value: 'akumal-bay',           label: 'Akumal Bay / Playa',    city: 'akumal' },
  { value: 'half-moon-bay',        label: 'Half Moon Bay',         city: 'akumal' },
  { value: 'jade-bay',             label: 'Jade Bay',              city: 'akumal' },
  { value: 'south-akumal',         label: 'South Akumal',          city: 'akumal' },
  { value: 'akumal-other',         label: 'Other (Akumal)',        city: 'akumal' },

  // Cozumel
  { value: 'cozumel-centro',       label: 'San Miguel de Cozumel (Centro)', city: 'cozumel' },
  { value: 'zona-hotelera-norte',  label: 'Zona Hotelera Norte',   city: 'cozumel' },
  { value: 'zona-hotelera-sur',    label: 'Zona Hotelera Sur',     city: 'cozumel' },
  { value: 'cozumel-country-club', label: 'Cozumel Country Club area', city: 'cozumel' },
  { value: 'cozumel-other',        label: 'Other (Cozumel)',       city: 'cozumel' },

  // Isla Mujeres
  { value: 'isla-centro',          label: 'Centro (Downtown)',      city: 'isla-mujeres' },
  { value: 'playa-norte',          label: 'Playa Norte',            city: 'isla-mujeres' },
  { value: 'salina-chica',         label: 'Salina Chica',           city: 'isla-mujeres' },
  { value: 'punta-sur',            label: 'Punta Sur area',         city: 'isla-mujeres' },
  { value: 'isla-mujeres-other',   label: 'Other (Isla Mujeres)',   city: 'isla-mujeres' },
]

export function getNeighborhoodsForCity(citySlug: string): NeighborhoodDef[] {
  return NEIGHBORHOODS.filter(n => n.city === citySlug)
}

// ── Buildings / Developments ─────────────────────────────

export const BUILDINGS: BuildingDef[] = [
  // Playa del Carmen — Centro / 5th Ave
  { value: 'it-hotel',               label: 'IT Hotel / Residences',    city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'the-fives',              label: 'The Fives Downtown',       city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'miranda-playa',          label: 'Miranda Playa del Carmen', city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'condo-51',               label: 'Condo 51',                 city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'menesse-elements',       label: 'Menesse Elements',         city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'calle-38-lofts',         label: 'Calle 38 Lofts',          city: 'playa-del-carmen', neighborhood: 'calle-38' },
  { value: 'gallery-pdc',            label: 'Gallery',                  city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'a-lot-suites',           label: 'A-Lot Suites',            city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'quinto-sol',             label: 'Quinto Sol',               city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'siempre-playa',          label: 'Siempre Playa',            city: 'playa-del-carmen', neighborhood: 'centro' },

  // Playa del Carmen — Playacar
  { value: 'villas-playacar',        label: 'Villas Playacar',          city: 'playa-del-carmen', neighborhood: 'playacar' },
  { value: 'paseo-del-sol',          label: 'Paseo del Sol',            city: 'playa-del-carmen', neighborhood: 'playacar-fase-2' },
  { value: 'margaritas',             label: 'Las Margaritas',           city: 'playa-del-carmen', neighborhood: 'playacar-fase-2' },
  { value: 'xaman-ha',              label: 'Xaman-Ha',                city: 'playa-del-carmen', neighborhood: 'playacar-fase-2' },

  // Playa del Carmen — Corasol / Mayakoba area
  { value: 'nick-price-residences',  label: 'Nick Price Residences',    city: 'playa-del-carmen', neighborhood: 'corasol' },
  { value: 'fairmont-mayakoba',      label: 'Fairmont Mayakoba',        city: 'playa-del-carmen', neighborhood: 'mayakoba' },
  { value: 'banyan-tree-mayakoba',   label: 'Banyan Tree Mayakoba',     city: 'playa-del-carmen', neighborhood: 'mayakoba' },
  { value: 'rosewood-mayakoba',      label: 'Rosewood Mayakoba',        city: 'playa-del-carmen', neighborhood: 'mayakoba' },

  // Playa del Carmen — Grand Coral
  { value: 'grand-coral-riviera',    label: 'Grand Coral Riviera',      city: 'playa-del-carmen', neighborhood: 'grand-coral' },

  // Playa del Carmen — Gonzalo Guerrero / Zazil-Ha
  { value: 'nah-pdc',                label: 'NAH Playa del Carmen',     city: 'playa-del-carmen', neighborhood: 'gonzalo-guerrero' },
  { value: 'bric-pdc',               label: 'BRIC Hotel',               city: 'playa-del-carmen', neighborhood: 'gonzalo-guerrero' },
  { value: 'oasis-34',               label: 'Oasis 34',                 city: 'playa-del-carmen', neighborhood: 'calle-34' },

  // Playa del Carmen — El Cielo / Selvamar
  { value: 'el-cielo-residences',    label: 'El Cielo Residences',      city: 'playa-del-carmen', neighborhood: 'el-cielo' },
  { value: 'selvamar-residences',    label: 'Selvamar Residences',      city: 'playa-del-carmen', neighborhood: 'selvamar' },

  // Tulum
  { value: 'aldea-zama-condos',      label: 'Aldea Zamá Condos',        city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'anah-tulum',             label: 'Anah Tulum',               city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'arthouse-tulum',         label: 'Arthouse Tulum',           city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'bardo-tulum',            label: 'Bardo Tulum',              city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'la-veleta-tulum-res',    label: 'La Veleta Residences',     city: 'tulum', neighborhood: 'la-veleta' },
  { value: 'jungle-villas-tulum',    label: 'Jungle Villas',            city: 'tulum', neighborhood: 'la-veleta' },
  { value: 'tulum-hotel-zone-villas', label: 'Beach Road Villas',       city: 'tulum', neighborhood: 'tulum-hotel-zone' },
  // (Removed wrong mapping: "La Valeta" was tied to Aldea Zamá — use la-veleta entries below.)

  // Puerto Morelos
  { value: 'villas-morelos-1',       label: 'Villas Morelos',           city: 'puerto-morelos', neighborhood: 'puerto-morelos-centro' },
  { value: 'now-sapphire',           label: 'Now Sapphire Residences',  city: 'puerto-morelos', neighborhood: 'puerto-morelos-beach' },

  // Akumal
  { value: 'lol-ka-condos',          label: 'Lol-Ka Condos',            city: 'akumal', neighborhood: 'akumal-bay' },
  { value: 'tao-mexico',             label: 'TAO Mexico',               city: 'akumal', neighborhood: 'akumal-centro' },
  { value: 'bahia-principe',         label: 'Bahía Príncipe Residences', city: 'akumal', neighborhood: 'south-akumal' },

  // Cozumel
  { value: 'condo-casa-mexico',      label: 'Condos Casa México',       city: 'cozumel', neighborhood: 'cozumel-centro' },
  { value: 'las-anclas',             label: 'Las Anclas',               city: 'cozumel', neighborhood: 'cozumel-centro' },

  // Isla Mujeres
  { value: 'hotel-nau-isla',         label: 'Hotel Nau / Residences',   city: 'isla-mujeres', neighborhood: 'isla-centro' },
  { value: 'ixchel-beach',           label: 'Ixchel Beach Hotel',       city: 'isla-mujeres', neighborhood: 'playa-norte' },
  ...BUILDINGS_EXTRA,
]

export function getBuildingsForCity(citySlug: string): BuildingDef[] {
  return BUILDINGS.filter(b => b.city === citySlug)
}

export function getBuildingsForNeighborhood(citySlug: string, neighborhood: string): BuildingDef[] {
  return BUILDINGS.filter(b => b.city === citySlug && b.neighborhood === neighborhood)
}

/** City-scoped developments not pinned to a single neighborhood (corridors, multi-zone resorts). */
export function getBuildingsCityWide(citySlug: string): BuildingDef[] {
  return BUILDINGS.filter(b => b.city === citySlug && b.neighborhood == null)
}

/**
 * Admin building selector:
 * - No neighborhood: every building in the city.
 * - With neighborhood: that neighborhood’s buildings, then city-wide only.
 * Never surfaces buildings from other neighborhoods (replaces the old “fallback to full city” bug).
 */
export function getBuildingOptionsForAdmin(
  citySlug: string,
  neighborhoodSlug: string,
): { value: string; label: string }[] {
  if (!citySlug) return []
  const nh = neighborhoodSlug.trim()
  if (!nh) {
    return getBuildingsForCity(citySlug)
      .map(b => ({ value: b.value, label: b.label }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }
  const inHood = getBuildingsForNeighborhood(citySlug, nh)
    .map(b => ({ value: b.value, label: b.label }))
    .sort((a, b) => a.label.localeCompare(b.label))
  const cityWide = getBuildingsCityWide(citySlug)
    .map(b => ({ value: b.value, label: `${b.label} · city-wide` }))
    .sort((a, b) => a.label.localeCompare(b.label))
  const seen = new Set<string>()
  const out: { value: string; label: string }[] = []
  for (const o of inHood) {
    if (seen.has(o.value)) continue
    seen.add(o.value)
    out.push(o)
  }
  for (const o of cityWide) {
    if (seen.has(o.value)) continue
    seen.add(o.value)
    out.push(o)
  }
  return out
}
