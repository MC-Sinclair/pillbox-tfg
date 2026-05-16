<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Models\Administration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistorialController extends Controller
{
    public function index(Request $request): Response
    {
        $residenceId = $request->user()->residence_id;

        $administrations = Administration::whereHas(
            'prescription.resident',
            fn ($q) => $q->where('residence_id', $residenceId)
        )
            ->with([
                'prescription.resident:id,first_name,last_name',
                'prescription.medication:id,name',
                'user:id,name',
            ])
            ->orderByDesc('scheduled_at')
            ->limit(300)
            ->get();

        return Inertia::render('Medico/Historial', [
            'tab'             => 'historial',
            'administrations' => $administrations,
        ]);
    }
}