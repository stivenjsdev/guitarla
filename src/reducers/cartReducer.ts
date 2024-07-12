import { db } from "../data/db";
import { CartItem, Guitar } from "../types/types";

type CartState = {
  data: Array<Guitar>;
  cart: Array<CartItem>;
};

export type CartActions =
  | { type: "ADD_TO_CART"; payload: { item: Guitar } }
  | { type: "REMOVE_FROM_CART"; payload: { id: Guitar["id"] } }
  | { type: "INCREASE_QUANTITY"; payload: { id: Guitar["id"] } }
  | { type: "DECREASE_QUANTITY"; payload: { id: Guitar["id"] } }
  | { type: "CLEAR_CART" };

const initialStorageCart = (): Array<CartItem> => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
  data: db,
  cart: initialStorageCart(),
};

const MAX_ITEMS = 10;
const MIN_ITEMS = 1;

export const reducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  if (action.type === "ADD_TO_CART") {
    const itemExists = state.cart.find(
      (guitar) => guitar.id === action.payload.item.id
    );

    let updatedCart: Array<CartItem> = [];

    if (itemExists) {
      updatedCart = state.cart.map((item) =>
        item.id === action.payload.item.id && item.quantity < MAX_ITEMS
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const newItem: CartItem = { ...action.payload.item, quantity: 1 };
      updatedCart = [...state.cart, newItem];
    }

    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "REMOVE_FROM_CART") {
    const updatedCart = state.cart.filter(
      (item) => item.id !== action.payload.id
    );
    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "INCREASE_QUANTITY") {
    const updatedCart = state.cart.map((item) =>
      item.id === action.payload.id && item.quantity < MAX_ITEMS
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "DECREASE_QUANTITY") {
    const updatedCart = state.cart.map((item) =>
      item.id === action.payload.id && item.quantity > MIN_ITEMS
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "CLEAR_CART") {
    return {
      ...state,
      cart: [],
    };
  }

  return state;
};
