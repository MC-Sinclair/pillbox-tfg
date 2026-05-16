<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Models\Medication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicationController extends Controller
{
    public function index(Request $request): Response
    {
        $medications = Medication::where('residence_id', $request->user()->residence_id)
            ->orderBy('name')
            ->get(['id', 'name', 'brand', 'active_ingredient', 'format', 'description']);

        return Inertia::render('Medico/Medicamentos', [
            'tab'         => 'medicamentos',
            'medications' => $medications,
        ]);
    }
}