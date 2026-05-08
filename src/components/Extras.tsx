import { useStore } from '@nanostores/react';
import { cartItems, addCartItem, removeCartItem } from '../store/reservationStore';

const extrasData = [
  { nombre: "Pintacaritas", detalle: "Diseños infantiles con materiales hipoalergénicos.", precio: 120 },
  { nombre: "Uñitas", detalle: "Mini estación de esmaltado infantil.", precio: 100 },
  { nombre: "Hora loca", detalle: "Activación musical y accesorios temáticos.", precio: 200 },
  { nombre: "Asistente de fiestas", detalle: "Apoyo operativo durante todo el evento.", precio: 80 }
];

export default function Extras() {
  const cart = useStore(cartItems);

  const toggleExtra = (extra: typeof extrasData[0]) => {
    const id = `extra-${extra.nombre}`;
    if (cart[id]) {
      removeCartItem(id);
    } else {
      addCartItem({ nombre: extra.nombre, precio: extra.precio, cantidad: 1, tipo: 'extra' });
    }
  };

  return (
    <section id="servicios-extras" className="py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        
        <div className="flex flex-col gap-3 mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c9dbaf] bg-[#eef6df] text-forest-800 font-bold text-sm w-fit font-fredoka">
            <span className="w-2 h-2 rounded-full bg-olive-600"></span>
            Servicios extras
          </span>
          <h2 className="text-[clamp(2rem,3.5vw,3.1rem)] text-forest-900 leading-tight font-fredoka">
            Complementos para elevar la experiencia
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {extrasData.map((extra) => {
            const id = `extra-${extra.nombre}`;
            const isSelected = !!cart[id];

            return (
              <article 
                key={extra.nombre} 
                className={`bg-white border rounded-[20px] p-5 shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${
                  isSelected ? 'border-forest-700 ring-2 ring-forest-700/20' : 'border-cream-200'
                }`}
              >
                <h3 className="text-forest-900 text-xl font-fredoka mb-2">{extra.nombre}</h3>
                <p className="text-ink-700 text-sm leading-relaxed flex-grow">{extra.detalle}</p>
                <strong className="text-forest-900 mt-3 block">S/ {extra.precio.toFixed(2)}</strong>

                <button 
                  onClick={() => toggleExtra(extra)}
                  className={`mt-4 w-full py-2.5 rounded-xl font-bold font-fredoka transition-colors ${
                    isSelected 
                      ? 'bg-[#ffebe9] text-[#cf222e] border border-[#f5c2c7] hover:bg-[#ffdce0]' 
                      : 'bg-[#edf6de] text-forest-900 border border-[#cfe3af] hover:bg-[#e0efc8]'
                  }`}
                >
                  {isSelected ? 'Quitar extra' : 'Agregar extra'}
                </button>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}