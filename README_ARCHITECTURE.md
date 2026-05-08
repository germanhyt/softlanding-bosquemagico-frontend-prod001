# Bosque Mágico - Landing Page Architecture

## 🌲 Visión General
Esta landing page es el punto de entrada para los clientes de "Bosque Mágico". Está diseñada para ser extremadamente rápida (Performance-first), responsive y capaz de manejar una lógica de cotización compleja sin recargar la página.

## 🏗️ Stack Tecnológico
- **Framework:** [Astro 5](https://astro.build/) (Modo SSR - Server Side Rendering).
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (Motor JIT de alto rendimiento).
- **Interactividad:** [React 19](https://react.dev/) (Patrón de Islas).
- **Estado Global:** [Nanostores](https://github.com/nanostores/nanostores) (Compartido entre islas de React).
- **Fuentes:** Fredoka (Títulos) y Nunito (Cuerpo).

## 🧩 Arquitectura del Proyecto

### 1. El Patrón de Islas (Islands Architecture)
Para maximizar el rendimiento, la mayor parte de la página es HTML estático generado en el servidor. Solo los componentes que requieren interacción son "activados" con JavaScript (React):
- **Estáticos (Astro):** Hero, FAQ, Footer, Galería, Testimonios.
- **Dinámicos (React):** `QuoteForm`, `Shows`, `Extras`, `Catering`.

### 2. Gestión de Estado (Nanostores)
En lugar de usar un Context de React que pesaría en toda la aplicación, usamos **Nanostores**. Esto permite que el componente de `Shows` actualice el carrito y que el `QuoteForm` (el resumen lateral) reaccione instantáneamente, incluso si están en partes diferentes del DOM.
- **Store Principal:** `src/store/reservationStore.ts`
  - `eventDetails`: Datos del cliente y del evento.
  - `cartItems`: Lista de complementos seleccionados.
  - `totals`: Selector computado que calcula precios, extras por niños y descuentos en tiempo real.

### 3. Lógica de Precios
La lógica de negocio está centralizada en el store para evitar duplicidad:
- **Precios Diferenciados:** Días de semana vs. Fines de semana (Viernes, Sábado, Domingo).
- **Reglas de Negocio:** 
  - Capacidad base de 25 niños. 
  - Cargo adicional por niño extra (S/ 25).
  - Mínimo de 18 unidades para el servicio de Catering.

## 🔌 Integración con APIs

El proyecto está **API-Ready**. Actualmente cuenta con:
- **Endpoint Local:** `src/pages/api/quote.ts` procesa las solicitudes de cotización.
- **Flujo de Datos:** 
  1. El usuario completa el formulario.
  2. El frontend envía un JSON con `eventDetails`, `items` y `totals`.
  3. El servidor recibe, valida y puede persistir en una base de datos o enviar un correo/WhatsApp.

## 📂 Estructura de Carpetas
```text
landing-bosque-magico/
├── src/
│   ├── components/       # Componentes Astro (Estáticos) y React (Dinámicos)
│   ├── layouts/          # Plantilla base HTML
│   ├── pages/            # Rutas y Endpoints de API
│   ├── store/            # Lógica de estado global (Nanostores)
│   └── styles/           # Configuración de Tailwind v4
├── astro.config.mjs      # Configuración del motor y adaptadores
└── package.json          # Dependencias del proyecto
```

## 🚀 Próximos Pasos
1. **Conexión CRM:** Vincular el endpoint de API con el backend del CRM para crear leads automáticamente.
2. **Validación de Fechas:** Integrar con un calendario para deshabilitar fechas ya reservadas en tiempo real.
3. **Pasarela de Pagos:** Implementar el pago del adelanto (S/ 500) para confirmar la reserva.

---
**Nota del Arquitecto:** Esta estructura garantiza que el sitio cargue en menos de 1 segundo (LCP) y que la experiencia de usuario sea fluida como una aplicación nativa.
