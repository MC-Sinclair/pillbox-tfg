import '@/../css/medico.css'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

type Administration = {
    id: number
    scheduled_at: string
    administered_at: string | null
    status: 'pending' | 'administered' | 'refused' | 'difficulty'
    notes: string | null
    user: { id: number; name: string } | null
    prescription: {
        dose: string
        resident: { id: number; first_name: string; last_name: string }
        medication: { id: number; name: string }
    }
}

const STATUS_LABELS: Record<string, string> = {
    pending:      'Pendiente',
    administered: 'Administrado',
    refused:      'Rechazado',
    difficulty:   'Dificultad',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    pending:      { bg: '#fef9c3', color: '#854d0e' },
    administered: { bg: '#dcfce7', color: '#166534' },
    refused:      { bg: '#fee2e2', color: '#991b1b' },
    difficulty:   { bg: '#ffedd5', color: '#9a3412' },
}

function fmt(dt: string | null) {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Historial({ administrations = [] }: { administrations: Administration[] }) {
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')

    const filtered = administrations.filter(a => {
        const name = `${a.prescription.resident.first_name} ${a.prescription.resident.last_name}`.toLowerCase()
        const med  = a.prescription.medication.name.toLowerCase()
        const q    = search.toLowerCase()
        const matchSearch = !q || name.includes(q) || med.includes(q)
        const matchStatus = !filterStatus || a.status === filterStatus
        return matchSearch && matchStatus
    })

    return (
        <div className="medico-page">
            <h1 className="medico-title">Historial de administraciones</h1>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Buscar paciente o medicamento..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        flex: 1, minWidth: '200px', height: '2.5rem',
                        padding: '0 0.75rem', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', fontSize: '0.9rem',
                        backgroundColor: '#fff', color: 'var(--text)',
                    }}
                />
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    style={{
                        height: '2.5rem', padding: '0 0.75rem',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem', backgroundColor: '#fff', color: 'var(--text)',
                    }}
                >
                    <option value="">Todos los estados</option>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="medico-stub">
                    <span>No hay registros que mostrar</span>
                </div>
            ) : (
                <table className="historial-table">
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Medicamento</th>
                            <th>Dosis</th>
                            <th>Programado</th>
                            <th>Administrado</th>
                            <th>Estado</th>
                            <th>Gerocultora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => {
                            const colors = STATUS_COLORS[a.status] ?? STATUS_COLORS.pending
                            return (
                                <tr key={a.id}>
                                    <td style={{ fontWeight: 500 }}>
                                        {a.prescription.resident.last_name}, {a.prescription.resident.first_name}
                                    </td>
                                    <td>{a.prescription.medication.name}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{a.prescription.dose}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{fmt(a.scheduled_at)}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{fmt(a.administered_at)}</td>
                                    <td>
                                        <Badge style={{ fontSize: '0.72rem', backgroundColor: colors.bg, color: colors.color, border: 'none' }}>
                                            {STATUS_LABELS[a.status]}
                                        </Badge>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{a.user?.name ?? '—'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )
}