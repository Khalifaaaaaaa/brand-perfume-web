import type { CartItem } from "../components/CartProvider";

export type PaymentMethod = "GCash" | "Cash on Delivery";

export interface ReceiptInfo {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  dataUrl: string;
}

export interface CheckoutCustomer {
  fullName: string;
  phone: string;
  address: string;
}

export interface PrototypeOrderItem {
  code: string;
  slug: string;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
  subtotal: number;
  image: string;
  scentFamily: string;
}

export interface PrototypeOrder {
  id: string;
  createdAt: string;
  customer: CheckoutCustomer;
  items: PrototypeOrderItem[];
  totalItems: number;
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  receipt: ReceiptInfo | null;
  status: "Pending";
  prototypeNotice: string;
}

export const ORDERS_STORAGE_KEY = "scent-of-visayas-orders-v1";

export const createOrderId = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

  const timePart = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`.padStart(6, "0");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `SOV-${datePart}-${timePart}-${randomPart}`;
};

export const createOrderItems = (cartItems: CartItem[]): PrototypeOrderItem[] =>
  cartItems.map((item) => ({
    code: item.code,
    slug: item.slug,
    name: item.name,
    price: item.price,
    priceValue: item.priceValue,
    quantity: item.quantity,
    subtotal: item.priceValue * item.quantity,
    image: item.image,
    scentFamily: item.scentFamily,
  }));

export const getStoredOrders = (): PrototypeOrder[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);

    if (!storedOrders) {
      return [];
    }

    return JSON.parse(storedOrders) as PrototypeOrder[];
  } catch {
    return [];
  }
};

export const savePrototypeOrder = (order: PrototypeOrder) => {
  const existingOrders = getStoredOrders();

  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...existingOrders]));
};