import { router, useForm } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';

export default function TwoFactorChallenge() {
    const form = useForm({ code: '' });
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/two-factor-challenge');
    }

    function resend() {
        setResending(true);
        setResent(false);
        router.post('/two-factor-challenge/resend', {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setResending(false);
                setResent(true);
            },
        });
    }

    return (
        <div className="space-y-4">
            <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="flex flex-col items-center gap-2">
                    <InputOTP
                        maxLength={6}
                        value={form.data.code}
                        onChange={v => form.setData('code', v)}
                        pattern={REGEXP_ONLY_DIGITS}
                        disabled={form.processing}
                        autoFocus
                    >
                        <InputOTPGroup>
                            {Array.from({ length: 6 }, (_, i) => (
                                <InputOTPSlot key={i} index={i} />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                    <InputError message={form.errors.code} />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.processing || form.data.code.length < 6}
                >
                    {form.processing && <Spinner />}
                    Verificar
                </Button>

                <div className="text-center">
                    {resent ? (
                        <span className="text-sm text-green-600">Código reenviado correctamente.</span>
                    ) : (
                        <button
                            type="button"
                            onClick={resend}
                            disabled={resending}
                            className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer disabled:opacity-50"
                        >
                            {resending ? 'Enviando...' : '¿No recibiste el código? Reenviar'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

TwoFactorChallenge.layout = {
    title: 'Verificación en dos pasos',
    description: 'Introduce el código de 6 dígitos enviado a tu correo electrónico.',
};