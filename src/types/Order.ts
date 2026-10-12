export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderResult {
  orderId: number;
  checkoutUrl: string;
}