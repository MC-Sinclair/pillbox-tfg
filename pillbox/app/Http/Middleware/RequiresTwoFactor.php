<?php

namespace App\Http\Middleware;

use App\Mail\TwoFactorCodeMail;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;

class RequiresTwoFactor
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        if (session('two_factor_verified')) {
            return $next($request);
        }

        if (! $user->two_factor_code || now()->isAfter($user->two_factor_expires_at)) {
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $user->update([
                'two_factor_code'       => $code,
                'two_factor_expires_at' => now()->addMinutes(10),
            ]);
            Mail::to($user->email)->send(new TwoFactorCodeMail($user, $code));
        }

        session(['url.intended' => $request->url()]);

        return redirect()->route('two-factor.challenge');
    }
}