import { useState } from 'react'
import { useForm, router } from '@inertiajs/react'
import { UserCircle, Plus, X } from 'lucide-react'
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
    room: string
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
                            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-white boton" onClick={() => openEdit(user)}>
                                Modificar
                            </Button>
                            <Button size="sm" className='boton' variant="destructive" onClick={() => deleteUser(user.id)}>
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
                            <Input value={addForm.data.name} onChange={(e) => addForm.setData('name', e.target.value)} />
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Email</Label>
                            <Input type="email" value={addForm.data.email} onChange={(e) => addForm.setData('email', e.target.value)} />
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Contraseña</Label>
                            <Input type="password" value={addForm.data.password} onChange={(e) => addForm.setData('password', e.target.value)} />
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Rol</Label>
                            <Select value={addForm.data.role} onValueChange={(v) => addForm.setData('role', v)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="medico">Médico</SelectItem>
                                    <SelectItem value="gerocultora">Gerocultora</SelectItem>
                                </SelectContent>
                            </Select>
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
                            <Input value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} />
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Email</Label>
                            <Input type="email" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} />
                        </div>
                        <div className="grid gap-1 modal-field">
                            <Label>Rol</Label>
                            <Select value={editForm.data.role} onValueChange={(v) => editForm.setData('role', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="medico">Médico</SelectItem>
                                    <SelectItem value="gerocultora">Gerocultora</SelectItem>
                                </SelectContent>
                            </Select>
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

// ── Tab Residentes (stub — misma estructura) ─────────────────────────────────
function TabResidentes({ residents = [], gerocultoras = [] }: { residents: Resident[]; gerocultoras: { id: number; name: string }[] }) {
    return (
        <div className="admin-stub">
            <p>Tab Residentes — proximamente</p>
            <p>{residents.length} residentes · {gerocultoras.length} gerocultoras disponibles</p>
        </div>
    )
}

// ── Tab Medicamentos (stub) ──────────────────────────────────────────────────
function TabMedicamentos({ medications = [] }: { medications: Medication[] }) {
    return (
        <div className="admin-stub">
            <p>Tab Medicamentos — proximamente</p>
            <p>{medications.length} medicamentos</p>
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