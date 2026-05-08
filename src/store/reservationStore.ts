import { map, computed } from 'nanostores';

export interface EventDetails {
  clienteNombre: string;
  celular: string;
  correo: string;
  cumpleanero: string;
  edad: string;
  fechaEvento: string;
  turno: string;
  ninos: string;
  tematica: string;
  paquete: string;
  observaciones: string;
  extrasText: string;
}

export const eventDetails = map<EventDetails>({
  clienteNombre: '',
  celular: '',
  correo: '',
  cumpleanero: '',
  edad: '',
  fechaEvento: '',
  turno: '',
  ninos: '',
  tematica: '',
  paquete: 'Básico',
  observaciones: '',
  extrasText: '',
});

export function updateEventDetails(key: keyof EventDetails, value: string) {
  eventDetails.setKey(key, value);
}

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tipo: 'show' | 'extra' | 'catering';
}

// Diccionario de items en el carrito para acceso rápido
export const cartItems = map<Record<string, CartItem>>({});

export function addCartItem(item: Omit<CartItem, 'id'>) {
  const id = `${item.tipo}-${item.nombre}`;
  
  // Regla de Negocio: Mínimo 18 unidades para Catering
  let finalQty = item.cantidad;
  if (item.tipo === 'catering' && finalQty < 18) {
    finalQty = 18;
  }

  cartItems.setKey(id, { ...item, id, cantidad: finalQty });
}

export function removeCartItem(id: string) {
  const current = { ...cartItems.get() };
  delete current[id];
  cartItems.set(current);
}

export function updateCateringQuantity(id: string, qty: number) {
  const current = cartItems.get();
  if (current[id]) {
    // Si baja de 18, lo forzamos a 18 (o podríamos eliminarlo si llega a 0, pero lo forzamos para UX simple)
    if (qty < 18) qty = 18;
    cartItems.setKey(id, { ...current[id], cantidad: qty });
  }
}

// Selector global de totales calculados en tiempo real
export const totals = computed([eventDetails, cartItems], (details, items) => {
  let basePrice = 380; // Default
  if (details.fechaEvento) {
    const day = new Date(details.fechaEvento).getUTCDay();
    const isWeekend = day === 5 || day === 6; // 5=Sábado, 6=Domingo
    
    if (details.paquete === 'Básico') basePrice = isWeekend ? 580 : 380;
    else if (details.paquete === 'Estándar') basePrice = isWeekend ? 680 : 480;
    else if (details.paquete === 'Premium') basePrice = isWeekend ? 780 : 580;
  }

  let extraKidsCost = 0;
  const kidsCount = parseInt(details.ninos || '0', 10);
  if (kidsCount > 25) {
    const extraCount = Math.min(kidsCount - 25, 10); // Máximo 35 niños en total
    extraKidsCost = extraCount * 25;
  }

  let showsTotal = 0;
  let extrasTotal = 0;
  let cateringTotal = 0;

  Object.values(items).forEach(item => {
    const lineTotal = item.precio * item.cantidad;
    if (item.tipo === 'show') showsTotal += lineTotal;
    if (item.tipo === 'extra') extrasTotal += lineTotal;
    if (item.tipo === 'catering') cateringTotal += lineTotal;
  });

  return {
    basePrice,
    extraKidsCost,
    showsTotal,
    extrasTotal,
    cateringTotal,
    grandTotal: basePrice + extraKidsCost + showsTotal + extrasTotal + cateringTotal
  };
});