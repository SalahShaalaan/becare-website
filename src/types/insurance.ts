export interface InsuranceFormData {
  purpose: 'new' | 'transfer';
  vehicleType: 'registration' | 'customs';
  fullName: string;
  nationalId?: string;
  buyerNationalId?: string;
  sellerNationalId?: string;
  phoneNumber?: string;
  vehicleSerialNumber?: string;
  vehicleManufactureNumber?: string;
  customsCardNumber?: string;
  agreeToTerms: boolean;
}

export type FormErrors = Partial<Record<keyof InsuranceFormData, string>>;
