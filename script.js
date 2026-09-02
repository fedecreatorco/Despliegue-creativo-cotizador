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

   IDIOMA: todo el texto visible vive en I18N (es/en). PLAN solo guarda
   números; los nombres/etiquetas se resuelven contra LABELS[lang] en
   cada render, así que cambiar de idioma no toca la lógica de precios.
   =================================================================== */
const PLAN = {
  despliegue: {
    tiers: [
      { id: "esencial", precio: 350, videos: 10, statics: 5,  vUnit: 32, sUnit: 6 },
      { id: "pro",      precio: 550, videos: 20, statics: 10, vUnit: 25, sUnit: 5, destacado: true },
      { id: "scale",    precio: 750, videos: 30, statics: 15, vUnit: 23, sUnit: 4 },
    ],
    funnel: { tofu: 0.50, mofu: 0.30, bofu: 0.20 },
  },
  servicios: {
    video: {
      precio: 50, paso: 1, presets: [5, 10, 15], destacado: 10,
      // 5→15% · 10→35% · 15→42%
      desc: (v) => v < 5 ? 0 : v < 10 ? 0.15 : v < 15 ? 0.35 : 0.42,
    },
    static: {
      precio: 6, paso: 5, presets: [10, 20, 30], destacado: 20,
      // 20→15% · 30→25%
      desc: (s) => s < 20 ? 0 : s < 30 ? 0.15 : 0.25,
    },
    edicion: {
      precio: 40, paso: 1, presets: [5, 10], destacado: 10,
      // 5→20% · 10→30%
      desc: (e) => e < 5 ? 0 : e < 10 ? 0.20 : 0.30,
    },
  },
  whatsapp: "12015528075",   // +1 (201) 552-8075
};

/* ---------- Etiquetas por idioma (nombres, notas, perks) ---------- */
const LABELS = {
  es: {
    tiers: { esencial: "Esencial", pro: "Pro", scale: "Scale" },
    servicios: {
      video:   { nombre: "Videos", etiqueta: "15–30 s", unidad: "videos", nota: "El precio por video baja con el volumen." },
      static:  { nombre: "Static ads", etiqueta: "", unidad: "static ads", nota: "Bloques de 5 piezas." },
      edicion: {
        nombre: "Edición profesional", etiqueta: "Pro", unidad: "ediciones",
        nota: "Motion graphics, subtítulos premium, b-rolls y efectos. Requiere material de la marca.",
        perks: ["Motion graphics", "Subtítulos de alto valor percibido", "B-rolls", "Efectos de sonido y visuales"],
      },
    },
  },
  en: {
    tiers: { esencial: "Essential", pro: "Pro", scale: "Scale" },
    servicios: {
      video:   { nombre: "Videos", etiqueta: "15–30s", unidad: "videos", nota: "The price per video drops as volume goes up." },
      static:  { nombre: "Static ads", etiqueta: "", unidad: "static ads", nota: "Sold in blocks of 5." },
      edicion: {
        nombre: "Pro editing", etiqueta: "Pro", unidad: "edits",
        nota: "Motion graphics, premium subtitles, b-rolls and effects. Requires brand material.",
        perks: ["Motion graphics", "High-perceived-value subtitles", "B-rolls", "Sound and visual effects"],
      },
    },
  },
};

/* ---------- Diccionario de textos de interfaz ---------- */
const I18N = {
  es: {
    "nav.agenda": "Agendar",
    "hero.eyebrow": "Despliegue creativo para Ads",
    "hero.title": 'Cotiza tu <em>máquina</em> de creativos<br />para <em>Meta</em> y <em>TikTok</em>.',
    "hero.sub": "Análisis de audiencia y producto + una serie de piezas de video y static ads para cada etapa del funnel. Elige tu paquete y personalízalo.",
    "tabs.despliegue.title": "Despliegue creativo",
    "tabs.despliegue.desc": "Plan mensual · estrategia + volumen",
    "tabs.despliegue.badge": "Mejor precio-beneficio",
    "tabs.servicios.title": "Paquetes por servicio",
    "tabs.servicios.desc": "Videos, static ads y edición pro, sueltos",
    "panelA.personaliza.title": "Personaliza tu plan",
    "panelA.personaliza.opcional": "Opcional",
    "panelA.personaliza.desc": "¿Necesitas más volumen? Suma piezas extra a tu plan mensual.",
    "panelA.counter.videos": "Videos extra",
    "panelA.counter.static": "Static ads extra",
    "panelA.funnel.title": "Distribución por funnel",
    "panelA.funnel.desc": (n) => `Repartimos tus <strong>${n}</strong> piezas en las tres etapas del embudo.`,
    "funnel.tofu_desc": "· descubrimiento",
    "funnel.mofu_desc": "· consideración",
    "funnel.bofu_desc": "· conversión",
    "summary.eyebrow": "Tu plan mensual",
    "summary.included1": "Análisis de audiencia + producto",
    "summary.included2": "Estrategia de funnel TOFU · MOFU · BOFU",
    "summary.pill_incluido": "Incluido",
    "summary.plan_label": "Plan",
    "summary.total_mensual": "Total mensual",
    "unit.videos_label": "videos 15–30 s",
    "unit.static_label": "static ads",
    "unit.ediciones_label": "ediciones pro",
    "unit.cu": "c/u",
    "unit.videos_extra": "videos extra",
    "unit.static_extra": "static ads extra",
    "unit.mo": "/mes",
    "unit.slash_video": "/video",
    "unit.slash_static": "/static",
    "unit.piezas": "piezas",
    "cta.pedido": "Realizar pedido",
    "summary2.eyebrow": "Tu pedido",
    "summary2.note": "Paquetes sueltos · no incluye análisis ni estrategia de funnel.",
    "summary2.empty_hint": "Elige un paquete o personaliza cantidades para cotizar.",
    "summary2.total": "Total",
    "includes.eyebrow": "Qué es un despliegue creativo",
    "includes.title": "No son <em>piezas sueltas</em>. Es un sistema para testear y escalar.",
    "includes.f1.title": "Análisis previo",
    "includes.f1.desc": "Estudiamos tu audiencia, tu producto o servicio y a tu competencia para detectar los ángulos que realmente convierten.",
    "includes.f2.title": "Volumen con calidad",
    "includes.f2.desc": "Video apalancado con IA (15–30 s) y static ads en múltiples formatos, con edición básica lista para salir a testear.",
    "includes.f3.title": "Posproducción pro",
    "includes.f3.desc": "Cuando quieres subir el valor percibido: motion graphics, subtítulos premium, b-rolls y efectos de sonido y visuales.",
    "footer.eyebrow": "Nuestro manifiesto",
    "footer.manifesto": "No gestionamos <em>redes</em>. Construimos <em>máquinas de venta</em> de e-commerce rentables. Con datos, no con <em>intuición</em>.",
    "footer.legal": "Ecom Labs Studio™ · Documento informativo · © 2026 Coral Business Ecosystem LLC",
    "tier.badge_popular": "Más popular",
    "tier.included": "Estrategia + funnel incluida",
    "tier.pick": "Elegir",
    "service.personaliza_cantidad": "Personaliza la cantidad",
    "service.pack": "Pack",
    "service.quitar": "Quitar",
    "service.agregar": "Agregar",
    "service.cantidad_de": "Cantidad de",
    "service.badge_pro": "Posproducción profesional",
    "note.video": (money, tName) => `${money} c/u — tarifa de tu plan ${tName}`,
    "note.static": (money) => `${money} c/u · bloques de 5`,
    "msg.despliegue.saludo": "Hola Ecom Labs 👋 Quiero contratar el DESPLIEGUE CREATIVO:",
    "msg.despliegue.plan": (n, p) => `🚀 Plan: ${n} — ${p}/mes`,
    "msg.despliegue.incluye": "✅ Incluye análisis de audiencia/producto + estrategia de funnel",
    "msg.despliegue.videos": (total, base, extra) => `🎬 Videos 15–30 s: ${total}` + (extra ? ` (${base} + ${extra} extra)` : ""),
    "msg.despliegue.statics": (total, base, extra) => `🖼️ Static ads: ${total}` + (extra ? ` (${base} + ${extra} extra)` : ""),
    "msg.despliegue.funnel": (t, m, b) => `📊 Funnel: TOFU ${t} · MOFU ${m} · BOFU ${b}`,
    "msg.despliegue.total": (total) => `💰 Total: ${total} USD/mes`,
    "msg.servicios.saludo": "Hola Ecom Labs 👋 Quiero realizar este pedido de PAQUETES:",
    "msg.servicios.linea": (nombre, qty, unidad, pct, unit, neto) =>
      `• ${nombre}: ${qty} ${unidad}${pct ? " " + pct : ""} (${unit} c/u) → ${neto}`,
    "msg.servicios.total": (total) => `💰 Total: ${total} USD`,
  },
  en: {
    "nav.agenda": "Book a call",
    "hero.eyebrow": "Creative deployment for Ads",
    "hero.title": 'Quote your creative <em>machine</em><br />for <em>Meta</em> and <em>TikTok</em>.',
    "hero.sub": "Audience and product analysis + a series of video and static ad pieces for every stage of the funnel. Pick your package and customize it.",
    "tabs.despliegue.title": "Creative deployment",
    "tabs.despliegue.desc": "Monthly plan · strategy + volume",
    "tabs.despliegue.badge": "Best value",
    "tabs.servicios.title": "Service packages",
    "tabs.servicios.desc": "Videos, static ads and pro editing, à la carte",
    "panelA.personaliza.title": "Customize your plan",
    "panelA.personaliza.opcional": "Optional",
    "panelA.personaliza.desc": "Need more volume? Add extra pieces to your monthly plan.",
    "panelA.counter.videos": "Extra videos",
    "panelA.counter.static": "Extra static ads",
    "panelA.funnel.title": "Funnel distribution",
    "panelA.funnel.desc": (n) => `We split your <strong>${n}</strong> pieces across the three funnel stages.`,
    "funnel.tofu_desc": "· awareness",
    "funnel.mofu_desc": "· consideration",
    "funnel.bofu_desc": "· conversion",
    "summary.eyebrow": "Your monthly plan",
    "summary.included1": "Audience + product analysis",
    "summary.included2": "TOFU · MOFU · BOFU funnel strategy",
    "summary.pill_incluido": "Included",
    "summary.plan_label": "Plan",
    "summary.total_mensual": "Total per month",
    "unit.videos_label": "15–30s videos",
    "unit.static_label": "static ads",
    "unit.ediciones_label": "pro edits",
    "unit.cu": "each",
    "unit.videos_extra": "extra videos",
    "unit.static_extra": "extra static ads",
    "unit.mo": "/mo",
    "unit.slash_video": "/video",
    "unit.slash_static": "/static",
    "unit.piezas": "pieces",
    "cta.pedido": "Place order",
    "summary2.eyebrow": "Your order",
    "summary2.note": "À la carte packages · doesn't include analysis or funnel strategy.",
    "summary2.empty_hint": "Pick a package or customize quantities to get a quote.",
    "summary2.total": "Total",
    "includes.eyebrow": "What is a creative deployment",
    "includes.title": "These aren't <em>one-off pieces</em>. It's a system to test and scale.",
    "includes.f1.title": "Upfront analysis",
    "includes.f1.desc": "We study your audience, your product or service, and your competitors to find the angles that actually convert.",
    "includes.f2.title": "Volume with quality",
    "includes.f2.desc": "AI-leveraged video (15–30s) and static ads in multiple formats, with basic editing ready to test.",
    "includes.f3.title": "Pro post-production",
    "includes.f3.desc": "When you want to raise perceived value: motion graphics, premium subtitles, b-rolls, and sound/visual effects.",
    "footer.eyebrow": "Our manifesto",
    "footer.manifesto": "We don't manage social media. We build profitable e-commerce <em>sales machines</em>. With data, not <em>intuition</em>.",
    "footer.legal": "Ecom Labs Studio™ · Informational document · © 2026 Coral Business Ecosystem LLC",
    "tier.badge_popular": "Most popular",
    "tier.included": "Strategy + funnel included",
    "tier.pick": "Select",
    "service.personaliza_cantidad": "Customize quantity",
    "service.pack": "Pack",
    "service.quitar": "Remove",
    "service.agregar": "Add",
    "service.cantidad_de": "Quantity of",
    "service.badge_pro": "Professional post-production",
    "note.video": (money, tName) => `${money} each — your ${tName} plan rate`,
    "note.static": (money) => `${money} each · blocks of 5`,
    "msg.despliegue.saludo": "Hi Ecom Labs 👋 I want to hire the CREATIVE DEPLOYMENT:",
    "msg.despliegue.plan": (n, p) => `🚀 Plan: ${n} — ${p}/mo`,
    "msg.despliegue.incluye": "✅ Includes audience/product analysis + funnel strategy",
    "msg.despliegue.videos": (total, base, extra) => `🎬 15–30s videos: ${total}` + (extra ? ` (${base} + ${extra} extra)` : ""),
    "msg.despliegue.statics": (total, base, extra) => `🖼️ Static ads: ${total}` + (extra ? ` (${base} + ${extra} extra)` : ""),
    "msg.despliegue.funnel": (t, m, b) => `📊 Funnel: TOFU ${t} · MOFU ${m} · BOFU ${b}`,
    "msg.despliegue.total": (total) => `💰 Total: ${total} USD/mo`,
    "msg.servicios.saludo": "Hi Ecom Labs 👋 I'd like to place this PACKAGE order:",
    "msg.servicios.linea": (nombre, qty, unidad, pct, unit, neto) =>
      `• ${nombre}: ${qty} ${unidad}${pct ? " " + pct : ""} (${unit} each) → ${neto}`,
    "msg.servicios.total": (total) => `💰 Total: ${total} USD`,
  },
};

/* ---------- Estado de idioma ---------- */
let LANG = (localStorage.getItem("ecomlabs_lang") === "en") ? "en" : "es";
const t = (key, ...args) => {
  const v = (I18N[LANG] && I18N[LANG][key] !== undefined) ? I18N[LANG][key] : I18N.es[key];
  return typeof v === "function" ? v(...args) : v;
};
const rerenderers = [];

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

  const tier = () => cfg.tiers.find(t => t.id === state.tierId);
  const tierName = (id) => (LABELS[LANG].tiers[id] || LABELS.es.tiers[id]);

  // --- Render de tarjetas de tier ---
  function renderTiers() {
    const cont = $('[data-tiers]', root);
    cont.innerHTML = cfg.tiers.map(tr => `
      <button class="tier ${tr.destacado ? "tier--featured" : ""}" data-tier="${tr.id}">
        ${tr.destacado ? `<span class="tier__badge">${esc(t("tier.badge_popular"))}</span>` : ""}
        <span class="tier__name">${esc(tierName(tr.id))}</span>
        <span class="tier__price"><b>${money(tr.precio)}</b><small>${esc(t("unit.mo"))}</small></span>
        <ul class="tier__list">
          <li>${esc(t("tier.included"))}</li>
          <li><b>${tr.videos}</b> ${esc(t("unit.videos_label"))} <span class="tier__unit">(${money(tr.vUnit)} ${esc(t("unit.cu"))})</span></li>
          <li><b>${tr.statics}</b> ${esc(t("unit.static_label"))} <span class="tier__unit">(${money(tr.sUnit)} ${esc(t("unit.cu"))})</span></li>
        </ul>
        <span class="tier__pick">${esc(t("tier.pick"))}</span>
      </button>`).join("");
    $$('.tier', root).forEach(el => el.classList.toggle("is-selected", el.dataset.tier === state.tierId));
  }

  function render() {
    // Selección visual
    $$('.tier', root).forEach(el => el.classList.toggle("is-selected", el.dataset.tier === state.tierId));

    const tr = tier();
    const videos = tr.videos + state.extraVideo;
    const statics = tr.statics + state.extraStatic;
    const extraTotal = state.extraVideo * tr.vUnit + state.extraStatic * tr.sUnit;
    const total = tr.precio + extraTotal;
    const piezas = videos + statics;

    // Resumen
    $('[data-d-tier]', root).textContent = tierName(tr.id);
    $('[data-d-price]', root).textContent = money(tr.precio);
    $('[data-d-videos]', root).textContent = tr.videos;
    $('[data-d-statics]', root).textContent = tr.statics;
    $$('[data-d-vunit]', root).forEach(el => el.textContent = money(tr.vUnit));
    $$('[data-d-sunit]', root).forEach(el => el.textContent = money(tr.sUnit));

    // Notas dinámicas de "Personaliza tu plan" (tarifa según el plan elegido)
    $('[data-extra-note="video"]', root).textContent = t("note.video", money(tr.vUnit), tierName(tr.id));
    $('[data-extra-note="static"]', root).textContent = t("note.static", money(tr.sUnit));

    // Extras
    const rowEV = $('[data-d-line="extraVideo"]', root);
    rowEV.hidden = state.extraVideo <= 0;
    if (state.extraVideo > 0) {
      $('[data-d-xqty="video"]', root).textContent = state.extraVideo;
      $('[data-d-amount="extraVideo"]', root).textContent = money(state.extraVideo * tr.vUnit);
    }
    const rowES = $('[data-d-line="extraStatic"]', root);
    rowES.hidden = state.extraStatic <= 0;
    if (state.extraStatic > 0) {
      $('[data-d-xqty="static"]', root).textContent = state.extraStatic;
      $('[data-d-amount="extraStatic"]', root).textContent = money(state.extraStatic * tr.sUnit);
    }

    $('[data-d-total]', root).textContent = money(total);

    // Funnel
    const r = repartoFunnel(cfg.funnel, piezas);
    const max = Math.max(r.tofu, r.mofu, r.bofu, 1);
    ["tofu", "mofu", "bofu"].forEach(k => {
      $(`[data-funnel="${k}"]`, root).textContent = r[k];
      $(`[data-funnel-bar="${k}"]`, root).style.width = (r[k] / max * 100) + "%";
    });
    $$('[data-d-pieces]', root).forEach(el => el.textContent = piezas);
    $('[data-funnel-desc]', root).innerHTML = t("panelA.funnel.desc", piezas);

    // Botones "–"
    $('[data-stepper="extraVideo"] .step[data-dir="-1"]', root).disabled = state.extraVideo <= 0;
    $('[data-stepper="extraStatic"] .step[data-dir="-1"]', root).disabled = state.extraStatic <= 0;
  }

  function mensaje() {
    const tr = tier();
    const videos = tr.videos + state.extraVideo;
    const statics = tr.statics + state.extraStatic;
    const total = tr.precio + state.extraVideo * tr.vUnit + state.extraStatic * tr.sUnit;
    const r = repartoFunnel(cfg.funnel, videos + statics);
    const L = [];
    L.push(t("msg.despliegue.saludo"));
    L.push("");
    L.push(t("msg.despliegue.plan", tierName(tr.id), money(tr.precio)));
    L.push(t("msg.despliegue.incluye"));
    L.push(t("msg.despliegue.videos", videos, tr.videos, state.extraVideo));
    L.push(t("msg.despliegue.statics", statics, tr.statics, state.extraStatic));
    L.push(t("msg.despliegue.funnel", r.tofu, r.mofu, r.bofu));
    L.push("");
    L.push(t("msg.despliegue.total", money(total)));
    return L.join("\n");
  }

  // --- Eventos ---
  $('[data-tiers]', root).addEventListener("click", (e) => {
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

  renderTiers();
  render();
  rerenderers.push(() => { renderTiers(); render(); });
}

/* ===================================================================
   PANEL B · Paquetes por servicio
   =================================================================== */
function initServicios() {
  const root = $('[data-panel="servicios"]');
  if (!root) return;
  const cats = PLAN.servicios;
  const state = { video: 0, static: 0, edicion: 0 };
  const labels = () => LABELS[LANG].servicios;

  // --- Render de bloques de categoría ---
  function renderCats() {
    const cont = $('[data-cats]', root);
    const L = labels();
    cont.innerHTML = Object.entries(cats).map(([key, c]) => {
      const lb = L[key];
      const perks = lb.perks ? `<ul class="perks">${lb.perks.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : "";
      const presets = c.presets.map(p => {
        const pr = precioServicio(c, p);
        const star = p === c.destacado ? ' preset--star' : "";
        return `<button class="preset${star}" data-cat="${key}" data-qty="${p}">
          <span class="preset__n">${esc(t("service.pack"))} ${p}</span>
          <span class="preset__p">${money(pr.neto)}</span>
          <span class="preset__u">${money(pr.unit)} ${esc(t("unit.cu"))}${pr.desc ? " · " + pctTxt(pr.desc) : ""}</span>
        </button>`;
      }).join("");
      const feat = key === "edicion" ? " card--feature" : "";
      const badge = key === "edicion" ? `<div class="feature-badge">${esc(t("service.badge_pro"))}</div>` : "";
      return `<div class="card cat${feat}" data-catblock="${key}">
        ${badge}
        <div class="card__head">
          <h2>${esc(lb.nombre)} ${lb.etiqueta ? `<span class="tag tag--soft">${esc(lb.etiqueta)}</span>` : ""}</h2>
          <p class="muted">${esc(lb.nota)}</p>
        </div>
        ${perks}
        <div class="presets">${presets}</div>
        <div class="counter">
          <div class="counter__info"><span class="counter__name">${esc(t("service.personaliza_cantidad"))}</span></div>
          <div class="stepper" data-stepper="${key}">
            <button class="step" data-dir="-1" aria-label="${esc(t("service.quitar"))}">–</button>
            <input class="step__val" type="text" inputmode="numeric" value="0" data-qty="${key}" aria-label="${esc(t("service.cantidad_de"))} ${esc(lb.unidad)}" />
            <button class="step" data-dir="1" aria-label="${esc(t("service.agregar"))}">+</button>
          </div>
        </div>
        <div class="cat__line" data-catline="${key}" hidden></div>
      </div>`;
    }).join("");
  }

  function calcTotal() {
    return Object.entries(cats).reduce((sum, [k, c]) => sum + precioServicio(c, state[k]).neto, 0);
  }

  function render() {
    const L = labels();
    let total = 0;
    Object.entries(cats).forEach(([k, c]) => {
      const lb = L[k];
      const pr = precioServicio(c, state[k]);
      total += pr.neto;

      // Preset activo
      $$(`.preset[data-cat="${k}"]`, root).forEach(b => b.classList.toggle("is-active", +b.dataset.qty === state[k]));

      // Línea dentro del bloque
      const line = $(`[data-catline="${k}"]`, root);
      if (state[k] > 0) {
        line.hidden = false;
        line.innerHTML = `<span><b>${state[k]}</b> ${esc(lb.unidad)} ${pr.desc ? `<span class="off">${pctTxt(pr.desc)}</span>` : ""}</span>
          <span class="cat__amt">${money(pr.unit)} ${esc(t("unit.cu"))} · <b>${money(pr.neto)}</b></span>`;
      } else line.hidden = true;

      // Resumen (carrito)
      const row = $(`[data-s-line="${k}"]`, root);
      if (state[k] > 0) {
        row.hidden = false;
        $(`[data-s-qty="${k}"]`, root).textContent = state[k];
        $(`[data-s-amount="${k}"]`, root).textContent = money(pr.neto);
        $(`[data-s-unit="${k}"]`, root).textContent = money(pr.unit) + " " + t("unit.cu") + (pr.desc ? " · " + pctTxt(pr.desc) : "");
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
    const input = $(`[data-qty="${kind}"]`, root);
    if (input) input.value = n;
    render();
  }

  function mensaje() {
    const L = labels();
    const lines = [];
    lines.push(t("msg.servicios.saludo"));
    lines.push("");
    Object.entries(cats).forEach(([k, c]) => {
      if (state[k] <= 0) return;
      const lb = L[k];
      const pr = precioServicio(c, state[k]);
      lines.push(t("msg.servicios.linea", lb.nombre, state[k], lb.unidad, pr.desc ? pctTxt(pr.desc) : "", money(pr.unit), money(pr.neto)));
    });
    lines.push("");
    lines.push(t("msg.servicios.total", money(calcTotal())));
    return lines.join("\n");
  }

  // --- Eventos (delegados en .config, que persiste entre renders) ---
  const cont = $('[data-cats]', root);
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

  renderCats();
  render();
  rerenderers.push(() => { renderCats(); render(); });
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

/* ===================================================================
   Idioma (ES / EN)
   =================================================================== */
function applyStaticI18n() {
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.documentElement.lang = LANG;
}

function initLangSwitch() {
  const sw = $('[data-langsw]');
  if (!sw) return;
  const buttons = $$('.langsw__btn', sw);
  const paint = () => buttons.forEach(b => {
    const on = b.dataset.lang === LANG;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  buttons.forEach(b => b.addEventListener("click", () => {
    if (b.dataset.lang === LANG) return;
    LANG = b.dataset.lang;
    localStorage.setItem("ecomlabs_lang", LANG);
    paint();
    applyStaticI18n();
    rerenderers.forEach(fn => fn());
  }));
  paint();
}

/* ---------- Init ---------- */
applyStaticI18n();
initDespliegue();
initServicios();
initTabs();
initLangSwitch();
