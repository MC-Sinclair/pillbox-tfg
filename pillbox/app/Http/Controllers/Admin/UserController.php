<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $residenceId = $request->user()->residence_id;

        $users = User::where('residence_id', $residenceId)
            ->with('residents:id,first_name,last_name,room')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'active', 'created_at']);

        $residents = \App\Models\Resident::where('residence_id', $residenceId)
            ->where('status', 'active')
            ->orderBy('last_name')
            ->get(['id', 'first_name', 'last_name', 'room']);

        return Inertia::render('Admin/Index', [
            'tab'       => 'usuarios',
            'users'     => $users,
            'residents' => $residents,
        ]);
    }

    public function assignResidents(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'resident_ids'   => ['array'],
            'resident_ids.*' => ['exists:residents,id'],
        ]);

        $user->residents()->sync($request->resident_ids ?? []);

        return back();
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role'     => ['required', Rule::in(['admin', 'medico', 'gerocultora'])],
            'active'   => ['boolean'],
        ]);

        User::create([
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'password'     => Hash::make($validated['password']),
            'role'         => $validated['role'],
            'active'       => $validated['active'] ?? true,
            'residence_id' => $request->user()->residence_id,
        ]);

        return back();
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role'     => ['required', Rule::in(['admin', 'medico', 'gerocultora'])],
            'active'   => ['boolean'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $data = [
            'name'   => $validated['name'],
            'email'  => $validated['email'],
            'role'   => $validated['role'],
            'active' => $validated['active'] ?? $user->active,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return back();
    }
}