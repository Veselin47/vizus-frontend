export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderResult {
  orderId: number;
  checkoutUrl: string;
}
export interface AdminOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface AdminOrder {
  id: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  deliveryType: string;
  econtOfficeName: string | null;
  deliveryAddress: string | null;
  items: AdminOrderItem[];
}