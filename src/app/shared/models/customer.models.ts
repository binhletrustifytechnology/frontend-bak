import {CustomerId} from "@shared/models/id/customer-id";

export interface ShortCustomerInfo {
  customerId: CustomerId;
  title: string;
  public: boolean;
}
