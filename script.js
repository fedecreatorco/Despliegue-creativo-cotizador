/* ===================================================================
   Ecom Labs Studio — Cotizador de Despliegue Creativo
   -------------------------------------------------------------------
   MODELO DE PRECIOS (editable). Cambia solo estos valores para ajustar
   toda la cotización; el resto se recalcula solo.
   =================================================================== */
const CONFIG = {
  precio: {
    static:  6,   // USD por static ad  (bloque de 5 = $30)
    video:  50,   // USD por video 15–30 s
    edicion: 40,  // USD por edición profesional individual
  },
  minimo: { static: 10, video: 20, edicion: 0 },  // mínimos del paquete
  paso:   { static:  5, video:  1, edicion: 1 },  // incremento de cada stepper

  // Reparto sugerido de las piezas por etapa de funnel (debe sumar 1).
  funnel: { tofu: 0.50, mofu: 0.30, bofu: 0.20 },

  // WhatsApp de destino del pedido (solo dígitos, con código de país).
  whatsapp: "12015528075",   // +1 (201) 552-8075
};

/* ---- Descuentos por volumen (fórmulas) ----
   VIDEO: 5→15% · 10→30% · +5% por cada 10 adicionales (tope 60%).
   EDICIÓN: 5→15% · 10→20%. */
function descuentoVideo(v) {
  if (v < 5)  return 0;
  if (v < 10) return 0.15;
  return Math.min(0.30 + Math.floor((v - 10) / 10) * 0.05, 0.60);
}
function descuentoEdicion(e) {
  if (e < 5)  return 0;
  if (e < 10) return 0.15;
  return 0.20;
}

/* ---------- Estado ---------- */
const state = {
  platform: "Meta",
  static:  CONFIG.minimo.static,
  video:   CONFIG.minimo.video,
  edicion: CONFIG.minimo.edicion,
};

/* ---------- Helpers ---------- */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const pct   = (d) => "–" + Math.round(d * 100) + "%";

function repartoFunnel(total) {
  const tofu = Math.round(total * CONFIG.funnel.tofu);
  const mofu = Math.round(total * CONFIG.funnel.mofu);
  const bofu = Math.max(0, total - tofu - mofu);
  return { tofu, mofu, bofu };
}

/* ---------- Cálculo central ---------- */
function calcular() {
  const s = state.static, v = state.video, e = state.edicion;

  const staticNet   = s * CONFIG.precio.static;

  const videoGross  = v * CONFIG.precio.video;
  const videoDisc   = descuentoVideo(v);
  const videoNet    = videoGross * (1 - videoDisc);

  const edicionGross = e * CONFIG.precio.edicion;
  const edicionDisc  = descuentoEdicion(e);
  const edicionNet   = edicionGross * (1 - edicionDisc);

  const total  = staticNet + videoNet + edicionNet;
  const ahorro = (videoGross - videoNet) + (edicionGross - edicionNet);
  const piezas = s + v;

  return { s, v, e, staticNet, videoGross, videoDisc, videoNet,
           edicionGross, edicionDisc, edicionNet, total, ahorro, piezas };
}

/* ---------- Render ---------- */
function render() {
  const c = calcular();

  // Cantidades
  $('[data-sum-qty="static"]').textContent  = c.s;
  $('[data-sum-qty="video"]').textContent   = c.v;
  $('[data-sum-qty="edicion"]').textContent = c.e;

  // Static
  $('[data-sum-amount="static"]').textContent = money(c.staticNet);

  // Video (neto + tachado + tag de descuento)
  $('[data-sum-amount="video"]').textContent = money(c.videoNet);
  setDescuentoLinea('video', c.videoDisc, c.videoGross);

  // Edición (fila oculta si es 0)
  const rowE = $('[data-line="edicion"]');
  if (c.e > 0) {
    rowE.hidden = false;
    $('[data-sum-amount="edicion"]').textContent = money(c.edicionNet);
    setDescuentoLinea('edicion', c.edicionDisc, c.edicionGross);
  } else {
    rowE.hidden = true;
  }

  // Total y ahorro
  $('[data-total]').textContent = money(c.total);
  const ahorroWrap = $('[data-ahorro-wrap]');
  if (c.ahorro > 0) {
    ahorroWrap.hidden = false;
    $('[data-ahorro]').textContent = money(c.ahorro);
  } else {
    ahorroWrap.hidden = true;
  }

  // Funnel
  const r = repartoFunnel(c.piezas);
  const max = Math.max(r.tofu, r.mofu, r.bofu, 1);
  ["tofu", "mofu", "bofu"].forEach(k => {
    $(`[data-funnel="${k}"]`).textContent = r[k];
    $(`[data-funnel-bar="${k}"]`).style.width = (r[k] / max * 100) + "%";
  });
  $$('[data-total-pieces]').forEach(el => el.textContent = c.piezas);

  // Botones "–" deshabilitados en el mínimo
  ["static", "video", "edicion"].forEach(k => {
    $(`[data-stepper="${k}"] .step[data-dir="-1"]`).disabled = state[k] <= CONFIG.minimo[k];
  });
}

function setDescuentoLinea(kind, disc, gross) {
  const off = $(`[data-off="${kind}"]`);
  const strike = $(`[data-gross="${kind}"]`);
  if (disc > 0) {
    off.textContent = pct(disc); off.hidden = false;
    strike.textContent = money(gross); strike.hidden = false;
  } else {
    off.hidden = true; strike.hidden = true;
  }
}

/* ---------- Constantes al DOM ---------- */
function pintarConstantes() {
  $('[data-price="static-bloque"]').textContent = money(CONFIG.precio.static * CONFIG.paso.static);
  $('[data-price="video"]').textContent   = money(CONFIG.precio.video);
  $('[data-price="edicion"]').textContent = money(CONFIG.precio.edicion);
  $('[data-min="static"]').textContent    = CONFIG.minimo.static;
  $('[data-min="video"]').textContent     = CONFIG.minimo.video;
  $('[data-block="static"]').textContent  = CONFIG.paso.static;
}

/* ---------- WhatsApp ---------- */
function mensajePedido() {
  const c = calcular();
  const r = repartoFunnel(c.piezas);
  const L = [];
  L.push("Hola Ecom Labs 👋 Quiero realizar este pedido de despliegue creativo:");
  L.push("");
  L.push("📱 Plataforma: " + state.platform);
  L.push("🎨 Static ads: " + c.s + "  (" + money(c.staticNet) + ")");
  let vl = "🎬 Videos 15–30 s: " + c.v;
  if (c.videoDisc > 0) vl += "  " + pct(c.videoDisc);
  vl += "  (" + money(c.videoNet) + ")";
  L.push(vl);
  if (c.e > 0) {
    let el = "✨ Ediciones profesionales: " + c.e;
    if (c.edicionDisc > 0) el += "  " + pct(c.edicionDisc);
    el += "  (" + money(c.edicionNet) + ")";
    L.push(el);
  }
  L.push("");
  L.push("📊 Funnel: TOFU " + r.tofu + " · MOFU " + r.mofu + " · BOFU " + r.bofu);
  L.push("");
  L.push("💰 Total: " + money(c.total) + " USD");
  if (c.ahorro > 0) L.push("(Ahorro por volumen: " + money(c.ahorro) + ")");
  return L.join("\n");
}
function irAWhatsApp(ev) {
  ev.preventDefault();
  const url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(mensajePedido());
  window.open(url, "_blank", "noopener");
}

/* ---------- Eventos ---------- */
function setQty(kind, val) {
  const min = CONFIG.minimo[kind];
  let n = parseInt(val, 10);
  if (isNaN(n)) n = min;
  n = Math.max(min, Math.min(9999, n));
  state[kind] = n;
  $(`[data-qty="${kind}"]`).value = n;
  render();
}

function bind() {
  $$('.stepper').forEach(stp => {
    const kind = stp.dataset.stepper;
    const paso = CONFIG.paso[kind];
    $$('.step', stp).forEach(btn => {
      btn.addEventListener('click', () =>
        setQty(kind, state[kind] + parseInt(btn.dataset.dir, 10) * paso));
    });
    const input = $('.step__val', stp);
    input.addEventListener('input', () => setQty(kind, input.value.replace(/\D/g, '')));
    input.addEventListener('blur',  () => setQty(kind, input.value));
  });

  $$('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      state.platform = chip.dataset.platform;
    });
  });

  $('[data-cta]').addEventListener('click', irAWhatsApp);
}

/* ---------- Init ---------- */
pintarConstantes();
bind();
render();
