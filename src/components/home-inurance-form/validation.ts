import { FormErrors, InsuranceFormData } from "../../types/insurance";

export const validateInsuranceForm = (data: InsuranceFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.fullName?.trim() || data.fullName.length < 3) {
    errors.fullName = 'الاسم يجب أن يكون أكثر من 3 حروف';
  }

  if (data.purpose === 'new') {
    if (!data.nationalId || !/^\d{10}$/.test(data.nationalId)) {
      errors.nationalId = 'رقم الهوية يجب أن يكون 10 أرقام';
    }
  } else {
    if (!data.buyerNationalId || !/^\d{10}$/.test(data.buyerNationalId)) {
      errors.buyerNationalId = 'رقم هوية المشتري يجب أن يكون 10 أرقام';
    }
    if (!data.sellerNationalId || !/^\d{10}$/.test(data.sellerNationalId)) {
      errors.sellerNationalId = 'رقم هوية البائع يجب أن يكون 10 أرقام';
    }
  }

  if (data.vehicleType === 'registration') {
    // if (!data.phoneNumber || !/^05\d{8}$/.test(data.phoneNumber)) {
    //   errors.phoneNumber = 'رقم الهاتف يجب أن يبدأ بـ 05 ويكون 10 أرقام';
    // }
    if (!data.vehicleSerialNumber?.trim()) {
      errors.vehicleSerialNumber = 'الرقم التسلسلي للمركبة مطلوب';
    }
  } else if (data.vehicleType === 'customs' && data.purpose !== 'transfer') {
    if (!data.vehicleManufactureNumber?.trim()) {
      errors.vehicleManufactureNumber = 'رقم صنع المركبة مطلوب';
    }
    if (!data.customsCardNumber?.trim()) {
      errors.customsCardNumber = 'رقم البطاقة الجمركية مطلوب';
    }
  }

  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام';
  }

  return errors;
};
