import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'

export function NotFoundPage() {
  return <main className="not-found"><Mascot size="lg" state="normal" /><span>404</span><h1>Ops, acho que seguimos a trilha errada.</h1><p>Esta página não existe, mas seu companheiro sabe o caminho de volta.</p><Link className="button button-primary" to="/"><ArrowLeft /> Voltar ao início</Link></main>
}
