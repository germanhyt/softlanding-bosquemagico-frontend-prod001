import { useStore } from '@nanostores/react';
import { cartItems, addCartItem, removeCartItem } from '../store/reservationStore';

const showsData = [
  { nombre: "Magia Chispeante", descripcion: "Magia participativa con dinámica familiar.", duracion: "45 min", capacidad: "Hasta 35 niños", precio: 150 },
  { nombre: "Show Mimo", descripcion: "Show de interacción escénica y humor infantil.", duracion: "40 min", capacidad: "Hasta 30 niños", precio: 150 },
  { nombre: "Mimo - Globoflexia", descripcion: "Rutina de mimo con figuras de globos.", duracion: "45 min", capacidad: "Hasta 35 niños", precio: 150 },
  { nombre: "Laboratorio Mágico", descripcion: "Experiencia de ciencia divertida para niños.", duracion: "50 min", capacidad: "Hasta 30 niños", precio: 200 },
  { nombre: "Burbujas Fantásticas", descripcion: "Burbujas gigantes y juego visual.", duracion: "35 min", capacidad: "Hasta 25 niños", precio: 180 },
  { nombre: "Chispa Game", descripcion: "Retos y juegos guiados por animador.", duracion: "45 min", capacidad: "Hasta 35 niños", precio: 150 },
  { nombre: "Silent Disco", descripcion: "Fiesta con audífonos y playlists infantiles.", duracion: "45 min", capacidad: "Hasta 25 niños", precio: 250 },
  { nombre: "Cine al Aire Libre", descripcion: "Proyección temática infantil para cierre del evento.", duracion: "60 min", capacidad: "Hasta 35 niños", precio: 300 }
];

export default function Shows() {
  const cart = useStore(cartItems);

  const toggleShow = (show: typeof showsData[0]) => {
    const id = `show-${show.nombre}`;
    if (cart[id]) {
      removeCartItem(id);
    } else {
      addCartItem({ nombre: show.nombre, precio: show.precio, cantidad: 1, tipo: 'show' });
    }
  };

  return (
    <section id="shows" className="py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        
        <div className="flex flex-col gap-3 mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c9dbaf] bg-[#eef6df] text-forest-800 font-bold text-sm w-fit font-fredoka">
            <span className="w-2 h-2 rounded-full bg-olive-600"></span>
            Shows
          </span>
          <h2 className="text-[clamp(2rem,3.5vw,3.1rem)] text-forest-900 leading-tight font-fredoka">
            Shows temáticos para cada estilo de fiesta
          </h2>
          <p className="text-ink-700 text-lg">Listado comercial con duración, capacidad máxima y precios referenciales.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {showsData.map((show) => {
            const id = `show-${show.nombre}`;
            const isSelected = !!cart[id];

            return (
              <article 
                key={show.nombre} 
                className={`bg-white border rounded-[20px] p-5 shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${
                  isSelected ? 'border-forest-700 ring-2 ring-forest-700/20' : 'border-cream-200'
                }`}
              >
                <h3 className="text-forest-900 text-xl font-fredoka mb-2">{show.nombre}</h3>
                <p className="text-ink-700 text-sm leading-relaxed flex-grow">{show.descripcion}</p>
                
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <span className="inline-block bg-[#f8f4e8] border border-[#ecddbd] rounded-[10px] px-2.5 py-1.5 text-[0.88rem] text-[#544c3a] font-semibold w-fit">
                      ⏱️ {show.duracion}
                    </span>
                    <span className="inline-block bg-[#f8f4e8] border border-[#ecddbd] rounded-[10px] px-2.5 py-1.5 text-[0.88rem] text-[#544c3a] font-semibold w-fit">
                      👦 {show.capacidad}
                    </span>
                  </div>
                  <strong className="text-forest-900 mt-1 block">S/ {show.precio.toFixed(2)}</strong>
                </div>

                <button 
                  onClick={() => toggleShow(show)}
                  className={`mt-4 w-full py-2.5 rounded-xl font-bold font-fredoka transition-colors ${
                    isSelected 
                      ? 'bg-[#ffebe9] text-[#cf222e] border border-[#f5c2c7] hover:bg-[#ffdce0]' 
                      : 'bg-[#edf6de] text-forest-900 border border-[#cfe3af] hover:bg-[#e0efc8]'
                  }`}
                >
                  {isSelected ? 'Quitar show' : 'Agregar show'}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}