'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');

  .mxp-widget * { box-sizing: border-box; margin: 0; padding: 0; }

  .mxp-widget {
    --magenta:    #C0148C;
    --morado:     #8C1460;
    --azul:       #1EAADC;
    --azul-d:     #1480B4;
    --verde:      #6DC42A;
    --verde-d:    #4A8C1C;
    --dorado:     #F0C832;
    --naranja:    #F07020;
    --naranja-v:  #E85010;
    --rojo:       #D42030;
    --rosa:       #E01060;
    --negro:      #0A0A0A;

    --bg-panel:   #1C1C1E;
    --bg-msgs:    #141416;
    --bg-input:   #242428;
    --bg-chip:    #2A2A2F;

    --sombra: 0 16px 48px rgba(0,0,0,.65), 0 4px 12px rgba(0,0,0,.35);
    --radio:  18px;

    font-family: 'DM Sans', sans-serif;
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
  }

  /* ── Botón flotante ── */
  .mxp-trigger {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: var(--magenta);
    border: 3px solid var(--dorado);
    box-shadow: var(--sombra);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform .2s, background .2s;
    position: relative;
    overflow: hidden;
  }
  .mxp-trigger:hover  { transform: scale(1.08); background: var(--morado); }
  .mxp-trigger:active { transform: scale(.96); }

  .mxp-dot {
    position: absolute;
    top: 4px; right: 4px;
    width: 11px; height: 11px;
    border-radius: 50%;
    background: var(--verde);
    border: 2px solid var(--bg-panel);
    box-shadow: 0 0 5px var(--verde);
    animation: mxp-pulse 2s infinite;
  }
  @keyframes mxp-pulse {
    0%,100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.3); opacity: .7; }
  }

  .mxp-avatar {
    width: 42px; height: 42px;
    border-radius: 50%;
    object-fit: cover;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; line-height: 1;
    user-select: none;
  }

  /* ── Panel ── */
  .mxp-panel {
    position: absolute;
    bottom: 76px;
    right: 0;
    width: 360px;
    max-height: 580px;
    background: var(--bg-panel);
    border-radius: var(--radio);
    box-shadow: var(--sombra);
    border: 1px solid rgba(140,20,96,.35);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform-origin: bottom right;
    transition: transform .25s cubic-bezier(.34,1.56,.64,1), opacity .2s;
  }
  .mxp-panel.cerrado {
    transform: scale(.85) translateY(12px);
    opacity: 0;
    pointer-events: none;
  }
  .mxp-panel.abierto {
    transform: scale(1) translateY(0);
    opacity: 1;
  }

  /* ── Header ── */
  .mxp-header {
    background: linear-gradient(135deg, #8C1460 0%, #C0148C 100%);
    padding: 14px 16px 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(0,0,0,.2);
  }
  .mxp-header-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: rgba(10,10,10,.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    border: 2px solid var(--dorado);
    overflow: hidden;
  }
  .mxp-header-info { flex: 1; min-width: 0; }
  .mxp-header-name {
    font-family: 'Fraunces', serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--dorado);
    line-height: 1.2;
  }
  .mxp-header-sub {
    font-size: 11px;
    color: rgba(255,255,255,.7);
    display: flex; align-items: center; gap: 5px;
    margin-top: 2px;
  }
  .mxp-online-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--verde);
    box-shadow: 0 0 4px var(--verde);
    flex-shrink: 0;
  }
  .mxp-close {
    background: rgba(0,0,0,.25);
    border: 1px solid rgba(255,255,255,.15);
    color: rgba(255,255,255,.8);
    width: 28px; height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s;
    flex-shrink: 0;
  }
  .mxp-close:hover { background: rgba(0,0,0,.4); }

  /* ── Mensajes ── */
  .mxp-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scroll-behavior: smooth;
    background: var(--bg-msgs);
  }
  .mxp-messages::-webkit-scrollbar { width: 3px; }
  .mxp-messages::-webkit-scrollbar-track { background: transparent; }
  .mxp-messages::-webkit-scrollbar-thumb { background: var(--morado); border-radius: 4px; }

  /* ── Burbujas ── */
  .mxp-burbuja {
    max-width: 82%;
    padding: 9px 13px;
    border-radius: 14px;
    font-size: 13.5px;
    line-height: 1.5;
    animation: mxp-aparecer .2s ease;
  }
  @keyframes mxp-aparecer {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mxp-burbuja.bot {
    background: #1D3A4A;
    color: #d0eaf5;
    border: 1px solid rgba(30,170,220,.18);
    border-bottom-left-radius: 4px;
    align-self: flex-start;
  }
  .mxp-burbuja.user {
    background: #1A3212;
    color: var(--dorado);
    font-weight: 500;
    border: 1px solid rgba(109,196,42,.18);
    border-bottom-right-radius: 4px;
    align-self: flex-end;
  }

  /* ── Fila bot ── */
  .mxp-fila-bot {
    display: flex;
    align-items: flex-end;
    gap: 7px;
    align-self: flex-start;
    max-width: 90%;
  }
  .mxp-mini-avatar {
    width: 26px; height: 26px;
    border-radius: 50%;
    background: var(--magenta);
    color: var(--dorado);
    font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(240,200,50,.3);
    overflow: hidden;
  }

  /* ── Typing indicator ── */
  .mxp-typing {
    display: flex; gap: 5px; align-items: center;
    padding: 10px 14px;
    background: #1D3A4A;
    border-radius: 14px;
    border-bottom-left-radius: 4px;
    border: 1px solid rgba(30,170,220,.18);
    width: fit-content;
  }
  .mxp-typing span {
    width: 8px; height: 8px;
    border-radius: 50%;
    animation: mxp-bounce .9s infinite;
  }
  .mxp-typing span:nth-child(1) { background: var(--magenta); animation-delay: 0s; }
  .mxp-typing span:nth-child(2) { background: var(--dorado);  animation-delay: .15s; }
  .mxp-typing span:nth-child(3) { background: var(--verde);   animation-delay: .30s; }
  @keyframes mxp-bounce {
    0%,60%,100% { transform: translateY(0); opacity: .7; }
    30%         { transform: translateY(-6px); opacity: 1; }
  }

  /* ── Chips ── */
  .mxp-chips {
    padding: 8px 12px 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex-shrink: 0;
    background: var(--bg-panel);
    border-top: 1px solid rgba(140,20,96,.2);
  }
  .mxp-chip {
    font-size: 11.5px;
    padding: 5px 12px;
    border-radius: 20px;
    background: var(--bg-chip);
    border: 1.5px solid;
    cursor: pointer;
    transition: opacity .15s;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    white-space: nowrap;
  }
  .mxp-chip:hover   { opacity: .8; }
  .mxp-chip:disabled { opacity: .4; cursor: not-allowed; }

  .mxp-chip-azul    { border-color: var(--azul);    color: var(--azul); }
  .mxp-chip-naranja { border-color: var(--naranja);  color: var(--naranja); }
  .mxp-chip-verde   { border-color: var(--verde);    color: var(--verde); }
  .mxp-chip-dorado  { border-color: var(--dorado);   color: var(--dorado); }

  /* ── Input ── */
  .mxp-input-wrap {
    padding: 10px 12px 14px;
    background: var(--bg-panel);
    border-top: 1px solid rgba(140,20,96,.2);
    display: flex;
    gap: 8px;
    align-items: flex-end;
    flex-shrink: 0;
  }
  .mxp-input {
    flex: 1;
    resize: none;
    border: 1.5px solid rgba(30,170,220,.35);
    border-radius: 12px;
    padding: 9px 13px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--dorado);
    background: var(--bg-input);
    outline: none;
    line-height: 1.4;
    max-height: 100px;
    min-height: 40px;
    transition: border-color .15s;
  }
  .mxp-input:focus    { border-color: var(--azul); }
  .mxp-input::placeholder { color: rgba(30,170,220,.55); }

  /* ── Botón enviar ── */
  .mxp-send {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: var(--magenta);
    border: 1.5px solid var(--rosa);
    color: var(--dorado);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s, transform .1s;
    flex-shrink: 0;
  }
  .mxp-send:hover   { background: var(--rosa); color: #fff; }
  .mxp-send:active  { transform: scale(.92); }
  .mxp-send:disabled {
    background: rgba(140,20,96,.3);
    border-color: rgba(224,16,96,.2);
    color: rgba(240,200,50,.3);
    cursor: not-allowed;
  }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .mxp-widget {
      bottom: 16px;
      right: 16px;
    }
    .mxp-panel {
      width: calc(100vw - 32px);
      right: 0;
      max-height: 75vh;
    }
    .mxp-trigger {
      width: 54px;
      height: 54px;
    }
    .mxp-avatar {
      font-size: 22px;
    }
    .mxp-burbuja {
      font-size: 13px;
    }
    .mxp-chip {
      font-size: 11px;
      padding: 4px 10px;
    }
  }

  @media (max-width: 360px) {
    .mxp-panel {
      width: calc(100vw - 24px);
      right: 0;
      border-radius: 14px;
    }
    .mxp-widget {
      bottom: 12px;
      right: 12px;
    }
    .mxp-header-name { font-size: 13px; }
    .mxp-chip { font-size: 10.5px; padding: 4px 9px; }
  }

  @media (min-height: 900px) {
    .mxp-panel { max-height: 640px; }
  }

  @media (max-height: 600px) {
    .mxp-panel {
      max-height: calc(100vh - 100px);
      bottom: 66px;
    }
  }
`;

const BIENVENIDA = '¡Hola! Soy Xóchitl 🌺, tu guía en MXplora. ¿Buscas un lugar para comer, algo de cultura o quieres un itinerario para hoy?';

const CHIPS_INICIO = [
  { label: '🍜 Dónde comer cerca', color: 'mxp-chip-azul' },
  { label: '🗺️ Armar itinerario',  color: 'mxp-chip-naranja' },
  { label: '⚽ Zona de Fans',       color: 'mxp-chip-verde' },
  { label: '🎨 Artesanías',         color: 'mxp-chip-dorado' },
];

export default function ChatWidget({
  turistaId = null,
  avatarSrc = null,
  position  = { bottom: 28, right: 28 },
}) {
  const [abierto,    setAbierto]    = useState(false);
  const [mensajes,   setMensajes]   = useState([
    { rol: 'bot', texto: BIENVENIDA },
  ]);
  const [input,      setInput]      = useState('');
  const [cargando,   setCargando]   = useState(false);
  const [sessionId]                  = useState(() => crypto.randomUUID());
  const [mostrarDot, setMostrarDot] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const stylesRef      = useRef(false);

  useEffect(() => {
    if (stylesRef.current) return;
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    stylesRef.current = true;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  useEffect(() => {
    if (abierto) {
      setMostrarDot(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [abierto]);

  const enviar = useCallback(async (texto) => {
    const msg = (texto ?? input).trim();
    if (!msg || cargando) return;

    setInput('');
    setMensajes(prev => [...prev, { rol: 'user', texto: msg }]);
    setCargando(true);

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          mensaje:   msg,
          sessionId,
          turistaId,
          lat: null,
          lng: null,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMensajes(prev => [...prev, { rol: 'bot', texto: data.respuesta }]);
    } catch (err) {
      console.error('[MXplora Chat]', err);
      setMensajes(prev => [
        ...prev,
        { rol: 'bot', texto: 'Ups, algo salió mal. Intenta de nuevo en un momento 🙏' },
      ]);
    } finally {
      setCargando(false);
    }
  }, [input, cargando, sessionId, turistaId]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const AvatarEl = ({ size = 20, className = 'mxp-header-avatar' }) =>
    avatarSrc ? (
      <div className={className} style={{ padding: 0 }}>
        <img src={avatarSrc} alt="Xóchitl" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    ) : (
      <div className={className}>
        <span style={{ fontSize: size }}>🦎</span>
      </div>
    );

  return (
    <div
      className="mxp-widget"
      style={{ bottom: position.bottom, right: position.right }}
    >
      <div
        className={`mxp-panel ${abierto ? 'abierto' : 'cerrado'}`}
        role="dialog"
        aria-label="Chat MXplora"
      >
        {/* Header */}
        <div className="mxp-header">
          <AvatarEl size={20} className="mxp-header-avatar" />
          <div className="mxp-header-info">
            <div className="mxp-header-name">Xóchitl</div>
            <div className="mxp-header-sub">
              <span className="mxp-online-dot" />
              <span>Guía local · MXplora</span>
            </div>
          </div>
          <button
            className="mxp-close"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar chat"
          >
            ✕
          </button>
        </div>

        {/* Mensajes */}
        <div className="mxp-messages" role="log" aria-live="polite">
          {mensajes.map((m, i) =>
            m.rol === 'bot' ? (
              <div key={i} className="mxp-fila-bot">
                <div className="mxp-mini-avatar">
                  {avatarSrc
                    ? <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '🦎'
                  }
                </div>
                <div className="mxp-burbuja bot">{m.texto}</div>
              </div>
            ) : (
              <div key={i} className="mxp-burbuja user">{m.texto}</div>
            )
          )}

          {cargando && (
            <div className="mxp-fila-bot">
              <div className="mxp-mini-avatar">
                {avatarSrc
                  ? <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : '🦎'
                }
              </div>
              <div className="mxp-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chips de inicio */}
        {mensajes.length <= 2 && (
          <div className="mxp-chips">
            {CHIPS_INICIO.map(({ label, color }) => (
              <button
                key={label}
                className={`mxp-chip ${color}`}
                onClick={() => enviar(label)}
                disabled={cargando}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="mxp-input-wrap">
          <textarea
            ref={inputRef}
            className="mxp-input"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            disabled={cargando}
            rows={1}
            aria-label="Mensaje"
          />
          <button
            className="mxp-send"
            onClick={() => enviar()}
            disabled={!input.trim() || cargando}
            aria-label="Enviar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Botón flotante */}
      <button
        className="mxp-trigger"
        onClick={() => setAbierto(o => !o)}
        aria-label={abierto ? 'Cerrar chat' : 'Abrir chat con Xóchitl'}
        aria-expanded={abierto}
      >
        {mostrarDot && !abierto && <span className="mxp-dot" />}
        <div className="mxp-avatar">
          {avatarSrc
            ? <img src={avatarSrc} alt="Xóchitl" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            : <span>🦎</span>
          }
        </div>
      </button>
    </div>
  );
}
