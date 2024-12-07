import { PaymentFormData } from "../types/payment";

export class PaymentService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async processPayment(_data?: PaymentFormData): Promise<void> {
    // Replace This
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }
}
