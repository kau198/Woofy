import { Link } from 'react-router-dom'

export function BrandMark({ compact = false, to = '/' }: { compact?: boolean; to?: string }) {
  return (
    <Link to={to} className="brand-mark" aria-label="Woofy — início">
      <span className="brand-icon" aria-hidden="true">
        <img src={`${import.meta.env.BASE_URL}woofy-logo-256.webp`} alt="" width={256} height={256} draggable={false} />
      </span>
      {!compact && <span className="brand-word">WOOFY</span>}
    </Link>
  )
}
