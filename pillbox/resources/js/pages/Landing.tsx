import '../../css/landing.css'
import { useCallback, useEffect, useRef, useState } from 'react'

function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem('pb_cookies'))

  function accept() { localStorage.setItem('pb_cookies', 'all'); setVisible(false) }
  function essential() { localStorage.setItem('pb_cookies', 'essential'); setVisible(false) }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      padding: '1.1rem 2rem',
      background: 'rgba(7, 24, 62, 0.94)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.12)',
      display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-between',
    }}>
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.78)', maxWidth: '640px', lineHeight: 1.6 }}>
        Usamos cookies esenciales para el funcionamiento de la plataforma (sesión y seguridad). No empleamos cookies de rastreo ni publicidad.{' '}
        <a href="/legal#privacidad" style={{ color: '#4da8ff', textDecoration: 'underline' }}>Política de privacidad</a>
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
        <button onClick={essential} style={{ padding: '0.5rem 1.1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' }}>
          Solo esenciales
        </button>
        <button onClick={accept} style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#2764c0', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit' }}>
          Aceptar
        </button>
      </div>
    </div>
  )
}

export default function Landing() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { video.pause(); video.currentTime = 0; return }
    const onLoaded = () => video.play().catch(() => {})
    video.addEventListener('loadedmetadata', onLoaded)
    return () => video.removeEventListener('loadedmetadata', onLoaded)
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = document.querySelectorAll<Element>('.reveal')
    if (reduced) { els.forEach(el => el.classList.add('visible')); return }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav
        id="navbar"
        aria-label="Navegación principal"
        className={navScrolled ? 'scrolled' : ''}
        style={navScrolled ? {
          background: 'rgba(94, 101, 124, 0.32)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 1px 0 rgba(255, 255, 255, 0.07)',
        } : {}}
      >
        <div className="max-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
          <a href="#" className="nav-logo" aria-label="PillBox – inicio">PillBox</a>
          <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <a href="#solucion" className="nav-link">Solución</a>
            <a href="#features" className="nav-link">Funcionalidades</a>
            <a href="#pricing" className="nav-link">Impacto</a>
            <a href="#trust" className="nav-link">Seguridad</a>
            <a href="#footer" className="nav-link">Contacto</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/login" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }} id="log">Login</a>
            <button className="hamburger" aria-label="Abrir menú" aria-expanded={drawerOpen} aria-controls="nav-drawer" onClick={() => setDrawerOpen(true)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ── DRAWER MÓVIL ───────────────────────────────────────────── */}
      <div id="drawer-overlay" role="presentation" aria-hidden="true" className={drawerOpen ? 'open' : ''} onClick={closeDrawer} />
      <div id="nav-drawer" role="dialog" aria-modal={true} aria-label="Menú de navegación" className={drawerOpen ? 'open' : ''}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <span className="nav-logo">PillBox</span>
          <button aria-label="Cerrar menú" onClick={closeDrawer} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem' }}>×</button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          <a href="#solucion" className="footer-link" onClick={closeDrawer} style={{ fontSize: '1.1rem', color: '#fff', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Solución</a>
          <a href="#features" className="footer-link" onClick={closeDrawer} style={{ fontSize: '1.1rem', color: '#fff', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Funcionalidades</a>
          <a href="#pricing"  className="footer-link" onClick={closeDrawer} style={{ fontSize: '1.1rem', color: '#fff', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Impacto</a>
          <a href="#trust"    className="footer-link" onClick={closeDrawer} style={{ fontSize: '1.1rem', color: '#fff', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Seguridad</a>
          <a href="#footer"   className="footer-link" onClick={closeDrawer} style={{ fontSize: '1.1rem', color: '#fff', padding: '0.75rem 0' }}>Contacto</a>
        </nav>
        <a href="/login" className="btn-primary" onClick={closeDrawer} style={{ marginTop: '2rem', justifyContent: 'center' }}>Login</a>
      </div>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section id="hero" aria-label="Sección de inicio">
        <video ref={videoRef} id="hero-video" aria-hidden={true} muted playsInline preload="auto" loop>
          <source src="/assets/hero2.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" aria-hidden={true} />
        <div className="hero-left-vignette" aria-hidden={true} />
        <div className="hero-content">
          <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 className="hero-headline reveal reveal-delay-1">
              Cada pastilla,<br />registrada.<br />Cada pauta,<br />cumplida.
            </h1>
            <p className="hero-sub reveal reveal-delay-2">
              La plataforma que automatiza el registro de administración farmacológica en residencias de mayores.
              Pautas médicas activas → registros diarios generados, sin duplicidades, sin olvidos y sin papeleo.
            </p>
            <div className="reveal reveal-delay-3" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="#footer" className="btn-primary">Habla con nosotros →</a>
              <a href="#features" className="btn-ghost">Ver cómo funciona ▶</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ───────────────────────────────────────────────── */}
      <section id="problema" aria-labelledby="problema-heading">
        <div className="max-content" style={{ textAlign: 'center', paddingTop: '8.5rem', paddingBottom: '8.5rem' }}>
          <h2 id="problema-heading" className="problema-text reveal reveal-delay-1">
            En una residencia con 80 plazas se administran <em>más de 600 dosis al día.</em>
          </h2>
          <p className="problema-body reveal reveal-delay-2">
            Cada error de registro es un riesgo clínico y una contingencia legal. Los cuadernos en papel no escalan.
            Las hojas de cálculo se acaban rompiendo. Las gerocultoras pierden hasta{' '}
            <strong style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>90 minutos por turno</strong>{' '}
            cuadrando firmas.
          </p>
        </div>
      </section>

      {/* ── SOLUCIÓN ───────────────────────────────────────────────── */}
      <section id="solucion" aria-labelledby="solucion-heading">
        <div className="max-content" style={{ paddingTop: '5.5rem', paddingBottom: '5.5rem' }}>
          <h2 id="solucion-heading" className="font-heading reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '2rem', color: '#fff', maxWidth: '600px', lineHeight: 1.2 }}>
            Tres pilares que transforman vuestro flujo clínico
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="solucion-card liquid-glass reveal reveal-delay-1">
              <div className="solucion-num">01</div>
              <div className="solucion-title">Pautas que se traducen solas en registros</div>
              <p className="solucion-body">El médico introduce la pauta una vez. PillBox genera automáticamente los registros diarios para cada turno, cada residente.</p>
            </div>
            <div className="solucion-card liquid-glass reveal reveal-delay-2">
              <div className="solucion-num">02</div>
              <div className="solucion-title">Roles que reflejan vuestro organigrama</div>
              <p className="solucion-body">Médico, enfermera, gerocultor – cada usuario ve y firma únicamente lo que le corresponde.</p>
            </div>
            <div className="solucion-card liquid-glass reveal reveal-delay-3">
              <div className="solucion-num">03</div>
              <div className="solucion-title">Auditable desde el primer día</div>
              <p className="solucion-body">Cada acción queda sellada con usuario, fecha y hora. Las inspecciones sanitarias encuentran un historial completo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section id="features" aria-labelledby="features-heading">
        <div className="max-content" style={{ paddingTop: '5.5rem', paddingBottom: '5.5rem' }}>
          <h2 id="features-heading" className="font-heading reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '2.5rem', color: '#fff', maxWidth: '560px', lineHeight: 1.2 }}>
            Cinco funcionalidades que cubren todo el ciclo
          </h2>

          <div className="feature-card liquid-glass reveal">
            <div className="feature-row">
              <div className="feature-text">
                <div className="feature-label">01 — Generación</div>
                <h3 className="feature-title">Registros del día, generados solos</h3>
                <p className="feature-desc">Al abrir el panel, PillBox crea automáticamente las administraciones del día para cada pauta activa. El médico define el tratamiento una vez; el sistema prepara el trabajo de cada turno sin intervención manual.</p>
              </div>
              <div className="feature-visual">
                <div className="feature-mockup">
                  <div className="mockup-topbar"><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-title-bar" /><div className="mockup-badge" style={{ marginLeft: 'auto' }} /></div>
                  <div className="mockup-divider" />
                  <div className="mockup-row" style={{ marginTop: '0.25rem' }}><div className="mockup-cell" style={{ maxWidth: '90px' }} /><div className="mockup-cell accent" /><div className="mockup-cell" /><div className="mockup-cell accent" /></div>
                  <div className="mockup-row"><div className="mockup-cell" style={{ maxWidth: '90px' }} /><div className="mockup-cell" /><div className="mockup-cell accent" /><div className="mockup-cell accent" /></div>
                  <div className="mockup-row"><div className="mockup-cell" style={{ maxWidth: '90px' }} /><div className="mockup-cell accent-full" /><div className="mockup-cell accent-full" /><div className="mockup-cell accent-full" /></div>
                  <div className="mockup-divider" />
                  <div className="mockup-row" style={{ marginTop: 'auto' }}><div className="mockup-cell accent-full" style={{ maxWidth: '160px', height: '8px' }} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card liquid-glass reveal">
            <div className="feature-row reversed">
              <div className="feature-text">
                <div className="feature-label">02 — Registro</div>
                <h3 className="feature-title">Cada dosis, registrada y firmada</h3>
                <p className="feature-desc">La gerocultura marca cada administración como realizada, rechazada o con dificultad. El registro queda vinculado al usuario autenticado y a la hora exacta, creando trazabilidad completa de quién hizo qué y cuándo.</p>
              </div>
              <div className="feature-visual">
                <div className="feature-mockup">
                  <div className="mockup-topbar"><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-title-bar" /></div>
                  <div className="mockup-divider" />
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', margin: '0.25rem 0', letterSpacing: '0.05em', fontFamily: 'monospace' }}>TURNO MAÑANA · 08:00 – 14:00</div>
                  <div className="mockup-signature-row"><div className="mockup-sig-box filled" /><div className="mockup-sig-box filled" /><div className="mockup-sig-box" /><div className="mockup-sig-box filled" /></div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', margin: '0.5rem 0 0.25rem', letterSpacing: '0.05em', fontFamily: 'monospace' }}>TURNO TARDE · 14:00 – 22:00</div>
                  <div className="mockup-signature-row"><div className="mockup-sig-box" /><div className="mockup-sig-box filled" /><div className="mockup-sig-box filled" /><div className="mockup-sig-box" /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card liquid-glass reveal">
            <div className="feature-row">
              <div className="feature-text">
                <div className="feature-label">03 — Pautas</div>
                <h3 className="feature-title">Pautas médicas en tiempo real</h3>
                <p className="feature-desc">El médico crea, modifica o desactiva pautas farmacológicas por residente: medicamento, dosis, vía, horarios y período de vigencia. Cualquier cambio se aplica de inmediato en el panel de las gerocultoras.</p>
              </div>
              <div className="feature-visual">
                <div className="feature-mockup">
                  <div className="mockup-topbar"><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-title-bar" /></div>
                  <div className="mockup-divider" />
                  <div className="mockup-chart-row" style={{ marginTop: '0.5rem' }}>
                    <div className="mockup-chart-bar" style={{ height: '60%' }} /><div className="mockup-chart-bar" style={{ height: '75%', background: 'rgba(255,255,255,0.32)' }} /><div className="mockup-chart-bar" style={{ height: '50%' }} /><div className="mockup-chart-bar" style={{ height: '90%', background: 'rgba(255,255,255,0.44)' }} /><div className="mockup-chart-bar" style={{ height: '65%' }} /><div className="mockup-chart-bar" style={{ height: '80%' }} /><div className="mockup-chart-bar" style={{ height: '45%' }} />
                  </div>
                  <div className="mockup-divider" style={{ marginTop: '0.5rem' }} />
                  <div className="mockup-row"><div className="mockup-cell" style={{ maxWidth: '110px' }} /><div className="mockup-cell accent" style={{ maxWidth: '50px' }} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card liquid-glass reveal">
            <div className="feature-row reversed">
              <div className="feature-text">
                <div className="feature-label">04 — Incidencias</div>
                <h3 className="feature-title">Ninguna dosis sin registrar</h3>
                <p className="feature-desc">Las administraciones no completadas se marcan automáticamente como «No administrado» y se destacan visualmente en rojo en el panel. Cada incidencia queda en el historial: accesible, auditable y con fecha.</p>
              </div>
              <div className="feature-visual">
                <div className="feature-mockup">
                  <div className="mockup-topbar"><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-title-bar" /></div>
                  <div className="mockup-divider" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <div className="mockup-alert-row"><div className="mockup-alert-dot" /><div className="mockup-alert-line" /><div style={{ width: '40px', height: '7px', borderRadius: '3px', background: 'rgba(255,160,50,0.25)' }} /></div>
                    <div className="mockup-alert-row"><div className="mockup-alert-dot" /><div className="mockup-alert-line" style={{ width: '60%' }} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card liquid-glass reveal">
            <div className="feature-row">
              <div className="feature-text">
                <div className="feature-label">05 — Administración</div>
                <h3 className="feature-title">Gestión completa de la residencia</h3>
                <p className="feature-desc">El administrador gestiona usuarios (médicos, gerocultoras), el catálogo de residentes, la asignación de gerocultoras a pacientes y el inventario de medicamentos, todo desde una interfaz centralizada con roles diferenciados.</p>
              </div>
              <div className="feature-visual">
                <div className="feature-mockup">
                  <div className="mockup-topbar"><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-dot" /><div className="mockup-title-bar" /></div>
                  <div className="mockup-divider" />
                  <div className="mockup-multi-col" style={{ marginTop: '0.4rem' }}>
                    <div className="mockup-multi-card active"><div style={{ height: '6px', background: 'rgba(255,255,255,0.40)', borderRadius: '2px' }} /><div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} /></div>
                    <div className="mockup-multi-card"><div style={{ height: '6px', background: 'rgba(255,255,255,0.12)', borderRadius: '2px' }} /><div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }} /></div>
                    <div className="mockup-multi-card"><div style={{ height: '6px', background: 'rgba(255,255,255,0.12)', borderRadius: '2px' }} /><div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST ──────────────────────────────────────────────────── */}
      <section id="trust" aria-labelledby="trust-heading">
        <div className="max-content" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontWeight: 600, color: 'white', maxWidth: '260px', lineHeight: 1.6 }}>
              Infraestructura diseñada para cumplir con la normativa española y europea.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
              {['LOPDGDD', 'Servidores UE', 'Cifrado AES-256', 'Copias de seguridad cada 6 h', 'Auditoría de accesos', 'Arquitectura validada en TFG'].map((label) => (
                <span key={label} className="trust-chip reveal">
                  <span className="trust-chip-icon" aria-hidden={true} />{label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACTO ────────────────────────────────────────────────── */}
      <section id="pricing" aria-labelledby="pricing-heading">
        <div className="max-content" style={{ paddingTop: '5.5rem', paddingBottom: '5.5rem' }}>
          <h2 id="pricing-heading" className="font-heading reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '0.75rem', color: '#fff', maxWidth: '600px', lineHeight: 1.15 }}>
            Detrás de cada registro<br />hay una persona.
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)', maxWidth: '560px', lineHeight: 1.75, marginBottom: '3.5rem' }}>
            PillBox no automatiza papeleo. Libera tiempo para lo que ningún software puede hacer: cuidar.
          </p>
          <div className="impact-rows">
            {([
              { num: '90', unit: 'min', label: 'Ahorradas por gerocultura en cada turno', quote: 'Son 90 minutos que no van a una hoja de cálculo. Van a sentarse con Dolores, que hoy no ha querido hablar con nadie.' },
              { num: '3', unit: 'clics', label: 'Para acceder al historial farmacológico completo de un residente', quote: 'Porque cuando el médico necesita decidir, cada segundo que se pierde buscando papel es un riesgo real.' },
              { num: '0', unit: '', label: 'Errores de duplicidad en la administración documentados', quote: 'Ningún residente recibe dos veces la misma dosis. Eso no es eficiencia. Es seguridad.' },
              { num: '600+', unit: '', label: 'Dosis gestionadas cada día, sin papel, sin ambigüedad', quote: 'Cada una, registrada. Cada firma, vinculada a una persona. Cada turno, auditado y sin fisuras.' },
            ] as { num: string; unit: string; label: string; quote: string }[]).map((item, i) => (
              <div key={i} className={`impact-row reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
                <div className="impact-row-num">{item.num}<span className="impact-row-unit">{item.unit && ` ${item.unit}`}</span></div>
                <div className="impact-row-label">{item.label}</div>
                <p className="impact-row-quote">{item.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer id="footer" role="contentinfo">
        <div className="footer-bg" aria-hidden="true">
          <img src="/assets/img-footer.png" alt="" />
        </div>
        <div className="footer-panel">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div className="footer-logo">PillBox</div>
              <p className="footer-tagline">Tu aliado en seguridad farmacológica.</p>
              <p className="footer-tagline" style={{ marginTop: '0.75rem', color: '#032b75' }}>Automatización del registro farmacológico para residencias de mayores en España.</p>
            </div>
            <div>
              <div className="footer-heading">Producto</div>
              <a href="#problema" className="footer-link">Por qué PillBox</a>
              <a href="#features" className="footer-link">Funcionalidades</a>
              <a href="#pricing" className="footer-link">Impacto</a>
            </div>
            <div>
              <div className="footer-heading">Legal</div>
              <a href="/legal#privacidad" className="footer-link">Política de privacidad</a>
              <a href="/legal#terminos" className="footer-link">Términos de uso</a>
              <a href="/legal#aviso" className="footer-link">Aviso legal</a>
            </div>
            <div>
              <div className="footer-heading">Contacto</div>
              <p className="footer-tagline" style={{ marginBottom: '1.25rem' }}>¿Quieres ver PillBox en tu residencia?</p>
              <a href="mailto:pillbox.res@gmail.com" className="footer-link">pillbox.res@gmail.com</a>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', alignItems: 'center' }}>
                <a href="https://www.linkedin.com/in/pillb0x/" className="social-icon" aria-label="LinkedIn de PillBox" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="https://github.com/MC-Sinclair/pillbox-tfg" className="social-icon" aria-label="GitHub de PillBox" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 PillBox</span>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <a href="/legal#privacidad" className="footer-copy footer-bottom-link">Política de privacidad</a>
              <a href="/legal#terminos" className="footer-copy footer-bottom-link">Términos de uso</a>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </>
  )
}