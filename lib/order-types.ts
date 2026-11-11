export type OrderStatus = "pending" | "paid" | "failed";

export type FulfillmentStatus =
  | "order_confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  slug?: string;
  quantity: 1;
  // Admin's own product code (the "Product ID" field in the admin panel,
  // e.g. "KH 598"). Saved by the server when the order is created; admin-only.
  productCode?: string;
}

export interface CustomerDetails {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
}

export interface OrderPricing {
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
}

export interface OrderPayment {
  provider: "iyzico";
  status: "pending" | "paid" | "failed";
  iyzicoConversationId?: string;
  iyzicoToken?: string;
  paidAt?: string | null;
}

export interface OrderStatusHistoryItem {
  status: FulfillmentStatus;
  label: string;
  createdAt: unknown;
  note?: string;
}

export interface OrderDocument {
  orderNumber: string;
  status: OrderStatus;
  fulfillmentStatus?: FulfillmentStatus;
  statusHistory?: OrderStatusHistoryItem[];
  customer: CustomerDetails;
  items: OrderItem[];
  pricing: OrderPricing;
  payment: OrderPayment;
  createdAt: unknown;
  updatedAt: unknown;
}
