/* ===================================================================
   Ecom Labs Studio — Cotizador de Despliegue Creativo
   -------------------------------------------------------------------
   Dos modos de cotización:
     · despliegue  → producto completo (análisis + estrategia + volumen)
     · individual  → piezas sueltas à la carte (mejor precio en despliegue)

   MODELO DE PRECIOS (editable). Cambia solo estos valores; el resto se
   recalcula solo. Todos los importes en USD.
   =================================================================== */
const MODOS = {
  despliegue: {
    precio:  { static: 6, video: 50, edicion: 40 },  // static: bloque de 5 = $30
    minimo:  { static: 10, video: 20, edicion: 0 },
    paso:    { static: 5,  video: 1,  edicion: 1 },
    hasEdicion: true,
    hasFunnel:  true,
    funnel: { tofu: 0.50, mofu: 0.30, bofu: 0.20 },
    // Descuento por volumen en VIDEO: 5→15% · 10→30% · +5% por cada 10 (tope 60%)
    descVideo:   (v) => v < 5 ? 0 : v < 10 ? 0.15 : Math.min(0.30 + Math.floor((v - 10) / 10) * 0.05, 0.60),
    // Descuento en EDICIÓN: 5→15% · 10→20%
    descEdicion: (e) => e < 5 ? 0 : e < 10 ? 0.15 : 0.20,
  },
  individual: {
    precio:  { static: 6, video: 50 },
    minimo:  { static: 0, video: 0 },
    paso:    { static: 5, video: 1 },
    hasEdicion: false,
    hasFunnel:  false,
    // Descuento ligero (à la carte): 10→5% · 20→10% · 40→15%
    descVideo:   (v) => v < 10 ? 0 : v < 20 ? 0.05 : v < 40 ? 0.10 : 0.15,
  },
  whatsapp: "12015528075",   // +1 (201) 552-8075
};

/* ---------- Helpers ---------- */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const pctTxt = (d) => "–" + Math.round(d * 100) + "%";

/* Cálculo de precios para un modo dado y unas cantidades. Reutilizable
   (también lo usa el "nudge" del panel individual). */
function precios(modo, q) {
  const p = modo.precio;
  const staticNet = (q.static || 0) * p.static;

  const videoGross = (q.video || 0) * p.video;
  const videoDisc  = modo.descVideo ? modo.descVideo(q.video || 0) : 0;
  const videoNet   = videoGross * (1 - videoDisc);

  let edGross = 0, edDisc = 0, edNet = 0;
  if (modo.hasEdicion && p.edicion) {
    edGross = (q.edicion || 0) * p.edicion;
    edDisc  = modo.descEdicion(q.edicion || 0);
    edNet   = edGross * (1 - edDisc);
  }

  const total  = staticNet + videoNet + edNet;
  const ahorro = (videoGross - videoNet) + (edGross - edNet);
  const piezas = (q.static || 0) + (q.video || 0);
  return { staticNet, videoGross, videoDisc, videoNet,
           edGross, edDisc, edNet, total, ahorro, piezas };
}

function repartoFunnel(f, total) {
  const tofu = Math.round(total * f.tofu);
  const mofu = Math.round(total * f.mofu);
  const bofu = Math.max(0, total - tofu - mofu);
  return { tofu, mofu, bofu };
}

/* ===================================================================
   Controlador de panel (sirve para ambos modos)
   =================================================================== */
function crearPanel(root, modo, nombreModo) {
  if (!root) return null;

  const state = {
    platform: "Meta",
    static:  modo.minimo.static,
    video:   modo.minimo.video,
    edicion: modo.minimo.edicion || 0,
  };

  /* ---- Rellenar constantes en los textos ---- */
  $$('[data-fill]', root).forEach(el => {
    const k = el.dataset.fill;
    if (k === "static-bloque") el.textContent = money(modo.precio.static * modo.paso.static);
    if (k === "static-min")    el.textContent = modo.minimo.static;
    if (k === "video")         el.textContent = money(modo.precio.video);
    if (k === "video-min")     el.textContent = modo.minimo.video;
    if (k === "edicion")       el.textContent = money(modo.precio.edicion);
  });

  /* ---- Utilidades de DOM dentro del panel ---- */
  const q  = (s) => $(s, root);
  const qq = (s) => $$(s, root);

  function setLineaDesc(kind, disc, gross) {
    const off = q(`[data-off="${kind}"]`);
    const strike = q(`[data-gross="${kind}"]`);
    if (!off) return;
    if (disc > 0) {
      off.textContent = pctTxt(disc); off.hidden = false;
      if (strike) { strike.textContent = money(gross); strike.hidden = false; }
    } else {
      off.hidden = true;
      if (strike) strike.hidden = true;
    }
  }

  function render() {
    const c = precios(modo, state);

    // Cantidades
    ["static", "video", "edicion"].forEach(k => {
      const el = q(`[data-sum-qty="${k}"]`);
      if (el) el.textContent = state[k];
    });

    // Static
    const sAmt = q('[data-sum-amount="static"]');
    if (sAmt) sAmt.textContent = money(c.staticNet);

    // Video
    const vAmt = q('[data-sum-amount="video"]');
    if (vAmt) vAmt.textContent = money(c.videoNet);
    setLineaDesc("video", c.videoDisc, c.videoGross);

    // Edición
    if (modo.hasEdicion) {
      const rowE = q('[data-line="edicion"]');
      if (state.edicion > 0) {
        rowE.hidden = false;
        q('[data-sum-amount="edicion"]').textContent = money(c.edNet);
        setLineaDesc("edicion", c.edDisc, c.edGross);
      } else {
        rowE.hidden = true;
      }
    }

    // Líneas que se ocultan si están en 0 (modo individual)
    ["static", "video"].forEach(k => {
      const row = q(`[data-line="${k}"]`);
      if (row && row.hasAttribute("hidden") !== undefined && modo.minimo[k] === 0) {
        row.hidden = state[k] <= 0;
      }
    });

    // Total y ahorro
    q('[data-total]').textContent = money(c.total);
    const ahorroWrap = q('[data-ahorro-wrap]');
    if (ahorroWrap) {
      if (c.ahorro > 0) { ahorroWrap.hidden = false; q('[data-ahorro]').textContent = money(c.ahorro); }
      else ahorroWrap.hidden = true;
    }

    // Funnel
    if (modo.hasFunnel) {
      const r = repartoFunnel(modo.funnel, c.piezas);
      const max = Math.max(r.tofu, r.mofu, r.bofu, 1);
      ["tofu", "mofu", "bofu"].forEach(k => {
        q(`[data-funnel="${k}"]`).textContent = r[k];
        q(`[data-funnel-bar="${k}"]`).style.width = (r[k] / max * 100) + "%";
      });
      qq('[data-total-pieces]').forEach(el => el.textContent = c.piezas);
    }

    // Nudge (individual): comparar contra el despliegue
    const nudge = q('[data-nudge]');
    if (nudge) {
      const d = precios(MODOS.despliegue, state);
      const ahorra = c.total - d.total;
      if (c.piezas > 0 && ahorra > 0) {
        nudge.hidden = false;
        q('[data-nudge-total]').textContent  = money(d.total);
        q('[data-nudge-ahorro]').textContent = money(ahorra);
      } else {
        nudge.hidden = true;
      }
    }

    // Estado vacío (individual)
    const emptyHint = q('[data-empty-hint]');
    const cta = q('[data-cta]');
    if (modo.minimo.static === 0 && modo.minimo.video === 0) {
      const vacio = c.piezas <= 0;
      if (emptyHint) emptyHint.style.display = vacio ? "" : "none";
      if (cta) { cta.classList.toggle("btn--disabled", vacio); }
    }

    // Botones "–" deshabilitados en el mínimo
    ["static", "video", "edicion"].forEach(k => {
      const btn = q(`[data-stepper="${k}"] .step[data-dir="-1"]`);
      if (btn) btn.disabled = state[k] <= modo.minimo[k];
    });
  }

  /* ---- Cantidades ---- */
  function setQty(kind, val) {
    const min = modo.minimo[kind];
    let n = parseInt(val, 10);
    if (isNaN(n)) n = min;
    n = Math.max(min, Math.min(9999, n));
    state[kind] = n;
    q(`[data-qty="${kind}"]`).value = n;
    render();
  }

  /* ---- WhatsApp ---- */
  function mensaje() {
    const c = precios(modo, state);
    const L = [];
    L.push(nombreModo === "despliegue"
      ? "Hola Ecom Labs 👋 Quiero realizar este pedido de DESPLIEGUE CREATIVO:"
      : "Hola Ecom Labs 👋 Quiero realizar este pedido de PIEZAS INDIVIDUALES:");
    L.push("");
    L.push("📱 Plataforma: " + state.platform);
    if (state.static > 0) L.push("🎨 Static ads: " + state.static + "  (" + money(c.staticNet) + ")");
    if (state.video > 0) {
      let vl = "🎬 Videos 15–30 s: " + state.video;
      if (c.videoDisc > 0) vl += "  " + pctTxt(c.videoDisc);
      vl += "  (" + money(c.videoNet) + ")";
      L.push(vl);
    }
    if (modo.hasEdicion && state.edicion > 0) {
      let el = "✨ Ediciones profesionales: " + state.edicion;
      if (c.edDisc > 0) el += "  " + pctTxt(c.edDisc);
      el += "  (" + money(c.edNet) + ")";
      L.push(el);
    }
    if (modo.hasFunnel) {
      const r = repartoFunnel(modo.funnel, c.piezas);
      L.push("");
      L.push("📊 Funnel: TOFU " + r.tofu + " · MOFU " + r.mofu + " · BOFU " + r.bofu);
      L.push("✅ Incluye análisis de audiencia/producto + estrategia de funnel");
    }
    L.push("");
    L.push("💰 Total: " + money(c.total) + " USD");
    if (c.ahorro > 0) L.push("(Ahorro por volumen: " + money(c.ahorro) + ")");
    return L.join("\n");
  }
  function pedir(ev) {
    ev.preventDefault();
    const c = precios(modo, state);
    if (c.piezas <= 0) return;  // nada que pedir
    const url = "https://wa.me/" + MODOS.whatsapp + "?text=" + encodeURIComponent(mensaje());
    window.open(url, "_blank", "noopener");
  }

  /* ---- Eventos ---- */
  qq('.stepper').forEach(stp => {
    const kind = stp.dataset.stepper;
    const paso = modo.paso[kind] || 1;
    $$('.step', stp).forEach(btn => {
      btn.addEventListener('click', () => setQty(kind, state[kind] + parseInt(btn.dataset.dir, 10) * paso));
    });
    const input = $('.step__val', stp);
    input.addEventListener('input', () => setQty(kind, input.value.replace(/\D/g, '')));
    input.addEventListener('blur',  () => setQty(kind, input.value));
  });

  qq('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      qq('.chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      state.platform = chip.dataset.platform;
    });
  });

  const cta = q('[data-cta]');
  if (cta) cta.addEventListener('click', pedir);

  render();
  return { render };
}

/* ===================================================================
   Pestañas
   =================================================================== */
function initTabs() {
  const tabs = $$('.tab');
  const paneles = { despliegue: $('[data-panel="despliegue"]'), individual: $('[data-panel="individual"]') };
  function activar(nombre) {
    tabs.forEach(t => {
      const on = t.dataset.tab === nombre;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? "true" : "false");
    });
    Object.entries(paneles).forEach(([k, el]) => { if (el) el.hidden = (k !== nombre); });
  }
  tabs.forEach(t => t.addEventListener('click', () => activar(t.dataset.tab)));

  // Botón "ver despliegue creativo" del nudge
  const goto = $('[data-goto-despliegue]');
  if (goto) goto.addEventListener('click', () => {
    activar('despliegue');
    document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ---------- Init ---------- */
crearPanel($('[data-panel="despliegue"]'), MODOS.despliegue, "despliegue");
crearPanel($('[data-panel="individual"]'), MODOS.individual, "individual");
initTabs();
