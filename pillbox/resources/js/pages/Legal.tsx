import '../../css/landing.css'

const SECTION_STYLE: React.CSSProperties = {
    marginBottom: '3.5rem',
    paddingTop: '1rem',
}

const H2_STYLE: React.CSSProperties = {
    fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
    color: '#fff',
    marginBottom: '1.25rem',
    marginTop: 0,
    fontWeight: 700,
    lineHeight: 1.2,
}

const H3_STYLE: React.CSSProperties = {
    fontSize: '1.05rem',
    color: 'rgba(255,255,255,0.92)',
    marginBottom: '0.5rem',
    marginTop: '1.5rem',
    fontWeight: 600,
}

const P_STYLE: React.CSSProperties = {
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.75,
    fontSize: '0.95rem',
    marginTop: 0,
    marginBottom: '0.75rem',
}

const DIVIDER: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    margin: '3rem 0',
}

export default function Legal() {
    return (
        <>
            {/* ── NAVBAR ── */}
            <nav
                id="navbar"
                aria-label="Navegación"
                className="scrolled"
                style={{
                    background: 'rgba(24, 69, 141, 0.96)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.08)',
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    zIndex: 100,
                }}
            >
                <div className="max-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.1rem', paddingBottom: '1.1rem' }}>
                    <a href="/" className="nav-logo" aria-label="PillBox – inicio">PillBox</a>
                    <a href="/" className="nav-link" style={{ fontSize: '0.9rem' }}>← Volver a inicio</a>
                </div>
            </nav>

            {/* ── CONTENIDO ── */}
            <main style={{ paddingTop: '6.5rem', paddingBottom: '5rem', minHeight: '100vh' }}>
                <div className="max-content" style={{ maxWidth: '760px' }}>

                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', marginBottom: '0.5rem', fontWeight: 800, lineHeight: 1.15 }}>
                        Información legal
                    </h1>
                    <p style={{ ...P_STYLE, marginBottom: '3rem', fontSize: '0.9rem' }}>
                        Última actualización: junio de 2026. Proyecto académico — Trabajo de Fin de Grado (DAW).
                    </p>

                    {/* ── POLÍTICA DE PRIVACIDAD ── */}
                    <section id="privacidad" style={SECTION_STYLE}>
                        <h2 style={H2_STYLE}>Política de privacidad</h2>

                        <h3 style={H3_STYLE}>1. Responsable del tratamiento</h3>
                        <p style={P_STYLE}>
                            PillBox es un proyecto académico de Trabajo de Fin de Grado (TFG) del ciclo formativo de Desarrollo de Aplicaciones Web (DAW) en el IES María Moliner. El acceso a la plataforma es restringido y únicamente está disponible para usuarios invitados en el marco del proyecto.
                        </p>

                        <h3 style={H3_STYLE}>2. Datos que recogemos</h3>
                        <p style={P_STYLE}>
                            La plataforma recoge exclusivamente los datos necesarios para su funcionamiento: nombre de usuario, dirección de correo electrónico y los datos clínicos introducidos por el personal autorizado de la residencia (pautas de medicación, registros de administración). No se recogen datos de navegación, dirección IP con finalidad de seguimiento, ni se emplea ningún servicio de analítica de terceros.
                        </p>

                        <h3 style={H3_STYLE}>3. Cookies</h3>
                        <p style={P_STYLE}>
                            PillBox utiliza únicamente cookies esenciales para el funcionamiento de la sesión y la protección CSRF. Estas cookies son estrictamente necesarias y no requieren consentimiento según el RGPD y la LSSI. No se utilizan cookies publicitarias ni de rastreo.
                        </p>

                        <h3 style={H3_STYLE}>4. Base legal</h3>
                        <p style={P_STYLE}>
                            El tratamiento de datos se basa en el consentimiento del usuario al registrarse y en el interés legítimo de mantener la seguridad de la plataforma. Los datos clínicos se tratan en el marco del contrato de prestación del servicio con la residencia.
                        </p>

                        <h3 style={H3_STYLE}>5. Almacenamiento y seguridad</h3>
                        <p style={P_STYLE}>
                            Los datos se almacenan en servidores ubicados en la Unión Europea (Railway, región europe-west4). La comunicación se cifra mediante TLS y los datos en reposo están protegidos con AES-256. Se realizan copias de seguridad automáticas cada 6 horas.
                        </p>

                        <h3 style={H3_STYLE}>6. Cesión de datos</h3>
                        <p style={P_STYLE}>
                            No se ceden datos a terceros salvo obligación legal. Los datos no se transfieren fuera del Espacio Económico Europeo.
                        </p>

                        <h3 style={H3_STYLE}>7. Derechos del usuario</h3>
                        <p style={P_STYLE}>
                            Puedes ejercer tus derechos de acceso, rectificación, supresión, portabilidad y oposición enviando un correo a{' '}
                            <a href="mailto:pillbox.res@gmail.com" style={{ color: '#4da8ff' }}>pillbox.res@gmail.com</a>.
                        </p>
                    </section>

                    <hr style={DIVIDER} />

                    {/* ── TÉRMINOS DE USO ── */}
                    <section id="terminos" style={SECTION_STYLE}>
                        <h2 style={H2_STYLE}>Términos de uso</h2>

                        <h3 style={H3_STYLE}>1. Naturaleza del servicio</h3>
                        <p style={P_STYLE}>
                            PillBox es una herramienta de gestión de registros farmacológicos para residencias de mayores, desarrollada como proyecto académico. El acceso está restringido al personal autorizado por el administrador de cada residencia.
                        </p>

                        <h3 style={H3_STYLE}>2. Uso aceptable</h3>
                        <p style={P_STYLE}>
                            El usuario se compromete a utilizar la plataforma exclusivamente para los fines para los que ha sido invitado, a mantener la confidencialidad de sus credenciales y a no compartir su cuenta con terceros. Queda prohibido el acceso no autorizado o cualquier uso que comprometa la integridad de los datos clínicos.
                        </p>

                        <h3 style={H3_STYLE}>3. Responsabilidad clínica</h3>
                        <p style={P_STYLE}>
                            PillBox es una herramienta de apoyo al registro, no un sistema de prescripción médica. La responsabilidad clínica de cualquier decisión terapéutica recae íntegramente en el profesional sanitario habilitado. El sistema no sustituye el criterio médico ni proporciona asesoramiento clínico.
                        </p>

                        <h3 style={H3_STYLE}>4. Disponibilidad</h3>
                        <p style={P_STYLE}>
                            Al tratarse de un proyecto académico, el servicio se presta sin garantía de disponibilidad continua. Pueden producirse interrupciones por mantenimiento o por la naturaleza experimental del proyecto.
                        </p>

                        <h3 style={H3_STYLE}>5. Modificaciones</h3>
                        <p style={P_STYLE}>
                            Estos términos pueden actualizarse en cualquier momento. Los cambios relevantes se comunicarán a los usuarios activos. El uso continuado de la plataforma implica la aceptación de los términos vigentes.
                        </p>
                    </section>

                    <hr style={DIVIDER} />

                    {/* ── AVISO LEGAL ── */}
                    <section id="aviso" style={{ ...SECTION_STYLE, marginBottom: 0 }}>
                        <h2 style={H2_STYLE}>Aviso legal</h2>
                        <p style={P_STYLE}>
                            PillBox es un proyecto de Trabajo de Fin de Grado desarrollado en el IES María Moliner (Zaragoza) en el marco del ciclo formativo de Desarrollo de Aplicaciones Web. No constituye una empresa ni entidad jurídica. Todos los derechos sobre el código fuente y el diseño pertenecen a su autor. Para cualquier consulta: <a href="mailto:pillbox.res@gmail.com" style={{ color: '#4da8ff' }}>pillbox.res@gmail.com</a>
                        </p>
                    </section>

                </div>
            </main>

            {/* ── FOOTER MÍNIMO ── */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem 2rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
                    © 2026 PillBox ·{' '}
                    <a href="/" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Inicio</a>
                </span>
            </footer>
        </>
    )
}