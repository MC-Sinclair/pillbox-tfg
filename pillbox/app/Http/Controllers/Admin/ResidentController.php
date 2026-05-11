<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ResidentController extends Controller
{
    public function index(Request $request): Response
    {
        $residenceId = $request->user()->residence_id;

        $residents = Resident::where('residence_id', $residenceId)
            ->with('users:id,name')
            ->orderBy('last_name')
            ->get();

        $gerocultoras = User::where('residence_id', $residenceId)
            ->where('role', 'gerocultora')
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Index', [
            'tab'          => 'residentes',
            'residents'    => $residents,
            'gerocultoras' => $gerocultoras,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name'  => ['required', 'string', 'max:100'],
            'birth_date' => ['required', 'date'],
            'room'       => ['required', 'string', 'max:10'],
            'doctor'     => ['nullable', 'string', 'max:100'],
            'status'     => ['required', Rule::in(['active', 'inactive', 'discharged'])],
        ]);

        Resident::create([
            ...$validated,
            'residence_id' => $request->user()->residence_id,
        ]);

        return back();
    }

    public function update(Request $request, Resident $resident): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name'  => ['required', 'string', 'max:100'],
            'birth_date' => ['required', 'date'],
            'room'       => ['required', 'string', 'max:10'],
            'doctor'     => ['nullable', 'string', 'max:100'],
            'status'     => ['required', Rule::in(['active', 'inactive', 'discharged'])],
        ]);

        $resident->update($validated);

        return back();
    }

    public function destroy(Resident $resident): RedirectResponse
    {
        $resident->delete();

        return back();
    }

    public function assignGerocultoras(Request $request, Resident $resident): RedirectResponse
    {
        $request->validate([
            'gerocultora_ids'   => ['array'],
            'gerocultora_ids.*' => ['exists:users,id'],
        ]);

        $resident->users()->sync($request->gerocultora_ids ?? []);

        return back();
    }
}