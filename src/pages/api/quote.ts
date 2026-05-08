import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Simulamos un parsing del body que viene del frontend
    const body = await request.json();
    const { clienteNombre, celular, correo, fechaEvento, ninos, paquete } = body;

    // Validación básica
    if (!clienteNombre || !fechaEvento || !ninos || !paquete) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Faltan datos obligatorios para cotizar." 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- LÓGICA DE COTIZACIÓN (Server-side) ---
    // Esta lógica simula lo que haría el CRM interno.
    // 0 = Monday en UTC (depende del offset), pero para simplificar:
    const dateObj = new Date(fechaEvento);
    const day = dateObj.getUTCDay();
    const isWeekend = day === 5 || day === 6; // 5=Sat, 6=Sun

    let basePrice = 380;
    if (paquete === 'Básico') basePrice = isWeekend ? 580 : 380;
    else if (paquete === 'Estándar') basePrice = isWeekend ? 680 : 480;
    else if (paquete === 'Premium') basePrice = isWeekend ? 780 : 580;

    let extraKidsCost = 0;
    const kidsCount = parseInt(ninos, 10);
    if (kidsCount > 25) {
      const extraCount = Math.min(kidsCount - 25, 10); // Límite de 35 niños (10 extra max)
      extraKidsCost = extraCount * 25;
    }

    const total = basePrice + extraKidsCost;

    // Simulamos un retraso de red (1 segundo) para ver el loading state en React
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Respuesta exitosa
    return new Response(JSON.stringify({
      success: true,
      message: "Cotización generada y enviada al CRM exitosamente.",
      data: {
        clienteNombre,
        basePrice,
        extraKidsCost,
        total
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: "Error al procesar la solicitud." 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};