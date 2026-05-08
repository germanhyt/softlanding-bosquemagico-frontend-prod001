import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { eventDetails, cartItems, totals, updateEventDetails } from '../store/reservationStore';

export default function QuoteForm() {
  const formState = useStore(eventDetails);
  const cart = useStore(cartItems);
  const calculatedTotals = useStore(totals);
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateEventDetails(name as keyof typeof formState, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = {
        eventDetails: formState,
        items: Object.values(cart),
        totals: calculatedTotals
      };

      const baseUrl = import.meta.env.PUBLIC_REFUGIO_API_URL?.replace(/\/$/, '');
      const url = baseUrl
        ? `${baseUrl}/api/public/bosque-magico/leads`
        : '/api/public/bosque-magico/leads';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        const total =
          (result.data && typeof result.data === 'object' && result.data !== null && 'total' in result.data
            ? (result.data as { total?: number }).total
            : undefined) ?? calculatedTotals.grandTotal;
        setSuccessMessage(`¡Solicitud registrada! Total referido: S/ ${total}`);
      } else {
        const msg =
          (typeof result.detail === 'string' && result.detail) ||
          (Array.isArray(result.detail) && result.detail.map((x: unknown) => JSON.stringify(x)).join(' ')) ||
          result.message ||
          'Error al procesar la cotización.';
        setError(msg);
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Helper para renderizar los items seleccionados en el resumen
  const selectedItems = Object.values(cart);

  return (
    <section id="cotizacion" className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col gap-3 mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c9dbaf] bg-[#eef6df] text-forest-800 font-bold text-sm w-fit font-fredoka">
            <span className="w-2 h-2 rounded-full bg-olive-600"></span>
            Formulario de cotización
          </span>
          <h2 className="text-[clamp(2rem,3.5vw,3.1rem)] text-forest-900 leading-tight font-fredoka">
            Solicita tu propuesta personalizada
          </h2>
          <p className="text-ink-700 text-lg">Revisa el resumen de tu selección y completa tus datos para pre-reservar.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 p-6 rounded-[30px] border-2 border-[#dfcea8] bg-gradient-to-b from-[#fffef9] to-[#f3f8e8] shadow-soft">
          
          <form id="quoteForm" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>
            
            {successMessage && (
              <div className="sm:col-span-2 p-4 mb-2 rounded-xl bg-[#d7f7df] border border-[#9ad2aa] text-[#0f3f28] font-bold">
                ✅ {successMessage}
              </div>
            )}
            {error && (
              <div className="sm:col-span-2 p-4 mb-2 rounded-xl bg-[#ffebe9] border border-[#f5c2c7] text-[#cf222e] font-bold">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="clienteNombre" className="text-forest-900 font-fredoka">Nombre del cliente</label>
              <input id="clienteNombre" name="clienteNombre" required value={formState.clienteNombre} onChange={handleChange} className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="celular" className="text-forest-900 font-fredoka">Celular</label>
              <input id="celular" name="celular" type="tel" required value={formState.celular} onChange={handleChange} className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="correo" className="text-forest-900 font-fredoka">Correo</label>
              <input id="correo" name="correo" type="email" required value={formState.correo} onChange={handleChange} className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cumpleanero" className="text-forest-900 font-fredoka">Nombre del cumpleañero</label>
              <input id="cumpleanero" name="cumpleanero" required value={formState.cumpleanero} onChange={handleChange} className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edad" className="text-forest-900 font-fredoka">Edad</label>
              <input id="edad" name="edad" type="number" min="1" max="15" required value={formState.edad} onChange={handleChange} className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fechaEvento" className="text-forest-900 font-fredoka">Fecha del evento</label>
              <input 
                id="fechaEvento" 
                name="fechaEvento" 
                type="date" 
                required 
                value={formState.fechaEvento}
                onChange={handleChange}
                className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="turno" className="text-forest-900 font-fredoka">Turno</label>
              <select id="turno" name="turno" required value={formState.turno} onChange={handleChange} className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]">
                <option value="">Selecciona</option>
                <option>Turno 1 - 9:00 a.m. - 12:00 m.</option>
                <option>Turno 2 - 2:00 p.m. - 5:00 p.m.</option>
                <option>Turno 3 - 7:00 p.m. - 10:00 p.m.</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ninos" className="text-forest-900 font-fredoka">Cantidad de niños</label>
              <input 
                id="ninos" 
                name="ninos" 
                type="number" 
                min="10" 
                max="35" 
                required 
                value={formState.ninos}
                onChange={handleChange}
                className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tematica" className="text-forest-900 font-fredoka">Temática</label>
              <input id="tematica" name="tematica" value={formState.tematica} onChange={handleChange} className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="paquete" className="text-forest-900 font-fredoka">Paquete</label>
              <select 
                id="paquete" 
                name="paquete" 
                value={formState.paquete}
                onChange={handleChange}
                className="w-full border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8]"
              >
                <option>Básico</option>
                <option>Estándar</option>
                <option>Premium</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="observaciones" className="text-forest-900 font-fredoka">Observaciones</label>
              <textarea id="observaciones" name="observaciones" value={formState.observaciones} onChange={handleChange} className="w-full min-h-[100px] border border-[#ddccaa] rounded-xl px-3.5 py-2.5 bg-[#fffef9] text-ink-900 focus:outline-none focus:ring-2 focus:ring-[#d7e8b8] resize-y"></textarea>
            </div>
            
            <div className="sm:col-span-2 pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center text-white bg-gradient-to-b from-forest-700 to-forest-900 shadow-strong px-8 py-3.5 rounded-full font-fredoka font-bold text-lg hover:-translate-y-0.5 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando Reserva...' : 'Completar Pre-Reserva'}
              </button>
            </div>
          </form>

          {/* RESUMEN FLOTANTE */}
          <aside className="p-6 rounded-2xl border border-[#dceabf] bg-gradient-to-b from-[#f8ffea] to-[#edf6d9] flex flex-col gap-4 self-start sticky top-24" aria-live="polite">
            <div className="flex flex-col gap-1">
              <h3 className="text-3xl text-forest-900 font-fredoka">Tu Reserva</h3>
              <p className="text-sm text-ink-700">Resumen dinámico de tu configuración.</p>
            </div>
            
            <div className="flex flex-col gap-2 w-full mt-2 text-sm">
              <div className="flex justify-between items-center border-b border-dashed border-[#cfddb2] pb-2">
                <span className="text-ink-900">Paquete Base ({formState.paquete})</span>
                <strong className="text-forest-900 font-fredoka text-base">S/ {calculatedTotals.basePrice.toFixed(2)}</strong>
              </div>
              
              {calculatedTotals.extraKidsCost > 0 && (
                <div className="flex justify-between items-center border-b border-dashed border-[#cfddb2] pb-2">
                  <span className="text-ink-900">Niños adicionales</span>
                  <strong className="text-forest-900 font-fredoka text-base">S/ {calculatedTotals.extraKidsCost.toFixed(2)}</strong>
                </div>
              )}

              {/* LISTADO DE ITEMS AGREGADOS (Shows, Extras, Catering) */}
              {selectedItems.length > 0 && (
                <div className="py-2 border-b border-dashed border-[#cfddb2] flex flex-col gap-1.5">
                  <span className="text-wood-700 font-bold mb-1 uppercase tracking-wide text-xs">Complementos:</span>
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-ink-900">
                      <span className="truncate pr-2">
                        {item.cantidad > 1 ? `${item.cantidad}x ` : ''}{item.nombre}
                      </span>
                      <strong className="text-forest-900 font-fredoka shrink-0">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="text-ink-900 font-bold text-base">Total Final</span>
                <strong className="text-forest-900 font-fredoka text-3xl">S/ {calculatedTotals.grandTotal.toFixed(2)}</strong>
              </div>
            </div>
            
            <p className="text-xs text-ink-700 mt-2 bg-white/40 p-3 rounded-lg border border-[#cfddb2]/50">
              El adelanto para separar la fecha es de <strong>S/ 500</strong>.
            </p>
          </aside>

        </div>
      </div>
    </section>
  );
}
