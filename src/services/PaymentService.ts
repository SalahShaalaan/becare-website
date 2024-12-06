import { PaymentFormData } from "../types/payment";

export class PaymentService {
  static async processPayment(_data?: PaymentFormData): Promise<void> {
    // Replace This
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }
}
