import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';

export const PaymentSchema = z.object({
  full_name: z
    .string()
    .min(3, { message: "اسم حامل البطاقة يجب أن يكون 3 أحرف على الأقل" })
    .max(50, { message: "اسم حامل البطاقة يجب أن يكون أقل من 50 حرفًا" }),
  card_number: z
    .string()
    .regex(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12})$/, {
      message: "رقم بطاقة غير صالح"
    }),
  expiration_date: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, {
      message: "تنسيق تاريخ الانتهاء غير صالح (MM/YY)"
    }),
  cvv: z
    .string()
    .regex(/^[0-9]{3}$/, { message: "رمز الأمان (CVV) يجب أن يكون 3 أرقام" })
});

type PaymentFormData = z.infer<typeof PaymentSchema>;

interface PaymentState {
  formData: PaymentFormData;
  isSubmitting: boolean;
  policyDetails: {
    insurance_type: string;
    company: string;
    start_date: string;
    endDate: string;
    referenceNumber: string;
  };
  summaryDetails: {
    subtotal: number;
    vat: number;
    total: number;
  };
}

const initialState: PaymentState = {
  formData: {
    full_name: '',
    card_number: '',
    expiration_date: '',
    cvv: '',
  },
  isSubmitting: false,
  policyDetails: {
    insurance_type: "ضد الغير",
    company: "الصقر للتأمين",
    start_date: "2024-11-30",
    endDate: "2025-11-28",
    referenceNumber: "1643877167",
  },
  summaryDetails: {
    subtotal: 373.41,
    vat: 0.15,
    total: 429.42,
  }
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    updateFormField: (state, action: PayloadAction<Partial<PaymentFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    updatePaymentDetails: (state, action: PayloadAction<{
      policyDetails: {
        insurance_type: string;
        company: string;
        start_date: string;
        endDate: string;
        referenceNumber: string;
      };
      summaryDetails: {
        subtotal: number;
        vat: number;
        total: number;
      };
    }>) => {
      state.policyDetails = action.payload.policyDetails;
      state.summaryDetails = action.payload.summaryDetails;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.isSubmitting = false;
    }
  }
});

export const { 
  updateFormField, 
  updatePaymentDetails, 
  setSubmitting, 
  resetForm 
} = paymentSlice.actions;

export default paymentSlice.reducer;
