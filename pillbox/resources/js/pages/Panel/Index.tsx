import '@/../css/panel.css'
import { router } from '@inertiajs/react'
import { User, ClipboardCheck } from 'lucide-react'

type Administration = {
    id: number
    scheduled_at: string
    administered_at: string | null
    status: 'pending' | 'administered' | 'refused' | 'difficulty'
    notes: string | null
    user_id: number | null
}

type Prescription = {
    id: number
    dose: string
    route: string | null
    schedules: string[]
    medication: { id: number; name: string; brand: string | null }
    administrations: Administration[]
}

type Resident = {
    id: number
    first_name: string
    last_name: string
    room: string
    prescriptions: Prescription[]
}

const STATUS_LABELS = {
    administered: 'Administrado',
    refused:      'Rechazado',
    difficulty:   'Dificultad',
}

function mark(adminId: number, status: string) {
    router.patch(`/panel/administraciones/${adminId}`, { status }, { preserveScroll: true })
}

function undo(adminId: number) {
    router.patch(`/panel/administraciones/${adminId}`, { status: 'pending' }, { preserveScroll: true })
}

function fmtDate(iso: string) {
    return new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
}

function AdminRow({ prescription, time }: { prescription: Prescription; time: string }) {
    const admin = prescription.administrations.find(
        a => a.scheduled_at.substring(11, 16) === time
    )

    if (!admin) return null

    const isDone = admin.status !== 'pending'

    return (
        <div className="panel-admin-row">
            <span className="panel-admin-time">{time}</span>

            <div className="panel-admin-info">
                <div className="panel-admin-med">
                    {prescription.medication.name}
                    {prescription.medication.brand && (
                        <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> — {prescription.medication.brand}</span>
                    )}
                </div>
                <div className="panel-admin-detail">
                    {prescription.dose}{prescription.route ? ` · ${prescription.route}` : ''}
                </div>
            </div>

            <div className="panel-admin-actions">
                {isDone ? (
                    <>
                        <span className={`status-badge status-${admin.status}`}>
                            {STATUS_LABELS[admin.status as keyof typeof STATUS_LABELS]}
                        </span>
                        <button className="btn-status btn-undo" onClick={() => undo(admin.id)}>
                            Deshacer
                        </button>
                    </>
                ) : (
                    <>
                        <button className="btn-status btn-administered" onClick={() => mark(admin.id, 'administered')}>
                            ✓ Administrado
                        </button>
                        <button className="btn-status btn-refused" onClick={() => mark(admin.id, 'refused')}>
                            ✗ Rechazado
                        </button>
                        <button className="btn-status btn-difficulty" onClick={() => mark(admin.id, 'difficulty')}>
                            ⚠ Dificultad
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default function PanelIndex({ residents = [], today }: { residents: Resident[]; today: string }) {
    const hasWork = residents.some(r => r.prescriptions.length > 0)

    return (
        <div className="panel-page">
            <p className="panel-date">{fmtDate(today)}</p>
            <h1 className="panel-title">Panel de administraciones</h1>

            {!hasWork ? (
                <div className="panel-stub">
                    <ClipboardCheck size={36} />
                    <span>No tienes pacientes asignados con pautas activas hoy.</span>
                    <span style={{ fontSize: '0.82rem' }}>Contacta con el administrador si crees que es un error.</span>
                </div>
            ) : (
                residents.map(resident => {
                    if (resident.prescriptions.length === 0) return null

                    // Collect all unique time slots across all prescriptions, sorted
                    const allSlots = [...new Set(
                        resident.prescriptions.flatMap(p => p.schedules)
                    )].sort()

                    return (
                        <div key={resident.id} className="panel-resident-card">
                            <div className="panel-resident-header">
                                <User size={18} color="#64748b" />
                                <span className="panel-resident-name">
                                    {resident.last_name}, {resident.first_name}
                                </span>
                                <span className="panel-resident-room">Hab. {resident.room}</span>
                            </div>

                            {allSlots.map(time =>
                                resident.prescriptions.map(prescription =>
                                    prescription.schedules.includes(time) ? (
                                        <AdminRow
                                            key={`${prescription.id}-${time}`}
                                            prescription={prescription}
                                            time={time}
                                        />
                                    ) : null
                                )
                            )}
                        </div>
                    )
                })
            )}
        </div>
    )
}