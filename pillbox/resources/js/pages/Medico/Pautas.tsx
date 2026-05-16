import '@/../css/medico.css'
import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Plus, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

type Resident   = { id: number; first_name: string; last_name: string; room: string }
type Medication = { id: number; name: string; brand: string; format: string }
type Prescription = {
    id: number
    resident: Resident
    medication: Medication
    user: { id: number; name: string }
    dose: string
    route: string | null
    schedules: string[]
    start_date: string
    end_date: string | null
    notes: string | null
    active: boolean
}

const ROUTES = ['Oral', 'Sublingual', 'Intravenosa', 'Intramuscular', 'Subcutánea', 'Tópica', 'Inhalatoria', 'Rectal']

type FormFields = {
    resident_id: string
    medication_id: string
    dose: string
    route: string
    schedules: string[]
    start_date: string
    end_date: string
    notes: string
    active: boolean
}

const emptyForm: FormFields = {
    resident_id: '', medication_id: '', dose: '', route: '',
    schedules: [], start_date: '', end_date: '', notes: '', active: true,
}

function PautaModal({
    open, onClose, title, initialData, residents, medications, submitUrl, method,
}: {
    open: boolean
    onClose: () => void
    title: string
    initialData: FormFields
    residents: Resident[]
    medications: Medication[]
    submitUrl: string
    method: 'post' | 'put'
}) {
    const form = useForm<FormFields>(initialData)
    const [newTime, setNewTime] = useState('')

    function addSchedule() {
        if (!newTime || form.data.schedules.includes(newTime)) return
        form.setData('schedules', [...form.data.schedules, newTime].sort())
        setNewTime('')
    }

    function removeSchedule(t: string) {
        form.setData('schedules', form.data.schedules.filter(s => s !== t))
    }

    function submit(e: React.SyntheticEvent) {
        e.preventDefault()
        form[method](submitUrl, { onSuccess: onClose })
    }

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="modal-pauta">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form className="modal-form" onSubmit={submit}>
                    <div className="modal-field">
                        <label>Paciente</label>
                        <Select
                            value={form.data.resident_id}
                            onValueChange={v => form.setData('resident_id', v)}
                        >
                            <SelectTrigger><SelectValue placeholder="Seleccionar paciente" /></SelectTrigger>
                            <SelectContent>
                                {residents.map(r => (
                                    <SelectItem key={r.id} value={String(r.id)}>
                                        {r.last_name}, {r.first_name} — Hab. {r.room}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.resident_id && <p className="modal-error">{form.errors.resident_id}</p>}
                    </div>

                    <div className="modal-field">
                        <label>Medicamento</label>
                        <Select
                            value={form.data.medication_id}
                            onValueChange={v => form.setData('medication_id', v)}
                        >
                            <SelectTrigger><SelectValue placeholder="Seleccionar medicamento" /></SelectTrigger>
                            <SelectContent>
                                {medications.map(m => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        {m.name} {m.brand ? `— ${m.brand}` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.medication_id && <p className="modal-error">{form.errors.medication_id}</p>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="modal-field">
                            <label>Dosis</label>
                            <input
                                type="text"
                                placeholder="Ej: 500mg"
                                value={form.data.dose}
                                onChange={e => form.setData('dose', e.target.value)}
                                required
                            />
                            {form.errors.dose && <p className="modal-error">{form.errors.dose}</p>}
                        </div>
                        <div className="modal-field">
                            <label>Vía de administración</label>
                            <Select
                                value={form.data.route}
                                onValueChange={v => form.setData('route', v)}
                            >
                                <SelectTrigger><SelectValue placeholder="Seleccionar vía" /></SelectTrigger>
                                <SelectContent>
                                    {ROUTES.map(r => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="modal-field">
                        <label>Horarios</label>
                        <div className="schedules-list">
                            {form.data.schedules.map(t => (
                                <span key={t} className="schedule-chip">
                                    {t}
                                    <button type="button" onClick={() => removeSchedule(t)}>×</button>
                                </span>
                            ))}
                        </div>
                        <div className="schedule-add-row">
                            <input
                                type="time"
                                value={newTime}
                                onChange={e => setNewTime(e.target.value)}
                            />
                            <Button type="button" size="sm" variant="outline" onClick={addSchedule}>
                                <Plus className="size-3.5" /> Añadir
                            </Button>
                        </div>
                        {form.errors.schedules && <p className="modal-error">{form.errors.schedules}</p>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="modal-field">
                            <label>Fecha inicio</label>
                            <input
                                type="date"
                                value={form.data.start_date}
                                onChange={e => form.setData('start_date', e.target.value)}
                                required
                            />
                            {form.errors.start_date && <p className="modal-error">{form.errors.start_date}</p>}
                        </div>
                        <div className="modal-field">
                            <label>Fecha fin (opcional)</label>
                            <input
                                type="date"
                                value={form.data.end_date}
                                onChange={e => form.setData('end_date', e.target.value)}
                            />
                            {form.errors.end_date && <p className="modal-error">{form.errors.end_date}</p>}
                        </div>
                    </div>

                    <div className="modal-field">
                        <label>Notas</label>
                        <textarea
                            placeholder="Observaciones opcionales..."
                            value={form.data.notes}
                            onChange={e => form.setData('notes', e.target.value)}
                        />
                    </div>

                    <div className="modal-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                            type="checkbox"
                            id="pauta-active"
                            checked={form.data.active}
                            onChange={e => form.setData('active', e.target.checked)}
                            style={{ width: 'auto', height: 'auto' }}
                        />
                        <label htmlFor="pauta-active" style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, letterSpacing: 0 }}>
                            Pauta activa
                        </label>
                    </div>

                    <Button type="submit" className="modal-submit" disabled={form.processing}>
                        {form.processing ? 'Guardando...' : 'Guardar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function Pautas({
    prescriptions = [],
    residents = [],
    medications = [],
}: {
    prescriptions: Prescription[]
    residents: Resident[]
    medications: Medication[]
}) {
    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Prescription | null>(null)
    const deleteForm = useForm({})

    function openEdit(p: Prescription) {
        setEditTarget(p)
    }

    function deletePrescription(id: number) {
        if (!confirm('¿Eliminar esta pauta? Se borrarán todas sus administraciones.')) return
        deleteForm.delete(`/medico/pautas/${id}`)
    }

    return (
        <div className="medico-page">
            <h1 className="medico-title">Pautas</h1>

            {prescriptions.length === 0 ? (
                <div className="medico-stub">
                    <ClipboardList size={32} />
                    <span>No hay pautas registradas</span>
                </div>
            ) : (
                <ul className="medico-card-list">
                    {prescriptions.map(p => (
                        <li key={p.id} className="medico-card">
                            <div className="medico-card-icon">
                                <ClipboardList size={28} />
                            </div>
                            <div className="medico-card-info">
                                <span className="medico-card-title">
                                    {p.resident.last_name}, {p.resident.first_name}
                                    <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                                        Hab. {p.resident.room}
                                    </span>
                                </span>
                                <span className="medico-card-sub">
                                    {p.medication.name}{p.medication.brand ? ` — ${p.medication.brand}` : ''} · {p.dose}{p.route ? ` · ${p.route}` : ''}
                                </span>
                                <div className="medico-card-badges">
                                    {p.schedules.map(t => (
                                        <Badge key={t} variant="outline" style={{ fontSize: '0.75rem' }}>{t}</Badge>
                                    ))}
                                    <Badge
                                        style={{
                                            fontSize: '0.72rem',
                                            backgroundColor: p.active ? '#dcfce7' : '#fee2e2',
                                            color: p.active ? '#166534' : '#991b1b',
                                            border: 'none',
                                        }}
                                    >
                                        {p.active ? 'Activa' : 'Inactiva'}
                                    </Badge>
                                </div>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                                    {p.start_date} — {p.end_date ?? 'indefinido'}
                                    {p.user && ` · Dr. ${p.user.name}`}
                                </span>
                            </div>
                            <div className="medico-card-actions">
                                <Button
                                    size="sm"
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white boton"
                                    onClick={() => openEdit(p)}
                                >
                                    Modificar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="boton"
                                    onClick={() => deletePrescription(p.id)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <button className="medico-fab" onClick={() => setAddOpen(true)} title="Nueva pauta">
                <Plus size={22} />
            </button>

            <PautaModal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                title="Nueva pauta"
                initialData={emptyForm}
                residents={residents}
                medications={medications}
                submitUrl="/medico/pautas"
                method="post"
            />

            {editTarget && (
                <PautaModal
                    open={!!editTarget}
                    onClose={() => setEditTarget(null)}
                    title="Modificar pauta"
                    initialData={{
                        resident_id:   String(editTarget.resident.id),
                        medication_id: String(editTarget.medication.id),
                        dose:          editTarget.dose,
                        route:         editTarget.route ?? '',
                        schedules:     editTarget.schedules,
                        start_date:    editTarget.start_date,
                        end_date:      editTarget.end_date ?? '',
                        notes:         editTarget.notes ?? '',
                        active:        editTarget.active,
                    }}
                    residents={residents}
                    medications={medications}
                    submitUrl={`/medico/pautas/${editTarget.id}`}
                    method="put"
                />
            )}
        </div>
    )
}