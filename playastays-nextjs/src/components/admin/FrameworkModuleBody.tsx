// ============================================================
// Admin — consistent “coming roadmap” body for framework modules
// ============================================================

interface RoadmapItem {
  title: string
  body: string
}

interface FrameworkModuleBodyProps {
  intro: string
  roadmap: RoadmapItem[]
  /** Optional link to related live area */
  relatedLink?: { href: string; label: string }
}

export function FrameworkModuleBody({ intro, roadmap, relatedLink }: FrameworkModuleBodyProps) {
  return (
    <div className="adm-page">
      <div className="adm-card">
        <div className="adm-card__header">
          <div className="adm-card__title">Roadmap (not live yet)</div>
        </div>
        <div className="adm-card__body adm-framework-intro">
          <p>{intro}</p>
          {relatedLink && (
            <p className="adm-framework-related">
              Related today: <a href={relatedLink.href}>{relatedLink.label}</a>
            </p>
          )}
          <ul className="adm-framework-roadmap">
            {roadmap.map(item => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
