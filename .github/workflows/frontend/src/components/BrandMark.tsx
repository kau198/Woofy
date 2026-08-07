import { Link } from 'react-router-dom'

export function BrandMark({ compact = false, to = '/' }: { compact?: boolean; to?: string }) {
  return (
    <Link to={to} className="brand-mark" aria-label="Woofy — início">
      <span className="brand-icon" aria-hidden="true">
        <span className="brand-ear brand-ear-left" />
        <span className="brand-ear brand-ear-right" />
        <span className="brand-face">
          <span className="brand-eye brand-eye-left" />
          <span className="brand-eye brand-eye-right" />
          <span className="brand-nose" />
        </span>
      </span>
      {!compact && <span className="brand-word">woofy</span>}
    </Link>
  )
}
