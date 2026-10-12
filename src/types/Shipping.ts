export interface EcontCity {
  id: number;
  name: string;
  postCode: string;
}

export interface EcontOffice {
  code: string;
  name: string;
  address: string;
}

export type DeliveryType = 'Pickup' | 'EcontOffice' | 'EcontAddress';

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  deliveryType: DeliveryType;
  econtOfficeCode: string | null;
  econtOfficeName: string | null;
  deliveryAddress: string | null;
}