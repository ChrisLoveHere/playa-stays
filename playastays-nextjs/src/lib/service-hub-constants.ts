// ============================================================
// Top-level service hub slugs — no imports (safe for i18n route map)
// ============================================================

export const SERVICE_HUB_IDS = [
  'property-management',
  'airbnb-management',
  'vacation-rental-management',
  'sell-property',
] as const

export type ServiceHubId = (typeof SERVICE_HUB_IDS)[number]

export const SERVICE_HUB_EN_TO_ES: Record<ServiceHubId, string> = {
  'property-management': 'administracion-de-propiedades',
  'airbnb-management': 'administracion-airbnb',
  'vacation-rental-management': 'gestion-rentas-vacacionales',
  'sell-property': 'vender-propiedad',
}

export const SERVICE_HUB_ES_TO_EN: Record<string, ServiceHubId> = Object.fromEntries(
  Object.entries(SERVICE_HUB_EN_TO_ES).map(([en, es]) => [es, en as ServiceHubId])
) as Record<string, ServiceHubId>
