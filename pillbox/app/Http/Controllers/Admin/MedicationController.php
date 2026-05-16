<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Medication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MedicationController extends Controller
{
    public function index(Request $request): Response
    {
        $medications = Medication::where('residence_id', $request->user()->residence_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Index', [
            'tab'         => 'medicamentos',
            'medications' => $medications,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'              => ['required', 'string', 'max:100'],
            'brand'             => ['nullable', 'string', 'max:100'],
            'active_ingredient' => ['nullable', 'string', 'max:100'],
            'format'            => ['required', Rule::in(['tablet', 'capsule', 'syrup', 'injection', 'drops', 'patch', 'other'])],
            'description'       => ['nullable', 'string', 'max:500'],
        ]);

        Medication::create([
            ...$validated,
            'residence_id' => $request->user()->residence_id,
        ]);

        return back();
    }

    public function update(Request $request, Medication $medication): RedirectResponse
    {
        abort_if($medication->residence_id !== $request->user()->residence_id, 403);

        $validated = $request->validate([
            'name'              => ['required', 'string', 'max:100'],
            'brand'             => ['nullable', 'string', 'max:100'],
            'active_ingredient' => ['nullable', 'string', 'max:100'],
            'format'            => ['required', Rule::in(['tablet', 'capsule', 'syrup', 'injection', 'drops', 'patch', 'other'])],
            'description'       => ['nullable', 'string', 'max:500'],
        ]);

        $medication->update($validated);

        return back();
    }

    public function destroy(Request $request, Medication $medication): RedirectResponse
    {
        abort_if($medication->residence_id !== $request->user()->residence_id, 403);

        $medication->delete();

        return back();
    }
}