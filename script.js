/* ===================================================================
   Ecom Labs Studio — Cotizador de Despliegue Creativo (paquetes)
   -------------------------------------------------------------------
   Dos pestañas:
     · despliegue  → escalera de 3 paquetes mensuales (ancla $550)
     · servicios   → paquetes sueltos por servicio (videos / static / edición)

   Modelo tipo "packs + personalizar": los paquetes son atajos; el
   descuento se calcula por cantidad, así que cualquier ajuste recalcula.

   MODELO DE PRECIOS (editable). Cambia solo estos valores; el resto se
   recalcula solo. Importes en USD.
   =================================================================== */
const PLAN = {
  despliegue: {
    // Escalera mensual. 'pro' es el ancla destacada.
    tiers: [
      { id: "esencial", nombre: "Esencial", precio: 350, videos: 10, statics: 5 },
      { id: "pro",      nombre: "Pro",      precio: 550, videos: 20, statics: 10, destacado: true },
      { id: "scale",    nombre: "Scale",    precio: 750, videos: 30, statics: 15 },
    ],
    extra: { video: 28, static: 6 },   // precio por pieza extra (personalizar)
    funnel: { tofu: 0.50, mofu: 0.30, bofu: 0.20 },
  },
  servicios: {
    video: {
      nombre: "Videos", etiqueta: "15–30 s", unidad: "videos",
      precio: 50, paso: 1, presets: [5, 10, 15], destacado: 10,
      // 5→15% · 10→35% · 15→42%
      desc: (v) => v < 5 ? 0 : v < 10 ? 0.15 : v < 15 ? 0.35 : 0.42,
      nota: "El precio por video baja con el volumen.",
    },
    static: {
      nombre: "Static ads", etiqueta: "", unidad: "static ads",
      precio: 6, paso: 5, presets: [10, 20, 30], destacado: 20,
      // 20→15% · 30→25%
      desc: (s) => s < 20 ? 0 : s < 30 ? 0.15 : 0.25,
      nota: "Bloques de 5 piezas.",
    },
    edicion: {
      nombre: "Edición profesional", etiqueta: "Pro", unidad: "ediciones",
      precio: 40, paso: 1, presets: [5, 10], destacado: 10,
      // 5→20% · 10→30%
      desc: (e) => e < 5 ? 0 : e < 10 ? 0.20 : 0.30,
      nota: "Motion graphics, subtítulos premium, b-rolls y efectos. Requiere material de la marca.",
      perks: ["Motion graphics", "Subtítulos de alto valor percibido", "B-rolls", "Efectos de sonido y visuales"],
    },
  },
  whatsapp: "12015528075",   // +1 (201) 552-8075
};

/* ---------- Helpers ---------- */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
const pctTxt = (d) => "–" + Math.round(d * 100) + "%";
function money(n) {
  const r = Math.round(n * 100) / 100;
  return "$" + r.toLocaleString("en-US", {
    minimumFractionDigits: (r % 1 ? 2 : 0), maximumFractionDigits: 2,
  });
}
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function repartoFunnel(f, total) {
  const tofu = Math.round(total * f.tofu);
  const mofu = Math.round(total * f.mofu);
  return { tofu, mofu, bofu: Math.max(0, total - tofu - mofu) };
}
const waURL = (msg) => "https://wa.me/" + PLAN.whatsapp + "?text=" + encodeURIComponent(msg);
function abrirWhatsApp(msg) { window.open(waURL(msg), "_blank", "noopener"); }

/* Precio de un servicio para una cantidad dada */
function precioServicio(cfg, qty) {
  const bruto = qty * cfg.precio;
  const d = cfg.desc(qty);
  const neto = bruto * (1 - d);
  return { bruto, desc: d, neto, unit: qty > 0 ? neto / qty : 0 };
}

/* ===================================================================
   PANEL A · Despliegue creativo (escalera)
   =================================================================== */
function initDespliegue() {
  const root = $('[data-panel="despliegue"]');
  if (!root) return;
  const cfg = PLAN.despliegue;
  const state = { tierId: (cfg.tiers.find(t => t.destacado) || cfg.tiers[0]).id, extraVideo: 0, extraStatic: 0 };

  // --- Render de tarjetas de tier ---
  const cont = $('[data-tiers]', root);
  cont.innerHTML = cfg.tiers.map(t => `
    <button class="tier ${t.destacado ? "tier--featured" : ""}" data-tier="${t.id}">
      ${t.destacado ? '<span class="tier__badge">Más popular</span>' : ""}
      <span class="tier__name">${esc(t.nombre)}</span>
      <span class="tier__price"><b>${money(t.precio)}</b><small>/mes</small></span>
      <ul class="tier__list">
        <li>Estrategia + funnel incluida</li>
        <li><b>${t.videos}</b> videos 15–30 s</li>
        <li><b>${t.statics}</b> static ads</li>
      </ul>
      <span class="tier__pick">Elegir</span>
    </button>`).join("");

  const tier = () => cfg.tiers.find(t => t.id === state.tierId);

  function render() {
    // Selección visual
    $$('.tier', root).forEach(el => el.classList.toggle("is-selected", el.dataset.tier === state.tierId));

    const t = tier();
    const videos = t.videos + state.extraVideo;
    const statics = t.statics + state.extraStatic;
    const extraTotal = state.extraVideo * cfg.extra.video + state.extraStatic * cfg.extra.static;
    const total = t.precio + extraTotal;
    const piezas = videos + statics;
    const perVideo = videos > 0 ? (total - statics * cfg.extra.static) / videos : 0;

    // Resumen
    $('[data-d-tier]', root).textContent = t.nombre;
    $('[data-d-price]', root).textContent = money(t.precio);
    $('[data-d-videos]', root).textContent = videos;
    $('[data-d-statics]', root).textContent = statics;

    // Extras
    const rowEV = $('[data-d-line="extraVideo"]', root);
    rowEV.hidden = state.extraVideo <= 0;
    if (state.extraVideo > 0) $('[data-d-amount="extraVideo"]', root).textContent = money(state.extraVideo * cfg.extra.video);
    const rowES = $('[data-d-line="extraStatic"]', root);
    rowES.hidden = state.extraStatic <= 0;
    if (state.extraStatic > 0) $('[data-d-amount="extraStatic"]', root).textContent = money(state.extraStatic * cfg.extra.static);

    $('[data-d-total]', root).textContent = money(total);
    $('[data-d-pervideo]', root).textContent = money(perVideo);

    // Funnel
    const r = repartoFunnel(cfg.funnel, piezas);
    const max = Math.max(r.tofu, r.mofu, r.bofu, 1);
    ["tofu", "mofu", "bofu"].forEach(k => {
      $(`[data-funnel="${k}"]`, root).textContent = r[k];
      $(`[data-funnel-bar="${k}"]`, root).style.width = (r[k] / max * 100) + "%";
    });
    $$('[data-d-pieces]', root).forEach(el => el.textContent = piezas);

    // Botones "–"
    $('[data-stepper="extraVideo"] .step[data-dir="-1"]', root).disabled = state.extraVideo <= 0;
    $('[data-stepper="extraStatic"] .step[data-dir="-1"]', root).disabled = state.extraStatic <= 0;
  }

  function mensaje() {
    const t = tier();
    const videos = t.videos + state.extraVideo;
    const statics = t.statics + state.extraStatic;
    const total = t.precio + state.extraVideo * cfg.extra.video + state.extraStatic * cfg.extra.static;
    const r = repartoFunnel(cfg.funnel, videos + statics);
    const L = [];
    L.push("Hola Ecom Labs 👋 Quiero contratar el DESPLIEGUE CREATIVO:");
    L.push("");
    L.push("🚀 Plan: " + t.nombre + " — " + money(t.precio) + "/mes");
    L.push("✅ Incluye análisis de audiencia/producto + estrategia de funnel");
    L.push("🎬 Videos 15–30 s: " + videos + (state.extraVideo ? " (" + t.videos + " + " + state.extraVideo + " extra)" : ""));
    L.push("🖼️ Static ads: " + statics + (state.extraStatic ? " (" + t.statics + " + " + state.extraStatic + " extra)" : ""));
    L.push("📊 Funnel: TOFU " + r.tofu + " · MOFU " + r.mofu + " · BOFU " + r.bofu);
    L.push("");
    L.push("💰 Total: " + money(total) + " USD/mes");
    return L.join("\n");
  }

  // --- Eventos ---
  cont.addEventListener("click", (e) => {
    const card = e.target.closest(".tier");
    if (!card) return;
    state.tierId = card.dataset.tier;
    render();
  });
  $$('.stepper', root).forEach(stp => {
    const kind = stp.dataset.stepper;               // extraVideo | extraStatic
    const paso = kind === "extraStatic" ? PLAN.servicios.static.paso : 1;
    $$('.step', stp).forEach(btn => btn.addEventListener("click", () => {
      state[kind] = Math.max(0, Math.min(999, state[kind] + parseInt(btn.dataset.dir, 10) * paso));
      $('.step__val', stp).value = state[kind];
      render();
    }));
    const input = $('.step__val', stp);
    input.addEventListener("input", () => {
      state[kind] = Math.max(0, Math.min(999, parseInt(input.value.replace(/\D/g, ""), 10) || 0));
      input.value = state[kind]; render();
    });
  });
  $('[data-cta]', root).addEventListener("click", (e) => { e.preventDefault(); abrirWhatsApp(mensaje()); });

  render();
}

/* ===================================================================
   PANEL B · Paquetes por servicio
   =================================================================== */
function initServicios() {
  const root = $('[data-panel="servicios"]');
  if (!root) return;
  const cats = PLAN.servicios;
  const state = { video: 0, static: 0, edicion: 0 };

  // --- Render de bloques de categoría ---
  const cont = $('[data-cats]', root);
  cont.innerHTML = Object.entries(cats).map(([key, c]) => {
    const perks = c.perks ? `<ul class="perks">${c.perks.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : "";
    const presets = c.presets.map(p => {
      const pr = precioServicio(c, p);
      const star = p === c.destacado ? ' preset--star' : "";
      return `<button class="preset${star}" data-cat="${key}" data-qty="${p}">
        <span class="preset__n">Pack ${p}</span>
        <span class="preset__p">${money(pr.neto)}</span>
        <span class="preset__u">${money(pr.unit)} c/u${pr.desc ? " · " + pctTxt(pr.desc) : ""}</span>
      </button>`;
    }).join("");
    const feat = key === "edicion" ? " card--feature" : "";
    const badge = key === "edicion" ? '<div class="feature-badge">Posproducción profesional</div>' : "";
    return `<div class="card cat${feat}" data-catblock="${key}">
      ${badge}
      <div class="card__head">
        <h2>${esc(c.nombre)} ${c.etiqueta ? `<span class="tag tag--soft">${esc(c.etiqueta)}</span>` : ""}</h2>
        <p class="muted">${esc(c.nota)}</p>
      </div>
      ${perks}
      <div class="presets">${presets}</div>
      <div class="counter">
        <div class="counter__info"><span class="counter__name">Personaliza la cantidad</span></div>
        <div class="stepper" data-stepper="${key}">
          <button class="step" data-dir="-1" aria-label="Quitar">–</button>
          <input class="step__val" type="text" inputmode="numeric" value="0" data-qty="${key}" aria-label="Cantidad de ${esc(c.unidad)}" />
          <button class="step" data-dir="1" aria-label="Agregar">+</button>
        </div>
      </div>
      <div class="cat__line" data-catline="${key}" hidden></div>
    </div>`;
  }).join("");

  function calcTotal() {
    return Object.entries(cats).reduce((sum, [k, c]) => sum + precioServicio(c, state[k]).neto, 0);
  }

  function render() {
    let piezas = 0, total = 0;
    Object.entries(cats).forEach(([k, c]) => {
      const pr = precioServicio(c, state[k]);
      total += pr.neto;
      if (k !== "edicion") piezas += state[k];

      // Preset activo
      $$(`.preset[data-cat="${k}"]`, root).forEach(b => b.classList.toggle("is-active", +b.dataset.qty === state[k]));

      // Línea dentro del bloque
      const line = $(`[data-catline="${k}"]`, root);
      if (state[k] > 0) {
        line.hidden = false;
        line.innerHTML = `<span><b>${state[k]}</b> ${esc(c.unidad)} ${pr.desc ? `<span class="off">${pctTxt(pr.desc)}</span>` : ""}</span>
          <span class="cat__amt">${money(pr.unit)} c/u · <b>${money(pr.neto)}</b></span>`;
      } else line.hidden = true;

      // Resumen (carrito)
      const row = $(`[data-s-line="${k}"]`, root);
      if (state[k] > 0) {
        row.hidden = false;
        $(`[data-s-qty="${k}"]`, root).textContent = state[k];
        $(`[data-s-amount="${k}"]`, root).textContent = money(pr.neto);
        $(`[data-s-unit="${k}"]`, root).textContent = money(pr.unit) + " c/u" + (pr.desc ? " · " + pctTxt(pr.desc) : "");
      } else row.hidden = true;

      // Botón "–"
      $(`[data-stepper="${k}"] .step[data-dir="-1"]`, root).disabled = state[k] <= 0;
    });

    $('[data-s-total]', root).textContent = money(total);
    const vacio = (state.video + state.static + state.edicion) <= 0;
    $('[data-s-empty]', root).style.display = vacio ? "" : "none";
    $('[data-cta]', root).classList.toggle("btn--disabled", vacio);
  }

  function setQty(kind, val) {
    const c = cats[kind];
    let n = parseInt(val, 10); if (isNaN(n)) n = 0;
    n = Math.max(0, Math.min(999, n));
    // Ajuste a múltiplos del paso (p.ej. static de 5 en 5)
    if (c.paso > 1) n = Math.round(n / c.paso) * c.paso;
    state[kind] = n;
    $(`[data-qty="${kind}"]`, root).value = n;
    render();
  }

  function mensaje() {
    const L = [];
    L.push("Hola Ecom Labs 👋 Quiero realizar este pedido de PAQUETES:");
    L.push("");
    Object.entries(cats).forEach(([k, c]) => {
      if (state[k] <= 0) return;
      const pr = precioServicio(c, state[k]);
      L.push(`• ${c.nombre}: ${state[k]} ${c.unidad}` + (pr.desc ? " " + pctTxt(pr.desc) : "") +
             ` (${money(pr.unit)} c/u) → ${money(pr.neto)}`);
    });
    L.push("");
    L.push("💰 Total: " + money(calcTotal()) + " USD");
    return L.join("\n");
  }

  // --- Eventos ---
  cont.addEventListener("click", (e) => {
    const preset = e.target.closest(".preset");
    if (preset) { setQty(preset.dataset.cat, preset.dataset.qty); return; }
    const step = e.target.closest(".step");
    if (step) {
      const stp = step.closest(".stepper");
      const kind = stp.dataset.stepper;
      setQty(kind, state[kind] + parseInt(step.dataset.dir, 10) * cats[kind].paso);
    }
  });
  cont.addEventListener("input", (e) => {
    const input = e.target.closest(".step__val");
    if (!input) return;
    const kind = input.dataset.qty;
    state[kind] = Math.max(0, Math.min(999, parseInt(input.value.replace(/\D/g, ""), 10) || 0));
    input.value = state[kind]; render();
  });
  $('[data-cta]', root).addEventListener("click", (e) => {
    e.preventDefault();
    if ((state.video + state.static + state.edicion) > 0) abrirWhatsApp(mensaje());
  });

  render();
}

/* ===================================================================
   Pestañas
   =================================================================== */
function initTabs() {
  const tabs = $$('.tab');
  const paneles = { despliegue: $('[data-panel="despliegue"]'), servicios: $('[data-panel="servicios"]') };
  const activar = (nombre) => {
    tabs.forEach(t => {
      const on = t.dataset.tab === nombre;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    Object.entries(paneles).forEach(([k, el]) => { if (el) el.hidden = (k !== nombre); });
  };
  tabs.forEach(t => t.addEventListener("click", () => activar(t.dataset.tab)));
}

/* ---------- Init ---------- */
initDespliegue();
initServicios();
initTabs();
