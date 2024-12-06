export class PhoneVerificationService {
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^(05)[0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  static async verifyPhone(_phone?: string, _operator?: string): Promise<void> {
    // Replace this
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}
