import '@/../css/medico.css'
import { useState } from 'react'
import { Pill } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Medication = {
    id: number
    name: string
    brand: string | null
    active_ingredient: string | null
    format: string | null
    description: string | null
}

export default function Medicamentos({ medications = [] }: { medications: Medication[] }) {
    const [search, setSearch] = useState('')

    const filtered = medications.filter(m => {
        const q = search.toLowerCase()
        return !q
            || m.name.toLowerCase().includes(q)
            || m.brand?.toLowerCase().includes(q)
            || m.active_ingredient?.toLowerCase().includes(q)
    })

    return (
        <div className="medico-page">
            <h1 className="medico-title">Catálogo de medicamentos</h1>

            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, marca o principio activo..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: '100%', maxWidth: '420px', height: '2.5rem',
                        padding: '0 0.75rem', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.9rem',
                        backgroundColor: '#fff', color: 'var(--text)',
                    }}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="medico-stub">
                    <Pill size={32} />
                    <span>No hay medicamentos registrados</span>
                </div>
            ) : (
                <ul className="medico-card-list">
                    {filtered.map(m => (
                        <li key={m.id} className="medico-card">
                            <div className="medico-card-icon">
                                <Pill size={28} />
                            </div>
                            <div className="medico-card-info">
                                <span className="medico-card-title">{m.name}</span>
                                <span className="medico-card-sub">
                                    {[m.brand, m.active_ingredient].filter(Boolean).join(' · ')}
                                </span>
                                <div className="medico-card-badges">
                                    {m.format && (
                                        <Badge variant="outline" style={{ fontSize: '0.72rem' }}>{m.format}</Badge>
                                    )}
                                </div>
                                {m.description && (
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                        {m.description}
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}