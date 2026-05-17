<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de verificación</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:480px;width:100%;">
                    <tr>
                        <td style="background:#0f172a;padding:28px 40px;text-align:center;">
                            <span style="font-size:22px;font-weight:700;color:#f8fafc;letter-spacing:-0.5px;">💊 PillBox</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px 40px 32px;">
                            <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#1e293b;">Hola, {{ $user->name }}</p>
                            <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.6;">
                                Tu código de verificación para acceder a PillBox es:
                            </p>
                            <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:32px;text-align:center;margin-bottom:32px;">
                                <span style="font-size:44px;font-weight:700;letter-spacing:0.2em;color:#0f172a;font-family:'Courier New',monospace;">{{ $code }}</span>
                            </div>
                            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
                                Este código es válido durante <strong>10 minutos</strong>.<br>
                                Si no has intentado iniciar sesión en PillBox, ignora este correo.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
                            <span style="font-size:12px;color:#94a3b8;">PillBox · Sistema de gestión de medicación</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>