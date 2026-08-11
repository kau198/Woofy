import { Backpack, Check, Glasses, LockKeyhole, PawPrint, Shirt, ShoppingBag, Tag, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'

interface AccessoryItem {
  name: string
  type: string
  price: number
  owned: boolean
  equipped: boolean
  color: string
  mascotAccessory?: 'bandana' | 'bow'
  previewIcon?: LucideIcon
}

const accessories: AccessoryItem[] = [
  { name: 'Bandana terracota', type: 'Bandanas', price: 0, owned: true, equipped: true, color: '#C95F43', mascotAccessory: 'bandana' },
  { name: 'Laço amarelo', type: 'Laços', price: 80, owned: true, equipped: false, color: '#F2B84B', mascotAccessory: 'bow' },
  { name: 'Coleira verde', type: 'Coleiras', price: 120, owned: false, equipped: false, color: '#287465', previewIcon: Tag },
  { name: 'Gravata azul', type: 'Gravatas', price: 160, owned: false, equipped: false, color: '#5C80A8', previewIcon: Shirt },
  { name: 'Óculos redondos', type: 'Especiais', price: 240, owned: false, equipped: false, color: '#765B4B', previewIcon: Glasses },
  { name: 'Mochila aventura', type: 'Mochilas', price: 320, owned: false, equipped: false, color: '#B4763B', previewIcon: Backpack },
]

const tabs = ['Todos', 'Meus itens', 'Bandanas', 'Coleiras', 'Especiais'] as const
type AccessoryTab = typeof tabs[number]

export function AccessoriesPage() {
  const { pet, paws } = useWoofy()
  const [activeTab, setActiveTab] = useState<AccessoryTab>('Todos')
  const visibleAccessories = accessories.filter((item) => activeTab === 'Todos'
    || (activeTab === 'Meus itens' && item.owned)
    || item.type === activeTab)
  return (
    <div className="accessories-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">UM MIMO PARA SEU AMIGO</span><h1>Acessórios</h1><p>Troque patinhas por itens especiais para {pet.name}.</p></div><div className="big-paw-balance"><PawPrint fill="currentColor" /><span><small>Seu saldo</small><strong>{paws} patinhas</strong></span></div></div>
      <div className="accessories-tabs">{tabs.map((tab) => <button type="button" className={activeTab === tab ? 'active' : ''} aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</div>
      <div className="accessory-grid">
        {visibleAccessories.map((item) => {
          const PreviewIcon = item.previewIcon
          return <article className={`accessory-card ${item.equipped ? 'equipped' : ''}`} key={item.name}>{item.equipped && <span className="equipped-label"><Check /> Equipado</span>}<div className="accessory-preview" style={{ background: `${item.color}18` }}><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="md" accessory={item.mascotAccessory ?? 'none'} decorative />{PreviewIcon && <span className="accessory-shape" style={{ background: item.color }} aria-hidden="true"><PreviewIcon size={22} strokeWidth={2} /></span>}</div><div className="accessory-info"><small>{item.type}</small><h3>{item.name}</h3><div>{item.owned ? <span className="owned"><Check /> Desbloqueado</span> : <span className="price"><PawPrint fill="currentColor" /> {item.price}</span>}<span className="item-status">{item.equipped ? 'Em uso' : item.owned ? 'No armário' : <><LockKeyhole /> Em breve</>}</span></div></div></article>
        })}
      </div>
      <div className="store-note"><ShoppingBag /><div><strong>Mais itens estão chegando!</strong><p>Novas coleções, cenários e brinquedos serão adicionados em breve.</p></div></div>
    </div>
  )
}
