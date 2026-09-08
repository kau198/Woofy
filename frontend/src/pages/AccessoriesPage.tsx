import { Backpack, Check, Glasses, LockKeyhole, PawPrint, Shirt, ShoppingBag, Tag, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Mascot } from '../components/Mascot'
import { useWoofy } from '../contexts/WoofyContext'
import { apiRequest, runAction } from '../services/api'

interface AccessoryItem {
  id: number
  slug: string
  name: string
  type: string
  price: number
  owned: boolean
  equipped: boolean
  color: string
  mascotAccessory?: 'bandana' | 'bow'
}

const tabs = ['Todos', 'Meus itens', 'Bandanas', 'Coleiras', 'Especiais'] as const
type AccessoryTab = typeof tabs[number]

export function AccessoriesPage() {
  const { pet, paws, refreshData } = useWoofy()
  const [busy, setBusy] = useState(false)
  const [activeTab, setActiveTab] = useState<AccessoryTab>('Todos')
  const [accessories, setAccessories] = useState<AccessoryItem[]>([])

  const loadAccessories = () => apiRequest<AccessoryItem[]>('/accessories').then(setAccessories)
  useEffect(() => { runAction(loadAccessories()) }, [])

  const equip = async (id: number) => {
    if (busy) return
    setBusy(true)
    try {
    await apiRequest(`/accessories/${id}/equip`, { method: 'POST' })
    await Promise.all([loadAccessories(), refreshData()])
    } finally { setBusy(false) }
  }

  const visibleAccessories = accessories.filter((item) => activeTab === 'Todos'
    || (activeTab === 'Meus itens' && item.owned)
    || item.type === activeTab)

  return (
    <div className="accessories-page page-enter">
      <div className="page-heading-row"><div><span className="page-kicker">UM MIMO PARA SEU AMIGO</span><h1>Acessórios</h1><p>Troque patinhas por itens especiais para {pet.name}.</p></div><div className="big-paw-balance"><PawPrint fill="currentColor" /><span><small>Seu saldo</small><strong>{paws} patinhas</strong></span></div></div>
      <div className="accessories-tabs">{tabs.map((tab) => <button type="button" className={activeTab === tab ? 'active' : ''} aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</div>
      <div className="accessory-grid">
        {visibleAccessories.map((item) => {
          const previewIcons: Record<string, LucideIcon> = { Coleiras: Tag, Gravatas: Shirt, Especiais: Glasses, Mochilas: Backpack }
          const PreviewIcon = previewIcons[item.type]
          const canBuy = paws >= item.price
          return <article className={`accessory-card ${item.equipped ? 'equipped' : ''}`} key={item.id}>
            {item.equipped && <span className="equipped-label"><Check /> Equipado</span>}
            <div className="accessory-preview" style={{ background: `${item.color}18` }}><Mascot coat={pet.coat} gender={pet.gender} personality={pet.personality} size="md" accessory={item.mascotAccessory ?? 'none'} decorative />{PreviewIcon && <span className="accessory-shape" style={{ background: item.color }} aria-hidden="true"><PreviewIcon size={22} strokeWidth={2} /></span>}</div>
            <div className="accessory-info"><small>{item.type}</small><h3>{item.name}</h3><div>{item.owned ? <span className="owned"><Check /> Desbloqueado</span> : <span className="price"><PawPrint fill="currentColor" /> {item.price}</span>}<button className="item-status" type="button" disabled={busy || item.equipped || (!item.owned && !canBuy)} onClick={() => runAction(equip(item.id))}>{item.equipped ? 'Em uso' : item.owned ? 'Equipar' : canBuy ? 'Desbloquear' : <><LockKeyhole /> Faltam patinhas</>}</button></div></div>
          </article>
        })}
      </div>
      <div className="store-note"><ShoppingBag /><div><strong>Seu armário acompanha você.</strong><p>Complete tarefas e hábitos para liberar novos visuais.</p></div></div>
    </div>
  )
}
