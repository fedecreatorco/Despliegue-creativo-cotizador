# Cotizador · Despliegue Creativo para Ads — Ecom Labs Studio

Página web informativa (tipo cotizador) para el servicio de **despliegue creativo para Meta y TikTok Ads**.
El cliente arma su paquete y ve el precio en tiempo real.

## Qué cotiza

Un despliegue creativo incluye:

- **Análisis de audiencia + producto/servicio** (incluido)
- **Estrategia de funnel** TOFU · MOFU · BOFU (incluido)
- **Generación y despliegue** — volumen con calidad y edición básica:
  - **Static ads** — mínimo 10, en bloques de 5
  - **Videos 15–30 s** — mínimo 20
- **Edición profesional** (opcional) — posproducción de alto valor: motion graphics,
  subtítulos premium, b-rolls y efectos de sonido/visuales. Requiere material de la marca.
- Opción de **sumar más piezas**, con cálculo automático del total, los descuentos por
  volumen y el reparto por funnel.
- **CTA "Realizar pedido"** → arma el pedido con todas las especificaciones y abre WhatsApp.

## Modelo de precios

Todo el pricing vive en un solo objeto `CONFIG` al inicio de [`script.js`](script.js).
Para ajustar precios, mínimos o descuentos, edita solo esos valores.

**Static ads** — bloques de 5, **$30 por bloque** ($6 c/u) · mínimo 10.

**Videos 15–30 s** — $50 c/u, con descuento por volumen:

| Cantidad | Descuento |
|---|---|
| 5–9 | 15% |
| 10–19 | 30% |
| 20–29 | 35% |
| +10 videos | +5% (tope 60%) |

**Edición profesional** — $40 c/u:

| Cantidad | Descuento |
|---|---|
| 5–9 | 15% |
| 10+ | 20% |

- Mínimos del paquete base: 10 static + 20 videos → **$710 USD** (video ya con 35% off).
- Reparto funnel: TOFU 50% · MOFU 30% · BOFU 20%.
- WhatsApp de pedidos: `+1 (201) 552-8075` (`CONFIG.whatsapp`).

> El análisis de audiencia y la estrategia de funnel se muestran como **incluidos** (valor agregado del paquete), no como línea con precio.

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
