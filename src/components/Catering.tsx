import { useStore } from '@nanostores/react';
import { cartItems, addCartItem, removeCartItem, updateCateringQuantity } from '../store/reservationStore';

const cateringData = [
  { nombre: "Popcorn", detalle: "Presentación por unidad", precio: 5 },
  { nombre: "Algodón de azúcar", detalle: "Presentación por unidad", precio: 6 },
  { nombre: "Manzanas acarameladas", detalle: "Presentación por unidad", precio: 7 },
  { nombre: "Mazamorra morada", detalle: "Presentación por unidad", precio: 6 },
  { nombre: "Gelatina", detalle: "Presentación por unidad", precio: 4 },
  { nombre: "Arroz con leche", detalle: "Presentación por unidad", precio: 6 }
];

export default function Catering() {
  const cart = useStore(cartItems);

  const toggleCatering = (item: typeof cateringData[0]) => {
    const id = `catering-${item.nombre}`;
    if (cart[id]) {
      removeCartItem(id);
    } else {
      addCartItem({ nombre: item.nombre, precio: item.precio, cantidad: 18, tipo: 'catering' });
    }
  };

  const handleQtyChange = (id: string, newQty: number) => {
    updateCateringQuantity(id, newQty);
  };

  return (
    <section id="catering" className="py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        
        <div className="flex flex-col gap-3 mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c9dbaf] bg-[#eef6df] text-forest-800 font-bold text-sm w-fit font-fredoka">
            <span className="w-2 h-2 rounded-full bg-olive-600"></span>
            Catering
          </span>
          <h2 className="text-[clamp(2rem,3.5vw,3.1rem)] text-forest-900 leading-tight font-fredoka">
            Opciones dulces para eventos infantiles
          </h2>
          <p className="text-ink-700 text-lg">
            <strong className="font-bold text-wood-700">Condición:</strong> mínimo 18 unidades por evento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cateringData.map((item) => {
            const id = `catering-${item.nombre}`;
            const cartItem = cart[id];
            const isSelected = !!cartItem;

            return (
              <article 
                key={item.nombre} 
                className={`bg-white border rounded-[20px] p-5 shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${
                  isSelected ? 'border-forest-700 ring-2 ring-forest-700/20' : 'border-cream-200'
                }`}
              >
                <h3 className="text-forest-900 text-xl font-fredoka mb-2">{item.nombre}</h3>
                <p className="text-ink-700 text-sm leading-relaxed flex-grow">{item.detalle}</p>
                <strong className="text-forest-900 mt-2 block">S/ {item.precio.toFixed(2)} c/u</strong>

                {isSelected ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-[#fffef9] border border-[#ddccaa] rounded-xl px-3 py-1">
                      <span className="text-sm font-bold text-ink-900">Cant:</span>
                      <input 
                        type="number" 
                        min="18"
                        value={cartItem.cantidad}
                        onChange={(e) => handleQtyChange(id, parseInt(e.target.value, 10))}
                        className="w-16 text-right bg-transparent font-fredoka text-forest-900 focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => toggleCatering(item)}
                      className="w-full py-2 rounded-xl font-bold font-fredoka transition-colors bg-[#ffebe9] text-[#cf222e] border border-[#f5c2c7] hover:bg-[#ffdce0]"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => toggleCatering(item)}
                    className="mt-4 w-full py-2.5 rounded-xl font-bold font-fredoka transition-colors bg-[#edf6de] text-forest-900 border border-[#cfe3af] hover:bg-[#e0efc8]"
                  >
                    Agregar (Mínimo 18)
                  </button>
                )}
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}