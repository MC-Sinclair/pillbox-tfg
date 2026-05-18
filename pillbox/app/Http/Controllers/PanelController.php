<?php

namespace App\Http\Controllers;

use App\Models\Administration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PanelController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $today = now()->toDateString();

        $residents = $user->residents()
            ->where('status', 'active')
            ->with(['prescriptions' => function ($q) use ($today) {
                $q->where('active', true)
                    ->where('start_date', '<=', $today)
                    ->where(fn ($q) => $q->whereNull('end_date')->orWhere('end_date', '>=', $today))
                    ->with([
                        'medication:id,name,brand',
                        'administrations' => fn ($q) => $q->whereDate('scheduled_at', $today),
                    ]);
            }])
            ->get(['residents.id', 'first_name', 'last_name', 'room']);

        foreach ($residents as $resident) {
            foreach ($resident->prescriptions as $prescription) {
                $existingTimes = $prescription->administrations
                    ->map(fn ($a) => $a->scheduled_at->format('H:i'))
                    ->all();

                foreach ($prescription->schedules as $time) {
                    if (! in_array($time, $existingTimes)) {
                        Administration::create([
                            'prescription_id' => $prescription->id,
                            'scheduled_at' => $today.' '.$time.':00',
                            'status' => 'pending',
                        ]);
                    }
                }
            }
        }

        $residents->load([
            'prescriptions.medication',
            'prescriptions.administrations' => fn ($q) => $q->whereDate('scheduled_at', $today),
        ]);

        return Inertia::render('Panel/Index', [
            'residents' => $residents,
            'today' => $today,
        ]);
    }

    public function updateAdministration(Request $request, Administration $administration): RedirectResponse
    {
        abort_if(
            ! $request->user()->residents()->where('residents.id', $administration->prescription->resident_id)->exists(),
            403
        );

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'administered', 'refused', 'difficulty'])],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $administration->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
            'user_id' => $request->user()->id,
            'administered_at' => $validated['status'] !== 'pending' ? now() : null,
        ]);

        return back();
    }
}
