# Cotizador · Despliegue Creativo para Ads — Ecom Labs Studio

Página web informativa (tipo cotizador) para el servicio de **despliegue creativo para Meta y TikTok Ads**.
El cliente arma su paquete y ve el precio en tiempo real.

## Dos modos de cotización (pestañas)

Debajo del subtítulo del hero hay dos pestañas:

1. **Despliegue creativo** — el producto completo. Incluye **análisis de audiencia +
   producto/servicio** y **estrategia de funnel** (TOFU · MOFU · BOFU) gratis, con
   descuentos por volumen agresivos. Es la mejor relación precio-beneficio.
2. **Piezas individuales** — à la carte, para quien solo necesita unas piezas (videos,
   static ads o los dos). Sin análisis ni estrategia; descuentos por volumen ligeros.
   Un *nudge* en vivo muestra cuánto ahorraría el cliente pasando al despliegue.

### Despliegue creativo incluye

- **Análisis de audiencia + producto/servicio** (incluido)
- **Estrategia de funnel** TOFU · MOFU · BOFU (incluido)
- **Generación y despliegue** — volumen con calidad y edición básica:
  - **Static ads** — mínimo 10, en bloques de 5
  - **Videos 15–30 s** — mínimo 20
- **Edición profesional** (opcional) — posproducción de alto valor: motion graphics,
  subtítulos premium, b-rolls y efectos de sonido/visuales. Requiere material de la marca.
- Reparto automático por funnel y cálculo del total en tiempo real.
- **CTA "Realizar pedido"** → arma el pedido con todas las especificaciones y abre WhatsApp.

## Modelo de precios

Todo el pricing vive en el objeto `MODOS` al inicio de [`script.js`](script.js),
separado por modo (`despliegue` e `individual`). Para ajustar precios, mínimos o
descuentos, edita solo esos valores; el resto se recalcula solo.

### Modo · Despliegue creativo (mejor precio-beneficio)

**Static ads** — bloques de 5, **$30 por bloque** ($6 c/u) · mínimo 10.

**Videos 15–30 s** — $50 c/u, con descuento por volumen:

| Cantidad | Descuento |
|---|---|
| 5–9 | 15% |
| 10–19 | 30% |
| 20–29 | 35% |
| +10 videos | +5% (tope 60%) |

**Edición profesional** (opcional) — $40 c/u:

| Cantidad | Descuento |
|---|---|
| 5–9 | 15% |
| 10+ | 20% |

- Mínimos del paquete base: 10 static + 20 videos → **$710 USD** (video ya con 35% off).
- Incluye análisis + estrategia de funnel (TOFU 50% · MOFU 30% · BOFU 20%).

### Modo · Piezas individuales (à la carte)

- **Static ads** — bloques de 5, **$30 por bloque** ($6 c/u).
- **Videos 15–30 s** — $50 c/u, con descuento **ligero**: 10+ → 5% · 20+ → 10% · 40+ → 15%.
- Sin análisis ni estrategia de funnel. Un *nudge* compara en vivo con el despliegue.
- Ejemplo: 10 static + 20 videos = **$960** (vs. $710 en despliegue).

### Común

- WhatsApp de pedidos: `+1 (201) 552-8075` (`MODOS.whatsapp`).
- El análisis y la estrategia se muestran como **incluidos** solo en el modo despliegue.

## Estructura

```
cotizador-despliegue-creativo/
├── index.html      # estructura de la página
├── styles.css      # diseño (dark premium, marca Ecom Labs)
├── script.js       # lógica del cotizador + modelo de precios (CONFIG)
├── assets/
│   └── logo.png    # logo Ecom Labs Studio (crema sobre negro)
└── README.md
```

## Ver localmente

Es HTML/CSS/JS puro, sin build. Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Publicar con GitHub Pages

1. Sube esta carpeta a un repositorio.
2. En el repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Elige la rama `main` y carpeta `/root`. Guarda.
4. La página queda pública en `https://<usuario>.github.io/<repo>/`.

## Pendientes antes de publicar

- [ ] Confirmar el modelo de precios (`CONFIG` en `script.js`).
- [ ] (Opcional) Sustituir `assets/logo.png` por el archivo oficial de marca a color real.

---

Ecom Labs Studio™ · Coral Business Ecosystem LLC
