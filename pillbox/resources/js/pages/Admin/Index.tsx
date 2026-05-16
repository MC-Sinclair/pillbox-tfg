import { useState } from 'react'
import { useForm, router, usePage } from '@inertiajs/react'
import { UserCircle, Plus, X, Pill } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import '@/../css/admin.css'

type User = {
    id: number
    name: string
    email: string
    role: string
    active: boolean
    residents: Resident[]
}

type Resident = {
    id: number
    first_name: string
    last_name: string
    birth_date: string
    room: string
    doctor: string | null
    status: string
    users?: { id: number; name: string }[]
}

type Medication = {
    id: number
    name: string
    brand: string
    active_ingredient: string
    format: string
    description: string
}

type Props = {
    tab: 'usuarios' | 'residentes' | 'medicamentos'
    users?: User[]
    residents?: Resident[]
    gerocultoras?: { id: number; name: string }[]
    medications?: Medication[]
}

const ROLE_LABELS: Record<string, string> = {
    admin: 'Admin',
    medico: 'Médico',
    gerocultora: 'Gerocultora',
}

const STATUS_LABELS: Record<string, string> = {
    active:     'Activo',
    inactive:   'Inactivo',
    discharged: 'Alta',
}

const FORMAT_LABELS: Record<string, string> = {
    tablet: 'Comprimido',
    capsule: 'Cápsula',
    syrup: 'Jarabe',
    injection: 'Inyección',
    drops: 'Gotas',
    patch: 'Parche',
    other: 'Otro',
}

// ── Tab Usuarios ─────────────────────────────────────────────────────────────
function TabUsuarios({ users = [], residents = [] }: { users: User[]; residents: Resident[] }) {
    const { auth } = usePage().props as any
    const currentUserId: number = auth?.user?.id

    const [addOpen, setAddOpen] = useState(false)
    const [editUser, setEditUser] = useState<User | null>(null)
    const [assignUser, setAssignUser] = useState<User | null>(null)

    const addForm = useForm({ name: '', email: '', password: '', role: '', active: true })
    const editForm = useForm({ name: '', email: '', password: '', role: '', active: true })
    const assignForm = useForm<{ resident_ids: number[] }>({ resident_ids: [] })

    function openEdit(user: User) {
        editForm.setData({ name: user.name, email: user.email, password: '', role: user.role, active: user.active })
        setEditUser(user)
    }

    function openAssign(user: User) {
        assignForm.setData({ resident_ids: user.residents.map((r) => r.id) })
        setAssignUser(user)
    }

    function submitAdd(e: React.FormEvent) {
        e.preventDefault()
        addForm.post('/admin/usuarios', { onSuccess: () => { setAddOpen(false); addForm.reset() } })
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault()
        if (!editUser) { return }
        editForm.put(`/admin/usuarios/${editUser.id}`, { onSuccess: () => setEditUser(null) })
    }

    function submitAssign(e: React.FormEvent) {
        e.preventDefault()
        if (!assignUser) { return }
        assignForm.post(`/admin/usuarios/${assignUser.id}/residentes`, { onSuccess: () => setAssignUser(null) })
    }

    function toggleResident(id: number) {
        const ids = assignForm.data.resident_ids
        assignForm.setData('resident_ids', ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id])
    }

    function deleteUser(id: number) {
        if (confirm('¿Eliminar este usuario?')) {
            router.delete(`/admin/usuarios/${id}`)
        }
    }

    return (
        <div className="admin-user-section">
            <ul className="admin-user-list">
                {users.map((user) => (
                    <li key={user.id} className="admin-user-card">
                        <div className='contend-info'>
                            <div className="admin-user-avatar">
                                <UserCircle size={58} />
                            </div>
                            <div className="admin-user-info">
                                <p className="admin-user-name">{user.name}</p>
                                <p className="admin-user-email">{user.email}</p>
                                <div className="admin-user-badges">
                                    <Badge variant="secondary" className='badge-info'>{ROLE_LABELS[user.role] ?? user.role}</Badge>
                                    <Badge variant={user.active ? 'default' : 'destructive'} className='badge-info color'>
                                        {user.active ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="admin-user-actions">
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white boton" onClick={() => openAssign(user)}>
                                Pacientes asignados
                            </Button>
                            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-white boton" disabled={user.id === currentUserId} onClick={() => openEdit(user)}>
                                Modificar
                            </Button>
                            <Button size="sm" className="boton" variant="destructive" disabled={user.id === currentUserId} onClick={() => deleteUser(user.id)}>
                                Eliminar
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            <button className="admin-fab" onClick={() => setAddOpen(true)}>
                <Plus size={24} />
            </button>

            {/* Modal Añadir */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="max-w-md modal-usuario">
                    <DialogHeader>
                        <DialogTitle>Añadir usuario</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center mb-4 modal-avatar">
                        <UserCircle size={64} className="text-muted-foreground" />
                    </div>
                    <form onSubmit={submitAdd} className="flex flex-col gap-4 modal-form">
                        <div className="grid gap-1 modal-field">
                            <Label>Nombre</Label>
                            <Input required value={addForm.data.name} onChange={(e) => addForm.setData('name', e.target.value)} />
                            {addForm.errors.name && <p className="modal-error">{addForm.errors.name}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Email</Label>
                            <Input required type="email" value={addForm.data.email} onChange={(e) => addForm.setData('email', e.target.value)} />
                            {addForm.errors.email && <p className="modal-error">{addForm.errors.email}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Contraseña</Label>
                            <Input required type="password" value={addForm.data.password} onChange={(e) => addForm.setData('password', e.target.value)} />
                            {addForm.errors.password && <p className="modal-error">{addForm.errors.password}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Rol</Label>
                            <Select required value={addForm.data.role} onValueChange={(v) => addForm.setData('role', v)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="medico">Médico</SelectItem>
                                    <SelectItem value="gerocultora">Gerocultora</SelectItem>
                                </SelectContent>
                            </Select>
                            {addForm.errors.role && <p className="modal-error">{addForm.errors.role}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Estado</Label>
                            <Select value={addForm.data.active ? 'true' : 'false'} onValueChange={(v) => addForm.setData('active', v === 'true')}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Activo</SelectItem>
                                    <SelectItem value="false">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white mt-2 modal-submit" disabled={addForm.processing}>
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Modificar */}
            <Dialog open={!!editUser} onOpenChange={(o) => { if (!o) { setEditUser(null) } }}>
                <DialogContent className="max-w-md modal-usuario">
                    <DialogHeader>
                        <DialogTitle>Modificar usuario</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center mb-4 modal-avatar">
                        <UserCircle size={64} className="text-muted-foreground" />
                    </div>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4 modal-form">
                        <div className="grid gap-1 modal-field">
                            <Label>Nombre</Label>
                            <Input required value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} />
                            {editForm.errors.name && <p className="modal-error">{editForm.errors.name}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Email</Label>
                            <Input required type="email" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} />
                            {editForm.errors.email && <p className="modal-error">{editForm.errors.email}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Rol</Label>
                            <Select required value={editForm.data.role} onValueChange={(v) => editForm.setData('role', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="medico">Médico</SelectItem>
                                    <SelectItem value="gerocultora">Gerocultora</SelectItem>
                                </SelectContent>
                            </Select>
                            {editForm.errors.role && <p className="modal-error">{editForm.errors.role}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Estado</Label>
                            <Select value={editForm.data.active ? 'true' : 'false'} onValueChange={(v) => editForm.setData('active', v === 'true')}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Activo</SelectItem>
                                    <SelectItem value="false">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white mt-2 modal-submit" disabled={editForm.processing}>
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Pacientes asignados */}
            <Dialog open={!!assignUser} onOpenChange={(o) => { if (!o) { setAssignUser(null) } }}>
                <DialogContent className="max-w-md modal-pacientes">
                    <DialogHeader>
                        <DialogTitle>Pacientes asignados — {assignUser?.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitAssign} className="flex flex-col gap-3 modal-form">
                        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto modal-resident-list">
                            {residents.map((r) => {
                                const assigned = assignForm.data.resident_ids.includes(r.id)
                                return (
                                    <div key={r.id} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors modal-resident-row ${assigned ? 'border-green-500 bg-green-50 dark:bg-green-950 selected' : ''}`} onClick={() => toggleResident(r.id)}>
                                        <UserCircle size={36} className="text-muted-foreground shrink-0" />
                                        <div className="flex-1 min-w-0 modal-resident-info">
                                            <p className="font-medium text-sm modal-resident-name">{r.first_name} {r.last_name}</p>
                                            <p className="text-xs text-muted-foreground modal-resident-room">Habitación {r.room}</p>
                                        </div>
                                        {assigned && <X size={16} className="text-green-600 shrink-0" />}
                                    </div>
                                )
                            })}
                        </div>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white mt-2 modal-submit" disabled={assignForm.processing}>
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ── Tab Residentes ───────────────────────────────────────────────────────────
function TabResidentes({ residents = [], gerocultoras = [] }: { residents: Resident[]; gerocultoras: { id: number; name: string }[] }) {
    const [addOpen, setAddOpen] = useState(false)
    const [editResident, setEditResident] = useState<Resident | null>(null)
    const [assignResident, setAssignResident] = useState<Resident | null>(null)

    const addForm = useForm({ first_name: '', last_name: '', birth_date: '', room: '', doctor: '', status: 'active' })
    const editForm = useForm({ first_name: '', last_name: '', birth_date: '', room: '', doctor: '', status: 'active' })
    const assignForm = useForm<{ gerocultora_ids: number[] }>({ gerocultora_ids: [] })

    function openEdit(resident: Resident) {
        editForm.setData({
            first_name: resident.first_name,
            last_name:  resident.last_name,
            birth_date: resident.birth_date,
            room:       resident.room,
            doctor:     resident.doctor ?? '',
            status:     resident.status,
        })
        setEditResident(resident)
    }

    function openAssign(resident: Resident) {
        assignForm.setData({ gerocultora_ids: resident.users?.map((u) => u.id) ?? [] })
        setAssignResident(resident)
    }

    function submitAdd(e: React.FormEvent) {
        e.preventDefault()
        addForm.post('/admin/residentes', { onSuccess: () => { setAddOpen(false); addForm.reset() } })
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault()
        if (!editResident) { return }
        editForm.put(`/admin/residentes/${editResident.id}`, { onSuccess: () => setEditResident(null) })
    }

    function submitAssign(e: React.FormEvent) {
        e.preventDefault()
        if (!assignResident) { return }
        assignForm.post(`/admin/residentes/${assignResident.id}/gerocultoras`, { onSuccess: () => setAssignResident(null) })
    }

    function toggleGerocultora(id: number) {
        const ids = assignForm.data.gerocultora_ids
        assignForm.setData('gerocultora_ids', ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id])
    }

    function deleteResident(id: number) {
        if (confirm('¿Eliminar este paciente?')) {
            router.delete(`/admin/residentes/${id}`)
        }
    }

    return (
        <div className="admin-user-section">
            <ul className="admin-user-list">
                {residents.map((resident) => (
                    <li key={resident.id} className="admin-user-card">
                        <div className="contend-info">
                            <div className="admin-user-avatar">
                                <UserCircle size={58} />
                            </div>
                            <div className="admin-user-info">
                                <p className="admin-user-name">{resident.first_name} {resident.last_name}</p>
                                <p className="admin-user-email">
                                    Hab. {resident.room}{resident.doctor ? ` · Dr. ${resident.doctor}` : ''}
                                </p>
                                <div className="admin-user-badges">
                                    <Badge variant="secondary" className="badge-info">
                                        {STATUS_LABELS[resident.status] ?? resident.status}
                                    </Badge>
                                    {resident.users && resident.users.length > 0 && (
                                        <Badge variant="secondary" className="badge-info color">
                                            {resident.users.length} gerocultora{resident.users.length !== 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="admin-user-actions">
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white boton" onClick={() => openAssign(resident)}>
                                Gerocultoras
                            </Button>
                            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-white boton" onClick={() => openEdit(resident)}>
                                Modificar
                            </Button>
                            <Button size="sm" className="boton" variant="destructive" onClick={() => deleteResident(resident.id)}>
                                Eliminar
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            <button className="admin-fab" onClick={() => setAddOpen(true)}>
                <Plus size={24} />
            </button>

            {/* Modal Añadir */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="max-w-md modal-residente">
                    <DialogHeader>
                        <DialogTitle>Añadir paciente</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center mb-2 modal-avatar">
                        <UserCircle size={64} className="text-muted-foreground" />
                    </div>
                    <form onSubmit={submitAdd} className="flex flex-col gap-4 modal-form">
                        <div className="grid gap-1 modal-field">
                            <Label>Nombre</Label>
                            <Input required value={addForm.data.first_name} onChange={(e) => addForm.setData('first_name', e.target.value)} />
                            {addForm.errors.first_name && <p className="modal-error">{addForm.errors.first_name}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Apellidos</Label>
                            <Input required value={addForm.data.last_name} onChange={(e) => addForm.setData('last_name', e.target.value)} />
                            {addForm.errors.last_name && <p className="modal-error">{addForm.errors.last_name}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Habitación</Label>
                            <Input required value={addForm.data.room} onChange={(e) => addForm.setData('room', e.target.value)} />
                            {addForm.errors.room && <p className="modal-error">{addForm.errors.room}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Fecha de nacimiento</Label>
                            <Input required type="date" value={addForm.data.birth_date} onChange={(e) => addForm.setData('birth_date', e.target.value)} />
                            {addForm.errors.birth_date && <p className="modal-error">{addForm.errors.birth_date}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Médico responsable</Label>
                            <Input value={addForm.data.doctor} onChange={(e) => addForm.setData('doctor', e.target.value)} />
                            {addForm.errors.doctor && <p className="modal-error">{addForm.errors.doctor}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Estado</Label>
                            <Select value={addForm.data.status} onValueChange={(v) => addForm.setData('status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                    <SelectItem value="discharged">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white mt-2 modal-submit" disabled={addForm.processing}>
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Modificar */}
            <Dialog open={!!editResident} onOpenChange={(o) => { if (!o) { setEditResident(null) } }}>
                <DialogContent className="max-w-md modal-residente">
                    <DialogHeader>
                        <DialogTitle>Modificar paciente</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center mb-2 modal-avatar">
                        <UserCircle size={64} className="text-muted-foreground" />
                    </div>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4 modal-form">
                        <div className="grid gap-1 modal-field">
                            <Label>Nombre</Label>
                            <Input required value={editForm.data.first_name} onChange={(e) => editForm.setData('first_name', e.target.value)} />
                            {editForm.errors.first_name && <p className="modal-error">{editForm.errors.first_name}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Apellidos</Label>
                            <Input required value={editForm.data.last_name} onChange={(e) => editForm.setData('last_name', e.target.value)} />
                            {editForm.errors.last_name && <p className="modal-error">{editForm.errors.last_name}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Habitación</Label>
                            <Input required value={editForm.data.room} onChange={(e) => editForm.setData('room', e.target.value)} />
                            {editForm.errors.room && <p className="modal-error">{editForm.errors.room}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Fecha de nacimiento</Label>
                            <Input required type="date" value={editForm.data.birth_date} onChange={(e) => editForm.setData('birth_date', e.target.value)} />
                            {editForm.errors.birth_date && <p className="modal-error">{editForm.errors.birth_date}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Médico responsable</Label>
                            <Input value={editForm.data.doctor} onChange={(e) => editForm.setData('doctor', e.target.value)} />
                            {editForm.errors.doctor && <p className="modal-error">{editForm.errors.doctor}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Estado</Label>
                            <Select value={editForm.data.status} onValueChange={(v) => editForm.setData('status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                    <SelectItem value="discharged">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white mt-2 modal-submit" disabled={editForm.processing}>
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Gerocultoras asignadas */}
            <Dialog open={!!assignResident} onOpenChange={(o) => { if (!o) { setAssignResident(null) } }}>
                <DialogContent className="max-w-md modal-gerocultoras">
                    <DialogHeader>
                        <DialogTitle>Gerocultoras — {assignResident?.first_name} {assignResident?.last_name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitAssign} className="flex flex-col gap-3 modal-form">
                        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto modal-resident-list">
                            {gerocultoras.map((g) => {
                                const assigned = assignForm.data.gerocultora_ids.includes(g.id)
                                return (
                                    <div key={g.id} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors modal-resident-row ${assigned ? 'selected' : ''}`} onClick={() => toggleGerocultora(g.id)}>
                                        <UserCircle size={36} className="text-muted-foreground shrink-0" />
                                        <div className="flex-1 min-w-0 modal-resident-info">
                                            <p className="font-medium text-sm modal-resident-name">{g.name}</p>
                                        </div>
                                        {assigned && <X size={16} className="text-green-600 shrink-0" />}
                                    </div>
                                )
                            })}
                        </div>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white mt-2 modal-submit" disabled={assignForm.processing}>
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ── Tab Medicamentos ─────────────────────────────────────────────────────────
function TabMedicamentos({ medications = [] }: { medications: Medication[] }) {
    const [addOpen, setAddOpen] = useState(false)
    const [editMedication, setEditMedication] = useState<Medication | null>(null)

    const addForm = useForm({ name: '', brand: '', active_ingredient: '', format: 'tablet', description: '' })
    const editForm = useForm({ name: '', brand: '', active_ingredient: '', format: 'tablet', description: '' })

    function openEdit(med: Medication) {
        editForm.setData({
            name:              med.name,
            brand:             med.brand ?? '',
            active_ingredient: med.active_ingredient ?? '',
            format:            med.format,
            description:       med.description ?? '',
        })
        setEditMedication(med)
    }

    function submitAdd(e: React.FormEvent) {
        e.preventDefault()
        addForm.post('/admin/medicamentos', { onSuccess: () => { setAddOpen(false); addForm.reset() } })
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault()
        if (!editMedication) { return }
        editForm.put(`/admin/medicamentos/${editMedication.id}`, { onSuccess: () => setEditMedication(null) })
    }

    function deleteMedication(id: number) {
        if (confirm('¿Eliminar este medicamento?')) {
            router.delete(`/admin/medicamentos/${id}`)
        }
    }

    return (
        <div className="admin-user-section">
            <ul className="admin-user-list">
                {medications.map((med) => (
                    <li key={med.id} className="admin-user-card">
                        <div className="contend-info">
                            <div className="admin-user-avatar">
                                <Pill size={58} />
                            </div>
                            <div className="admin-user-info">
                                <p className="admin-user-name">{med.name}</p>
                                <p className="admin-user-email">
                                    {med.active_ingredient || '—'}{med.brand ? ` · ${med.brand}` : ''}
                                </p>
                                <div className="admin-user-badges">
                                    <Badge variant="secondary" className="badge-info">
                                        {FORMAT_LABELS[med.format] ?? med.format}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="admin-user-actions">
                            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-white boton" onClick={() => openEdit(med)}>
                                Modificar
                            </Button>
                            <Button size="sm" className="boton" variant="destructive" onClick={() => deleteMedication(med.id)}>
                                Eliminar
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            <button className="admin-fab" onClick={() => setAddOpen(true)}>
                <Plus size={24} />
            </button>

            {/* Modal Añadir */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="max-w-md modal-medicamento">
                    <DialogHeader>
                        <DialogTitle>Añadir medicamento</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitAdd} className="flex flex-col gap-4 modal-form">
                        <div className="grid gap-1 modal-field">
                            <Label>Nombre</Label>
                            <Input required value={addForm.data.name} onChange={(e) => addForm.setData('name', e.target.value)} />
                            {addForm.errors.name && <p className="modal-error">{addForm.errors.name}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Marca</Label>
                            <Input value={addForm.data.brand} onChange={(e) => addForm.setData('brand', e.target.value)} />
                            {addForm.errors.brand && <p className="modal-error">{addForm.errors.brand}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Principio activo</Label>
                            <Input value={addForm.data.active_ingredient} onChange={(e) => addForm.setData('active_ingredient', e.target.value)} />
                            {addForm.errors.active_ingredient && <p className="modal-error">{addForm.errors.active_ingredient}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Formato</Label>
                            <Select required value={addForm.data.format} onValueChange={(v) => addForm.setData('format', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(FORMAT_LABELS).map(([val, label]) => (
                                        <SelectItem key={val} value={val}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {addForm.errors.format && <p className="modal-error">{addForm.errors.format}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Descripción</Label>
                            <Input value={addForm.data.description} onChange={(e) => addForm.setData('description', e.target.value)} />
                            {addForm.errors.description && <p className="modal-error">{addForm.errors.description}</p>}
                        </div>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white mt-2 modal-submit" disabled={addForm.processing}>
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Modificar */}
            <Dialog open={!!editMedication} onOpenChange={(o) => { if (!o) { setEditMedication(null) } }}>
                <DialogContent className="max-w-md modal-medicamento">
                    <DialogHeader>
                        <DialogTitle>Modificar medicamento</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4 modal-form">
                        <div className="grid gap-1 modal-field">
                            <Label>Nombre</Label>
                            <Input required value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} />
                            {editForm.errors.name && <p className="modal-error">{editForm.errors.name}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Marca</Label>
                            <Input value={editForm.data.brand} onChange={(e) => editForm.setData('brand', e.target.value)} />
                            {editForm.errors.brand && <p className="modal-error">{editForm.errors.brand}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Principio activo</Label>
                            <Input value={editForm.data.active_ingredient} onChange={(e) => editForm.setData('active_ingredient', e.target.value)} />
                            {editForm.errors.active_ingredient && <p className="modal-error">{editForm.errors.active_ingredient}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Formato</Label>
                            <Select required value={editForm.data.format} onValueChange={(v) => editForm.setData('format', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(FORMAT_LABELS).map(([val, label]) => (
                                        <SelectItem key={val} value={val}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editForm.errors.format && <p className="modal-error">{editForm.errors.format}</p>}
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Descripción</Label>
                            <Input value={editForm.data.description} onChange={(e) => editForm.setData('description', e.target.value)} />
                            {editForm.errors.description && <p className="modal-error">{editForm.errors.description}</p>}
                        </div>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white mt-2 modal-submit" disabled={editForm.processing}>
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminIndex({ tab, users = [], residents = [], gerocultoras = [], medications = [] }: Props) {
    return (
        <div className="admin-page">
            {tab === 'usuarios' && <TabUsuarios users={users} residents={residents} />}
            {tab === 'residentes' && <TabResidentes residents={residents} gerocultoras={gerocultoras} />}
            {tab === 'medicamentos' && <TabMedicamentos medications={medications} />}
        </div>
    )
}