(function(){
  const slides = document.querySelectorAll(".hs");
  const dots   = document.querySelectorAll(".hd");
  let cur = 0;
  function next() {
    slides[cur].style.opacity = "0";
    dots[cur].style.width = "8px";
    dots[cur].style.background = "rgba(255,255,255,.3)";
    cur = (cur + 1) % slides.length;
    slides[cur].style.opacity = "1";
    dots[cur].style.width = "24px";
    dots[cur].style.background = "#84d7ae";
  }
  setInterval(next, 4000);
})();

/* ─────────────────────────────────── */

(function(){
    const wrap  = document.getElementById("conv-wrap");
    const track = document.getElementById("conv-track");
    const scenes = track.querySelectorAll(".pcard-scene");
    const dotsEl = document.getElementById("conv-dots");

    /* Dots */
    const DOT_N = Math.ceil(scenes.length / 5);
    for(let i=0;i<DOT_N;i++){
      const d=document.createElement("div");
      d.style.cssText="width:6px;height:3px;background:rgba(255,255,255,.25);border-radius:2px;transition:all .3s";
      dotsEl.appendChild(d);
    }
    function updateDots(){
      const pct=wrap.scrollLeft/(wrap.scrollWidth-wrap.clientWidth)||0;
      const idx=Math.round(pct*(DOT_N-1));
      dotsEl.querySelectorAll("div").forEach((d,i)=>{
        d.style.width=i===idx?"20px":"6px";
        d.style.background=i===idx?"#84d7ae":"rgba(255,255,255,.25)";
      });
    }
    wrap.addEventListener("scroll",updateDots,{passive:true});
    updateDots();

    /* IntersectionObserver — entrada 3D escalonada */
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const idx=Array.from(scenes).indexOf(e.target);
          setTimeout(()=>e.target.classList.add("visible"),(idx%8)*60);
          io.unobserve(e.target);
        }
      });
    },{root:wrap,threshold:0.1});
    scenes.forEach(s=>io.observe(s));

    /* Flip al click (solo si no fue drag) */
    scenes.forEach(s=>{
      s.addEventListener("click",()=>{
        if(!s._drag) s.classList.toggle("flipped");
        s._drag=false;
      });
    });

    /* Drag con mouse */
    let down=false,sx=0,sl=0,mv=0;
    wrap.addEventListener("mousedown",e=>{ down=true;mv=0;sx=e.pageX-wrap.offsetLeft;sl=wrap.scrollLeft;wrap.style.cursor="grabbing"; });
    wrap.addEventListener("mouseleave",()=>{ down=false;wrap.style.cursor="grab"; });
    wrap.addEventListener("mouseup",()=>{ down=false;wrap.style.cursor="grab"; });
    wrap.addEventListener("mousemove",e=>{
      if(!down) return;
      e.preventDefault();mv++;
      const walk=(e.pageX-wrap.offsetLeft-sx)*1.5;
      wrap.scrollLeft=sl-walk;
      if(Math.abs(walk)>6){ const sc=e.target.closest(".pcard-scene"); if(sc) sc._drag=true; }
    },{passive:false});
  })();

/* ─────────────────────────────────── */

/* ═══════════════════════════════════════════
   DATOS OFICIALES — PARTIDOS AZTECA 2026
   Fuentes: FIFA / Yahoo Sports / Fox Sports
═══════════════════════════════════════════ */
const PARTIDOS = [
  { teamA:"MEXICO",     cA:"mx", teamB:"SUDAFRICA",    cB:"za",
    kickoff:new Date("2026-06-11T14:00:00-06:00"), grupo:"GRUPO A · APERTURA", esAp:true },
  { teamA:"UZBEKISTAN", cA:"uz", teamB:"COLOMBIA",     cB:"co",
    kickoff:new Date("2026-06-17T21:00:00-06:00"), grupo:"GRUPO J" },
  { teamA:"MEXICO",     cA:"mx", teamB:"CHEQUIA",      cB:"cz",
    kickoff:new Date("2026-06-24T20:00:00-06:00"), grupo:"GRUPO A" },
  { teamA:"GANADOR A",  cA:null, teamB:"3 C/E/F/H/I",  cB:null,
    kickoff:new Date("2026-06-30T20:00:00-06:00"), grupo:"RONDA DE 32" },
  { teamA:"POR DEFINIR",cA:null, teamB:"POR DEFINIR",  cB:null,
    kickoff:new Date("2026-07-05T19:00:00-06:00"), grupo:"CUARTOS DE FINAL" }
];

const flag = c => c ? `https://flagcdn.com/w160/${c}.png` : "";

function proximo()  { const n=new Date(); return PARTIDOS.find(p=>p.kickoff>n)||PARTIDOS.at(-1); }
function enVivo(p)  { const n=new Date(); return n>=p.kickoff&&n<=new Date(p.kickoff.getTime()+130*60000); }
function fmt(d)  {
  const D=["DOM","LUN","MAR","MIE","JUE","VIE","SAB"],M=["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  return `${D[d.getDay()]} ${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtH(d) {
  let h=d.getHours(),m=d.getMinutes(),a=h>=12?"PM":"AM";
  h=h%12||12; return `${h}:${String(m).padStart(2,"0")} ${a} CDMX`;
}

/* ── INIT PARTIDO ── */
function initPartido() {
  try {
    const p = proximo();
    const fa = document.getElementById("flag-a");
    const fb = document.getElementById("flag-b");
    const ta = document.getElementById("team-a");
    const tb = document.getElementById("team-b");
    const badge = document.getElementById("fecha-badge");
    const ih = document.getElementById("info-hora");
    const ie = document.getElementById("info-estadio");
    const ig = document.getElementById("info-grupo");
    const lbl = document.getElementById("cnt-label");

    if(fa) fa.src = p.cA ? flag(p.cA) : "";
    if(fb) fb.src = p.cB ? flag(p.cB) : "";
    if(ta) ta.textContent = p.teamA;
    if(tb) tb.textContent = p.teamB;
    if(badge) badge.textContent = fmt(p.kickoff);
    if(ih) ih.textContent = fmt(p.kickoff) + " · " + fmtH(p.kickoff);
    if(ie) ie.textContent = "Estadio Azteca";
    if(ig) ig.textContent = p.grupo;
    if(lbl) lbl.textContent = p.esAp ? "APERTURA MUNDIAL · FALTAN:" : "PROXIMO EN AZTECA · FALTAN:";
  } catch(e) { console.warn("initPartido:", e); }
}

/* ── CONTADOR ── */
function tick() {
  try {
    const p = proximo();
    if(enVivo(p)) return;
    const diff = p.kickoff - new Date();
    if(diff <= 0) { initPartido(); return; }
    const s = Math.floor(diff / 1000);
    const d = document.getElementById("cnt-d");
    const h = document.getElementById("cnt-h");
    const m = document.getElementById("cnt-m");
    const sec = document.getElementById("cnt-s");
    if(d) d.textContent = String(Math.floor(s / 86400)).padStart(2, "0");
    if(h) h.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
    if(m) m.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    if(sec) sec.textContent = String(s % 60).padStart(2, "0");
  } catch(e) { console.warn("tick:", e); }
}

/* ── CALENDARIO ── */
function renderCal() {
  try {
    const now = new Date();
    const el = document.getElementById("calendario-wrap");
    if(!el) return;
    el.innerHTML = PARTIDOS.map(p=>{
    const past=p.kickoff<now&&!enVivo(p), vivo=enVivo(p), sig=p===proximo();
    const bc=vivo?"#ffb4ab":sig?"#006847":"#3f4943";
    const badge=vivo
      ?`<span style="font-size:8px;font-weight:700;color:#ffb4ab;animation:blink 1s step-start infinite;letter-spacing:.15em">EN VIVO</span>`
      :past?`<span style="font-size:8px;font-weight:700;color:rgba(190,201,193,.5);letter-spacing:.15em">FINALIZADO</span>`
      :sig?`<span style="font-size:8px;font-weight:700;color:#84d7ae;letter-spacing:.15em">PROXIMO</span>`
      :`<span style="font-size:8px;font-weight:700;color:rgba(190,201,193,.5);letter-spacing:.1em">${fmt(p.kickoff)}</span>`;

    // URLs de banderas en alta resolución para el fondo
    const bgA = p.cA ? `url('https://flagcdn.com/w320/${p.cA}.png')` : "none";
    const bgB = p.cB ? `url('https://flagcdn.com/w320/${p.cB}.png')` : "none";

    // Íconos pequeños de bandera para el texto
    const fA = p.cA
      ? `<img src="https://flagcdn.com/w80/${p.cA}.png" style="width:28px;height:19px;object-fit:cover;border-radius:2px;border:1px solid rgba(255,255,255,.15);flex-shrink:0" onerror="this.style.display='none'"/>`
      : `<svg style="width:20px;height:20px;color:rgba(190,201,193,.3)"><use href="#ic-ball"/></svg>`;
    const fB = p.cB
      ? `<img src="https://flagcdn.com/w80/${p.cB}.png" style="width:28px;height:19px;object-fit:cover;border-radius:2px;border:1px solid rgba(255,255,255,.15);flex-shrink:0" onerror="this.style.display='none'"/>`
      : `<svg style="width:20px;height:20px;color:rgba(190,201,193,.3)"><use href="#ic-ball"/></svg>`;

    return `
    <div style="
      position:relative;overflow:hidden;
      border:1px solid ${bc};
      border-radius:3px;
      height:64px;
      opacity:${past?.45:1};
      transition:transform .2s;
    " onmouseenter="this.style.transform='scale(1.01)'" onmouseleave="this.style.transform='scale(1)'">

      <!-- Fondo bandera izquierda -->
      ${p.cA ? `<div style="
        position:absolute;left:0;top:0;width:50%;height:100%;
        background:${bgA} center/cover no-repeat;
        mask-image:linear-gradient(to right, rgba(0,0,0,.18) 0%, rgba(0,0,0,0) 100%);
        -webkit-mask-image:linear-gradient(to right, rgba(0,0,0,.18) 0%, rgba(0,0,0,0) 100%);
        filter:blur(1px) saturate(1.2);
      "></div>` : ""}

      <!-- Fondo bandera derecha -->
      ${p.cB ? `<div style="
        position:absolute;right:0;top:0;width:50%;height:100%;
        background:${bgB} center/cover no-repeat;
        mask-image:linear-gradient(to left, rgba(0,0,0,.18) 0%, rgba(0,0,0,0) 100%);
        -webkit-mask-image:linear-gradient(to left, rgba(0,0,0,.18) 0%, rgba(0,0,0,0) 100%);
        filter:blur(1px) saturate(1.2);
      "></div>` : ""}

      <!-- Overlay oscuro central -->
      <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(15,21,32,.7) 0%,rgba(15,21,32,.45) 40%,rgba(15,21,32,.45) 60%,rgba(15,21,32,.7) 100%)"></div>

      <!-- Contenido -->
      <div style="position:relative;z-index:1;height:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 14px">
        <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
          ${fA}
          <span style="font-family:'Lexend',sans-serif;font-weight:900;font-size:12px;text-transform:uppercase;color:#e0e3e8;letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.teamA}</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex-shrink:0">
          <span style="font-family:'Lexend',sans-serif;font-weight:900;font-size:11px;color:rgba(190,201,193,.35);letter-spacing:.1em">VS</span>
          ${badge}
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;justify-content:flex-end">
          <span style="font-family:'Lexend',sans-serif;font-weight:900;font-size:12px;text-transform:uppercase;color:#e0e3e8;letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:right">${p.teamB}</span>
          ${fB}
        </div>
      </div>
    </div>`;
  }).join("");
  } catch(e) { console.warn("renderCal:", e); }
}

/* Feed: embeds nativos de X, el script los renderiza automáticamente */

/* ═══ MAPA LEAFLET (sin API key) ═══ */
function initMapa() {
  const map = L.map("map", {
    center:[19.30289, -99.15014], zoom:14,
    zoomControl:true, attributionControl:false
  });

  // Tiles oscuros de CartoDB
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom:19, subdomains:"abcd"
  }).addTo(map);

  function mkIcon(color, letter) {
    return L.divIcon({
      className:"",
      html:`<div style="
        width:34px;height:34px;border-radius:50%;
        background:${color};border:2px solid rgba(255,255,255,.7);
        display:flex;align-items:center;justify-content:center;
        font-family:Lexend,sans-serif;font-weight:900;font-size:11px;
        color:#fff;cursor:pointer;
        box-shadow:0 0 10px ${color};
        transition:transform .2s;
      ">${letter}</div>`,
      iconSize:[34,34], iconAnchor:[17,17], popupAnchor:[0,-20]
    });
  }

  const pois = [
    { ll:[19.30289,-99.15014], col:"#84d7ae", label:"ESTADIO AZTECA",      letter:"⚽" },
    { ll:[19.3090, -99.1555],  col:"#00B0FF", label:"METRO AZTECA",        letter:"M" },
    { ll:[19.3075, -99.1582],  col:"#FFD600", label:"TREN LIGERO",         letter:"T" },
    { ll:[19.3005, -99.1475],  col:"#FF6D00", label:"ESTACIONAMIENTO",     letter:"P" },
    { ll:[19.3070, -99.1460],  col:"#c40220", label:"ZONA GASTRONOMICA",   letter:"R" },
    { ll:[19.2970, -99.1530],  col:"#006847", label:"FAN ZONE OFICIAL",    letter:"FZ"},
  ];

  pois.forEach(poi=>{
    const popup = `<span style="font-family:'Lexend',sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;color:#84d7ae">${poi.label}</span>`;
    L.marker(poi.ll, {icon:mkIcon(poi.col, poi.letter)})
      .addTo(map).bindPopup(popup, {className:"leaflet-popup-dark"});
  });

  // Estilos del popup oscuro
  const s = document.createElement("style");
  s.textContent = `.leaflet-popup-dark .leaflet-popup-content-wrapper{background:#1c2024;border:1px solid #3f4943;border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,.6)} .leaflet-popup-dark .leaflet-popup-tip{background:#1c2024} .leaflet-popup-dark .leaflet-popup-content{margin:8px 14px}`;
  document.head.appendChild(s);
}

/* ═══ BOOT ═══ */
document.addEventListener("DOMContentLoaded", ()=>{

  /* ── PARTIDO — apunta a los IDs del hero ── */
  initPartido();
  renderCal();
  tick();
  setInterval(tick, 1000);

  /* ── MAPA ── */
  try {
    initMapa();
  } catch(e) {
    const m = document.getElementById("map");
    if (m) m.innerHTML=`<div class="flex items-center justify-center h-full bg-surface-container flex-col gap-3">
      <svg class="w-12 h-12 text-primary-container"><use href="#ic-map"/></svg>
      <a href="https://maps.google.com/?q=Estadio+Azteca+CDMX" target="_blank"
        class="text-primary font-headline font-bold text-sm tracking-widest uppercase hover:underline">Ver en Google Maps</a>
    </div>`;
  }
});