// ============================================================
// Browse filter URL helpers — serialize modal + query params
// (filter logic stays in property-browse.ts)
// ============================================================

export interface BrowseModalDraft {
  bedrooms: string
  bathrooms: string
  type: string
  priceMin: string
  priceMax: string
  features: string[]
  neighborhood: string
  sort: string
  monthlyOnly: boolean
  managed: boolean
}

export function modalDraftFromSearchParams(sp: URLSearchParams): BrowseModalDraft {
  const feat = sp.getAll('feature')
  return {
    bedrooms: sp.get('bedrooms') ?? '',
    bathrooms: sp.get('bathrooms') ?? '',
    type: sp.get('type') ?? '',
    priceMin: sp.get('priceMin') ?? '',
    priceMax: sp.get('priceMax') ?? '',
    features: [...feat],
    neighborhood: sp.get('neighborhood') ?? '',
    sort: sp.get('sort') ?? 'recommended',
    monthlyOnly: sp.get('monthly') === '1',
    managed: sp.get('managed') === '1',
  }
}

/** Writes modal-owned keys; preserves checkIn, checkOut, guestsMin, city, listing */
export function applyModalDraftToParams(base: URLSearchParams, draft: BrowseModalDraft): URLSearchParams {
  const next = new URLSearchParams(base.toString())

  const setOrDel = (k: string, v: string) => {
    if (v) next.set(k, v)
    else next.delete(k)
  }

  setOrDel('bedrooms', draft.bedrooms)
  setOrDel('bathrooms', draft.bathrooms)
  setOrDel('type', draft.type)
  setOrDel('priceMin', draft.priceMin)
  setOrDel('priceMax', draft.priceMax)
  setOrDel('neighborhood', draft.neighborhood)
  setOrDel('sort', draft.sort === 'recommended' ? '' : draft.sort)

  next.delete('feature')
  draft.features.forEach(f => next.append('feature', f))

  if (draft.monthlyOnly) next.set('monthly', '1')
  else next.delete('monthly')

  if (draft.managed) next.set('managed', '1')
  else next.delete('managed')

  next.delete('page')
  return next
}

export function emptyModalDraft(): BrowseModalDraft {
  return {
    bedrooms: '',
    bathrooms: '',
    type: '',
    priceMin: '',
    priceMax: '',
    features: [],
    neighborhood: '',
    sort: 'recommended',
    monthlyOnly: false,
    managed: false,
  }
}

export function modalDraftEquals(a: BrowseModalDraft, b: BrowseModalDraft): boolean {
  if (
    a.bedrooms !== b.bedrooms ||
    a.bathrooms !== b.bathrooms ||
    a.type !== b.type ||
    a.priceMin !== b.priceMin ||
    a.priceMax !== b.priceMax ||
    a.neighborhood !== b.neighborhood ||
    a.sort !== b.sort ||
    a.monthlyOnly !== b.monthlyOnly ||
    a.managed !== b.managed
  ) {
    return false
  }
  if (a.features.length !== b.features.length) return false
  const sa = [...a.features].sort().join('|')
  const sb = [...b.features].sort().join('|')
  return sa === sb
}

/** Count of non-default modal filters (for badge on Filters button) */
export function countActiveModalFilters(sp: URLSearchParams): number {
  const d = modalDraftFromSearchParams(sp)
  let n = 0
  if (d.bedrooms) n++
  if (d.bathrooms) n++
  if (d.type) n++
  if (d.priceMin || d.priceMax) n++
  if (d.features.length) n += d.features.length
  if (d.neighborhood) n++
  if (d.sort && d.sort !== 'recommended') n++
  if (d.monthlyOnly) n++
  if (d.managed) n++
  return n
}
