import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartCtx = createContext(null);
const KEY = "simbok.keranjang";

// item: { id, name, price, imageUrl, quantity, note }
function reducer(state, a) {
  switch (a.type) {
    case "tambah": {
      const ada = state.items.find((i) => i.id === a.item.id);
      const items = ada
        ? state.items.map((i) => (i.id === a.item.id ? { ...i, quantity: Math.min(50, i.quantity + 1) } : i))
        : [...state.items, { ...a.item, quantity: 1, note: "" }];
      return { ...state, items };
    }
    case "ubahJumlah": {
      const items = state.items
        .map((i) => (i.id === a.id ? { ...i, quantity: Math.min(50, i.quantity + a.delta) } : i))
        .filter((i) => i.quantity > 0);
      return { ...state, items };
    }
    case "catatan":
      return { ...state, items: state.items.map((i) => (i.id === a.id ? { ...i, note: a.note } : i)) };
    case "hapus":
      return { ...state, items: state.items.filter((i) => i.id !== a.id) };
    case "meja":
      return { ...state, meja: a.meja };
    case "kosongkan":
      return { ...state, items: [] };
    case "buang": // buang menu yang sudah habis
      return { ...state, items: state.items.filter((i) => !a.ids.includes(i.id)) };
    default:
      return state;
  }
}

function init() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { items: [], meja: null };
  } catch {
    return { items: [], meja: null };
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const jumlah = state.items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = state.items.reduce((n, i) => n + i.quantity * i.price, 0);
    return {
      ...state,
      jumlah,
      subtotal,
      tambah: (item) => dispatch({ type: "tambah", item }),
      ubahJumlah: (id, delta) => dispatch({ type: "ubahJumlah", id, delta }),
      setCatatan: (id, note) => dispatch({ type: "catatan", id, note }),
      hapus: (id) => dispatch({ type: "hapus", id }),
      setMeja: (meja) => dispatch({ type: "meja", meja }),
      kosongkan: () => dispatch({ type: "kosongkan" }),
      buang: (ids) => dispatch({ type: "buang", ids }),
    };
  }, [state]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);
