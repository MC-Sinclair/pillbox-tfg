import '@/../css/medico.css'
import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Pill, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

type Medication = {
    id: number
    name: string
    brand: string | null
    active_ingredient: string | null
    format: string | null
    description: string | null
}

const FORMATS = [
    { value: 'tablet',    label: 'Comprimido' },
    { value: 'capsule',   label: 'Cápsula' },
    { value: 'syrup',     label: 'Jarabe' },
    { value: 'injection', label: 'Inyectable' },
    { value: 'drops',     label: 'Gotas' },
    { value: 'patch',     label: 'Parche' },
    { value: 'other',     label: 'Otro' },
]

type FormFields = {
    name: string
    brand: string
    active_ingredient: string
    format: string
    description: string
}

const emptyForm: FormFields = {
    name: '', brand: '', active_ingredient: '', format: '', description: '',
}

function MedicamentoModal({
    open, onClose, title, initialData, submitUrl, method,
}: {
    open: boolean
    onClose: () => void
    title: string
    initialData: FormFields
    submitUrl: string
    method: 'post' | 'put'
}) {
    const form = useForm<FormFields>(initialData)

    useEffect(() => {
        if (open) {
            form.reset()
        }
    }, [open])

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
                <form className="modal-form" onSubmit={submit} noValidate>
                    <div className="modal-field">
                        <label>Nombre</label>
                        <input
                            type="text"
                            placeholder="Ej: Paracetamol"
                            value={form.data.name}
                            onChange={e => form.setData('name', e.target.value)}
                        />
                        <p className="modal-error">{form.errors.name}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="modal-field">
                            <label>Marca</label>
                            <input
                                type="text"
                                placeholder="Ej: Kern Pharma"
                                value={form.data.brand}
                                onChange={e => form.setData('brand', e.target.value)}
                            />
                            <p className="modal-error">{form.errors.brand}</p>
                        </div>
                        <div className="modal-field">
                            <label>Principio activo</label>
                            <input
                                type="text"
                                placeholder="Ej: Paracetamol"
                                value={form.data.active_ingredient}
                                onChange={e => form.setData('active_ingredient', e.target.value)}
                            />
                            <p className="modal-error">{form.errors.active_ingredient}</p>
                        </div>
                    </div>

                    <div className="modal-field">
                        <label>Formato</label>
                        <Select
                            value={form.data.format}
                            onValueChange={v => form.setData('format', v)}
                        >
                            <SelectTrigger><SelectValue placeholder="Seleccionar formato" /></SelectTrigger>
                            <SelectContent>
                                {FORMATS.map(f => (
                                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="modal-error">{form.errors.format}</p>
                    </div>

                    <div className="modal-field">
                        <label>Descripción</label>
                        <textarea
                            placeholder="Observaciones opcionales..."
                            value={form.data.description}
                            onChange={e => form.setData('description', e.target.value)}
                        />
                        <p className="modal-error">{form.errors.description}</p>
                    </div>

                    <Button type="submit" className="modal-submit" disabled={form.processing}>
                        {form.processing ? 'Guardando...' : 'Guardar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function Medicamentos({ medications = [] }: { medications: Medication[] }) {
    const [search, setSearch] = useState('')
    const [addOpen, setAddOpen] = useState(false)
    const [addKey, setAddKey] = useState(0)
    const [editTarget, setEditTarget] = useState<Medication | null>(null)

    const filtered = medications.filter(m => {
        const q = search.toLowerCase()
        return !q
            || m.name.toLowerCase().includes(q)
            || m.brand?.toLowerCase().includes(q)
            || m.active_ingredient?.toLowerCase().includes(q)
    })

    function openAdd() {
        setAddKey(k => k + 1)
        setAddOpen(true)
    }

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
                                        <Badge variant="outline" style={{ fontSize: '0.72rem', color: 'var(--text)', borderColor: 'var(--border)' }}>
                                            {FORMATS.find(f => f.value === m.format)?.label ?? m.format}
                                        </Badge>
                                    )}
                                </div>
                                {m.description && (
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                        {m.description}
                                    </span>
                                )}
                            </div>
                            <div className="medico-card-actions">
                                <Button
                                    size="sm"
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white boton"
                                    onClick={() => setEditTarget(m)}
                                >
                                    Modificar
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <button className="medico-fab" onClick={openAdd} title="Nuevo medicamento">
                <Plus size={22} />
            </button>

            <MedicamentoModal
                key={addKey}
                open={addOpen}
                onClose={() => setAddOpen(false)}
                title="Nuevo medicamento"
                initialData={emptyForm}
                submitUrl="/medico/medicamentos"
                method="post"
            />

            {editTarget && (
                <MedicamentoModal
                    open={!!editTarget}
                    onClose={() => setEditTarget(null)}
                    title="Modificar medicamento"
                    initialData={{
                        name:             editTarget.name,
                        brand:            editTarget.brand ?? '',
                        active_ingredient: editTarget.active_ingredient ?? '',
                        format:           editTarget.format ?? '',
                        description:      editTarget.description ?? '',
                    }}
                    submitUrl={`/medico/medicamentos/${editTarget.id}`}
                    method="put"
                />
            )}
        </div>
    )
}