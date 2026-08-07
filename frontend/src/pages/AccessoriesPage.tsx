import { Check, LockKeyhole, PawPrint, ShoppingBag, Sparkles } from 'lucide-react'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'

const accessories = [
  { name: 'Bandana terracota', type: 'Bandanas', price: 0, owned: true, equipped: true, color: '#C95F43' },
  { name: 'Laço amarelo', type: 'Laços', price: 80, owned: true, equipped: false, color: '#F2B84B' },
  { name: 'Coleira verde', type: 'Coleiras', price: 120, owned: false, equipped: false, color: '#287465' },
  { name: 'Gravata azul', type: 'Gravatas', price: 160, owned: false, equipped: false, color: '#5C80A8' },
  { name: 'Óculos redondos', type: 'Especiais', price: 240, owned: false, equipped: false, color: '#765B4B' },
  { name: 'Mochila aventura', type: 'Mochilas', price: 320, owned: false, equipped: false, color: '#B4763B' },
]

export function AccessoriesPage() {
  const { pet, paws } = useWoofy()
  return (
    <div className="accessories-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">UM MIMO PARA SEU AMIGO</span><h1>Acessórios</h1><p>Troque patinhas por itens especiais para {pet.name}.</p></div><div className="big-paw-balance"><PawPrint fill="currentColor" /><span><small>Seu saldo</small><strong>{paws} patinhas</strong></span></div></div>
      <div className="accessories-tabs"><button className="active">Todos</button><button>Meus itens</button><button>Bandanas</button><button>Coleiras</button><button>Especiais</button></div>
      <div className="accessory-grid">
        {accessories.map((item, index) => <article className={`accessory-card ${item.equipped ? 'equipped' : ''}`} key={item.name}>{item.equipped && <span className="equipped-label"><Check /> Equipado</span>}<div className="accessory-preview" style={{ background: `${item.color}18` }}><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="md" accessory={index === 1 ? 'bow' : index === 0 ? 'bandana' : 'none'} />{index > 1 && <span className="accessory-shape" style={{ background: item.color }}>{index === 4 ? '◉' : index === 5 ? '▣' : '◆'}</span>}</div><div className="accessory-info"><small>{item.type}</small><h3>{item.name}</h3><div>{item.owned ? <span className="owned"><Check /> Desbloqueado</span> : <span className="price"><PawPrint fill="currentColor" /> {item.price}</span>}<button disabled={!item.owned && item.price > paws}>{item.equipped ? 'Usando' : item.owned ? 'Equipar' : item.price > paws ? <LockKeyhole /> : 'Desbloquear'}</button></div></div></article>)}
      </div>
      <div className="store-note"><ShoppingBag /><div><strong>Mais itens estão chegando!</strong><p>Novas coleções, cenários e brinquedos serão adicionados em breve.</p></div><Sparkles /></div>
    </div>
  )
}
