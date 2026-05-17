<?php

namespace App\Http\Controllers;

use App\Mail\TwoFactorCodeMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorChallengeController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('auth/two-factor-challenge');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate(['code' => 'required|digits:6']);

        $user = $request->user();

        if (! $user->two_factor_code || $validated['code'] !== $user->two_factor_code) {
            return back()->withErrors(['code' => 'Código incorrecto.']);
        }

        if (now()->isAfter($user->two_factor_expires_at)) {
            $user->update(['two_factor_code' => null, 'two_factor_expires_at' => null]);

            return back()->withErrors(['code' => 'El código ha expirado. Solicita uno nuevo.']);
        }

        $user->update(['two_factor_code' => null, 'two_factor_expires_at' => null]);
        session(['two_factor_verified' => true]);

        $default = match ($user->role) {
            'admin'       => route('admin.usuarios.index'),
            'medico'      => route('medico.pautas.index'),
            'gerocultora' => route('panel.index'),
            default       => '/',
        };

        return redirect()->intended($default);
    }

    public function resend(Request $request): RedirectResponse
    {
        $user = $request->user();
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->update([
            'two_factor_code'       => $code,
            'two_factor_expires_at' => now()->addMinutes(10),
        ]);
        Mail::to($user->email)->send(new TwoFactorCodeMail($user, $code));

        return back();
    }
}