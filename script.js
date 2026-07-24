/* ===================================================================
   Ecom Labs Studio — Cotizador de Despliegue Creativo
   -------------------------------------------------------------------
   Dos modos de cotización:
     · despliegue  → producto completo (análisis + estrategia + volumen)
     · individual  → piezas sueltas à la carte + edición profesional

   MODELO DE PRECIOS (editable). Cambia solo estos valores; el resto se
   recalcula solo. Todos los importes en USD.

   Regla: los descuentos del despliegue SIEMPRE superan a los del
   individual, para que el despliegue sea la mejor relación precio-beneficio.
   =================================================================== */
const MODOS = {
  despliegue: {
    precio:  { static: 6, video: 50 },   // static: bloque de 5 = $30
    minimo:  { static: 10, video: 20 },
    paso:    { static: 5,  video: 1 },
    hasEdicion: false,
    hasFunnel:  true,
    funnel: { tofu: 0.50, mofu: 0.30, bofu: 0.20 },
    // VIDEO: 3→10% · 5→20% · 10→35% · 20→40% · +5% por cada 10 (tope 60%)
    descVideo: (v) =>
      v < 3  ? 0    :
      v < 5  ? 0.10 :
      v < 10 ? 0.20 :
      v < 20 ? 0.35 :
      Math.min(0.40 + Math.floor((v - 20) / 10) * 0.05, 0.60),
  },
  individual: {
    precio:  { static: 6, video: 50, edicion: 40 },
    minimo:  { static: 0, video: 0, edicion: 0 },
    paso:    { static: 5, video: 1, edicion: 1 },
    hasEdicion: true,
    hasFunnel:  false,
    // VIDEO (descuento ligero, siempre por debajo del despliegue):
    // 3→8% · 5→12% · 10→20% · 20→25% · 30→30%
    descVideo: (v) =>
      v < 3  ? 0    :
      v < 5  ? 0.08 :
      v < 10 ? 0.12 :
      v < 20 ? 0.20 :
      v < 30 ? 0.25 :
      0.30,
    // EDICIÓN: 5→20% · 10→25%
    descEdicion: (e) => e < 5 ? 0 : e < 10 ? 0.20 : 0.25,
  },
  whatsapp: "12015528075",   // +1 (201) 552-8075
};

/* ---------- Helpers ---------- */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
const pctTxt = (d) => "–" + Math.round(d * 100) + "%";

/* Formato de dinero con centavos solo cuando hacen falta ($32.50, $60) */
function money(n) {
  const r = Math.round(n * 100) / 100;
  return "$" + r.toLocaleString("en-US", {
    minimumFractionDigits: (r % 1 ? 2 : 0),
    maximumFractionDigits: 2,
  });
}
const porPieza = (net, qty) => qty > 0 ? money(net / qty) + " c/u" : "";

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
  const piezas = (q.static || 0) + (q.video || 0);   // piezas de contenido
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
    if (k === "static-unit")   el.textContent = money(modo.precio.static);
    if (k === "static-min")    el.textContent = modo.minimo.static;
    if (k === "video")         el.textContent = money(modo.precio.video);
    if (k === "video-min")     el.textContent = modo.minimo.video;
    if (k === "edicion")       el.textContent = money(modo.precio.edicion);
  });

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
  function setUnit(kind, net, qty) {
    const el = q(`[data-unit="${kind}"]`);
    if (el) el.textContent = porPieza(net, qty);
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
    setUnit("static", c.staticNet, state.static);

    // Video
    const vAmt = q('[data-sum-amount="video"]');
    if (vAmt) vAmt.textContent = money(c.videoNet);
    setLineaDesc("video", c.videoDisc, c.videoGross);
    setUnit("video", c.videoNet, state.video);

    // Edición
    if (modo.hasEdicion) {
      const rowE = q('[data-line="edicion"]');
      if (state.edicion > 0) {
        rowE.hidden = false;
        q('[data-sum-amount="edicion"]').textContent = money(c.edNet);
        setLineaDesc("edicion", c.edDisc, c.edGross);
        setUnit("edicion", c.edNet, state.edicion);
      } else {
        rowE.hidden = true;
      }
    }

    // Líneas static/video que se ocultan en 0 (modo individual)
    ["static", "video"].forEach(k => {
      const row = q(`[data-line="${k}"]`);
      if (row && modo.minimo[k] === 0) row.hidden = state[k] <= 0;
    });

    // Total, precio por pieza y ahorro
    q('[data-total]').textContent = money(c.total);
    const contenidoNet = c.staticNet + c.videoNet;
    const ppWrap = q('[data-perpiece-wrap]');
    if (ppWrap) {
      if (c.piezas > 0) {
        ppWrap.hidden = false;
        q('[data-perpiece]').textContent = money(contenidoNet / c.piezas);
        qq('[data-total-pieces]').forEach(el => el.textContent = c.piezas);
      } else ppWrap.hidden = true;
    } else {
      qq('[data-total-pieces]').forEach(el => el.textContent = c.piezas);
    }
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
    }

    // Nudge (individual): comparar SOLO video + static contra el despliegue
    const nudge = q('[data-nudge]');
    if (nudge) {
      const base = { static: state.static, video: state.video };
      const ind = precios(modo, base);
      const des = precios(MODOS.despliegue, base);
      const ahorra = ind.total - des.total;
      if (c.piezas > 0 && ahorra > 0) {
        nudge.hidden = false;
        q('[data-nudge-total]').textContent  = money(des.total);
        q('[data-nudge-ahorro]').textContent = money(ahorra);
      } else {
        nudge.hidden = true;
      }
    }

    // Estado vacío (individual)
    const emptyHint = q('[data-empty-hint]');
    const cta = q('[data-cta]');
    if (modo.minimo.static === 0 && modo.minimo.video === 0) {
      const vacio = (state.static + state.video + state.edicion) <= 0;
      if (emptyHint) emptyHint.style.display = vacio ? "" : "none";
      if (cta) cta.classList.toggle("btn--disabled", vacio);
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
    if (state.static > 0) L.push("🎨 Static ads: " + state.static + " (" + money(c.staticNet / state.static) + " c/u) → " + money(c.staticNet));
    if (state.video > 0) {
      let vl = "🎬 Videos 15–30 s: " + state.video;
      if (c.videoDisc > 0) vl += " " + pctTxt(c.videoDisc);
      vl += " (" + money(c.videoNet / state.video) + " c/u) → " + money(c.videoNet);
      L.push(vl);
    }
    if (modo.hasEdicion && state.edicion > 0) {
      let el = "✨ Ediciones profesionales: " + state.edicion;
      if (c.edDisc > 0) el += " " + pctTxt(c.edDisc);
      el += " (" + money(c.edNet / state.edicion) + " c/u) → " + money(c.edNet);
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
    if ((state.static + state.video + state.edicion) <= 0) return;
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
