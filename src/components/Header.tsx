export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            CRI
          </span>
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__product">Leads</span>
        </div>
        <p className="app-header__meta">Painel interno</p>
      </div>
    </header>
  )
}
