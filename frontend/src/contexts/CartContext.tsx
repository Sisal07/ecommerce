import { getCart } from "@/lib/services";
import { ICart, ICartitems } from "@/types/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ICartContextProp {
  addToCart: (newItem: ICartitems) => void;
  removeFromCart: (id: number) => void;
  cart: ICart;
  cartitemCount: number;
  cartTotal: number;
  cartCode: string;
  loading: boolean;
  increaseItemQuantityContext: (itemId: number) => void;
  decreaseItemQuantityContext: (itemId: number) => void;
  resetCart: () => void;
  toggleCartCode: () => void;
}

const CartContext = createContext<ICartContextProp | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<ICart>({
    id: 0,
    cart_code: "",
    cartitems: [],
    cart_total: 0,
  });

  // ✅ FIX: explicitly string type
  const [cartCode, setCartCode] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [newCartCodeToggle, setNewCartCodeToggle] = useState(false);

  const cartitemCount = cart.cartitems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartTotal = cart.cartitems.reduce((acc, curr) => acc + curr.sub_total, 0);

  function resetCart() {
    setCart({
      id: 0,
      cart_code: "",
      cartitems: [],
      cart_total: 0,
    });
  }

  function toggleCartCode() {
    setNewCartCodeToggle((curr) => !curr);
  }

  const addToCart = (newItem: ICartitems) => {
    setCart((prevCart) => ({
      ...prevCart,
      cartitems: [...prevCart.cartitems, newItem],
      cart_total: prevCart.cart_total + newItem.sub_total,
    }));
  };

  const increaseItemQuantityContext = (itemId: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.cartitems.map((item) => {
        if (item.id === itemId) {
          const quantity = item.quantity + 1;
          return {
            ...item,
            quantity,
            sub_total: item.product.price * quantity,
          };
        }
        return item;
      });

      return {
        ...prevCart,
        cartitems: updatedItems,
        cart_total: updatedItems.reduce((sum, i) => sum + i.sub_total, 0),
      };
    });
  };

  const decreaseItemQuantityContext = (itemId: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.cartitems.map((item) => {
        if (item.id === itemId) {
          const quantity = Math.max(1, item.quantity - 1);
          return {
            ...item,
            quantity,
            sub_total: item.product.price * quantity,
          };
        }
        return item;
      });

      return {
        ...prevCart,
        cartitems: updatedItems,
        cart_total: updatedItems.reduce((sum, i) => sum + i.sub_total, 0),
      };
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.cartitems.filter((item) => item.id !== id);
      return {
        ...prevCart,
        cartitems: updatedItems,
        cart_total: updatedItems.reduce((sum, i) => sum + i.sub_total, 0),
      };
    });
  };

  // ✅ CREATE CART FROM BACKEND (FIXED)
  useEffect(() => {
    async function initCart() {
      let existingCode: string | null = localStorage.getItem("cartCode");

      if (!existingCode) {
        const res = await fetch("http://127.0.0.1:8000/create_cart/", {
          method: "POST",
        });

        const data = await res.json();

        // ✅ ensure string
        existingCode = data.cart_code as string;

        localStorage.setItem("cartCode", existingCode);
      }

      setCartCode(existingCode);
    }

    initCart();
  }, [newCartCodeToggle]);

  // ✅ FETCH CART (SAFE)
  useEffect(() => {
    if (!cartCode) return;

    async function handleGetCart() {
      setLoading(true);
      try {
        const response = await getCart(cartCode);
        setCart(response);
      } catch (err) {
        console.error("Cart fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    handleGetCart();
  }, [cartCode]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        cartTotal,
        cartitemCount,
        cartCode,
        loading,
        increaseItemQuantityContext,
        decreaseItemQuantityContext,
        resetCart,
        toggleCartCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};