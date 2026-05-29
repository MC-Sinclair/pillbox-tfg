<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Models\Medication;
use App\Models\Prescription;
use App\Models\Resident;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PrescriptionController extends Controller
{
    public function index(Request $request): Response
    {
        $residenceId = $request->user()->residence_id;

        $prescriptions = Prescription::whereHas('resident', fn ($q) => $q->where('residence_id', $residenceId))
            ->with([
                'resident:id,first_name,last_name,room',
                'medication:id,name,brand',
                'user:id,name',
            ])
            ->orderByDesc('created_at')
            ->get();

        $residents = Resident::where('residence_id', $residenceId)
            ->where('status', 'active')
            ->orderBy('last_name')
            ->get(['id', 'first_name', 'last_name', 'room']);

        $medications = Medication::where('residence_id', $residenceId)
            ->orderBy('name')
            ->get(['id', 'name', 'brand', 'format']);

        return Inertia::render('Medico/Pautas', [
            'tab'           => 'pautas',
            'prescriptions' => $prescriptions,
            'residents'     => $residents,
            'medications'   => $medications,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $residenceId = $request->user()->residence_id;

        $validated = $request->validate([
            'resident_id'   => ['required', 'exists:residents,id'],
            'medication_id' => ['required', 'exists:medications,id'],
            'dose'          => ['required', 'string', 'max:255'],
            'route'         => ['nullable', 'string', 'max:100'],
            'schedules'     => ['required', 'array', 'min:1'],
            'schedules.*'   => ['string'],
            'start_date'    => ['required', 'date'],
            'end_date'      => ['nullable', 'date', 'after:start_date'],
            'notes'         => ['nullable', 'string'],
            'active'        => ['boolean'],
        ]);

        abort_if(
            ! Resident::where('id', $validated['resident_id'])->where('residence_id', $residenceId)->exists(),
            403
        );

        abort_if(
            ! Medication::where('id', $validated['medication_id'])->where('residence_id', $residenceId)->exists(),
            403
        );

        Prescription::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('medico.pautas.index');
    }

    public function update(Request $request, Prescription $prescription): RedirectResponse
    {
        $residenceId = $request->user()->residence_id;

        abort_if($prescription->resident->residence_id !== $residenceId, 403);

        $validated = $request->validate([
            'resident_id'   => ['required', 'exists:residents,id'],
            'medication_id' => ['required', 'exists:medications,id'],
            'dose'          => ['required', 'string', 'max:255'],
            'route'         => ['nullable', 'string', 'max:100'],
            'schedules'     => ['required', 'array', 'min:1'],
            'schedules.*'   => ['string'],
            'start_date'    => ['required', 'date'],
            'end_date'      => ['nullable', 'date', 'after:start_date'],
            'notes'         => ['nullable', 'string'],
            'active'        => ['boolean'],
        ]);

        $prescription->update($validated);

        return redirect()->route('medico.pautas.index');
    }

    public function destroy(Request $request, Prescription $prescription): RedirectResponse
    {
        abort_if($prescription->resident->residence_id !== $request->user()->residence_id, 403);

        $prescription->delete();

        return back();
    }
}