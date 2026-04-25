// Barrel — segmented sitemap builders + XML helpers
export * from './xml'
export {
  SITEMAP_SEGMENTS,
  type SitemapSegment,
  isSitemapSegment,
  getSegmentEntries,
  getCoreSitemapEntries,
  getLegalSitemapEntries,
  getRentalsSitemapEntries,
  getBlogSitemapEntries,
  MIN_PROPERTY_REVIEWS_FOR_SITEMAP,
} from './segments'
