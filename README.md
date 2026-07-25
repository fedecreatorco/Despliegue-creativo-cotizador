# Cotizador · Despliegue Creativo para Ads — Ecom Labs Studio

Página web informativa (tipo cotizador) para el servicio de **despliegue creativo para Meta y TikTok Ads**.
El cliente elige un paquete, lo personaliza y ve el precio en tiempo real.

## Dos pestañas

Debajo del subtítulo del hero hay dos pestañas:

1. **Despliegue creativo** — escalera de 3 **planes mensuales** (ancla). Cada plan incluye
   **análisis de audiencia + producto** y **estrategia de funnel** (TOFU · MOFU · BOFU),
   más videos y static ads. Se puede personalizar con piezas extra.
2. **Paquetes por servicio** — paquetes sueltos à la carte: Videos, Static ads y
   Edición profesional. Cada uno con packs-atajo (Good/Better/Best) y stepper para
   personalizar la cantidad. Sin análisis ni estrategia.

Modelo **packs + personalizar**: los paquetes son atajos que fijan la cantidad; el
descuento se calcula por cantidad, así que cualquier ajuste recalcula solo. Cada línea
muestra el **precio por pieza** para que el comprador analice sin calculadora.

## Modelo de precios

Todo el pricing vive en el objeto `PLAN` al inicio de [`script.js`](script.js).
Para ajustar precios o descuentos, edita solo esos valores; el resto se recalcula solo.

### Despliegue creativo — escalera mensual (ancla)

| Plan | Precio | Videos | Static ads | $/video | $/static |
|---|---|---|---|---|---|
| Esencial | **$350/mes** | 10 | 5 | $32 | $6 |
| **Pro** (destacado) | **$550/mes** | 20 | 10 | $25 | $5 |
| Scale | **$750/mes** | 30 | 15 | $23 | $4 |

- Los tres incluyen **estrategia completa** (análisis + funnel TOFU 50% · MOFU 30% · BOFU 20%).
- Cada plan define su **valor por pieza** (`vUnit`/`sUnit`), que baja al subir de plan y se
  muestra en la tarjeta. El precio del plan = `videos × vUnit + statics × sUnit`.
- **Personalizar:** las piezas extra se cobran a la **tarifa del plan elegido** (p. ej. en
  Scale, video extra $23 y static extra $4).
- Es el **mejor precio por pieza** del catálogo (mayoreo mensual).

### Paquetes por servicio (retail, à la carte)

**Videos** ($50 c/u):

| Pack | Videos | Descuento | Precio | $/video |
|---|---|---|---|---|
| Pack 5 | 5 | 15% | $210 | $42 |
| Pack 10 | 10 | 35% | $325 | $32.50 |
| Pack 15 | 15 | 42% | $435 | $29 |

**Static ads** ($6 c/u, bloques de 5):

| Pack | Statics | Descuento | Precio | $/pieza |
|---|---|---|---|---|
| Pack 10 | 10 | — | $60 | $6 |
| Pack 20 | 20 | 15% | $102 | $5.10 |
| Pack 30 | 30 | 25% | $135 | $4.50 |

**Edición profesional** ($40 c/u) — campo destacado con perks (motion graphics,
subtítulos de alto valor, b-rolls, efectos de sonido y visuales; requiere material de la marca):

| Pack | Ediciones | Descuento | Precio | $/pieza |
|---|---|---|---|---|
| Pack 5 | 5 | 20% | $160 | $32 |
| Pack 10 | 10 | 30% | $280 | $28 |

### Común

- WhatsApp de pedidos: `+1 (201) 552-8075` (`PLAN.whatsapp`).
- **CTA "Realizar pedido"** → arma el pedido con todas las especificaciones y abre WhatsApp.

## Estructura

```
cotizador-despliegue-creativo/
├── index.html      # estructura de la página
├── styles.css      # diseño (dark premium, marca Ecom Labs)
├── script.js       # lógica + modelo de precios (objeto PLAN)
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

- [ ] Confirmar el modelo de precios (`PLAN` en `script.js`).
- [ ] (Opcional) Sustituir `assets/logo.png` por el archivo oficial de marca a color real.

---

Ecom Labs Studio™ · Coral Business Ecosystem LLC
