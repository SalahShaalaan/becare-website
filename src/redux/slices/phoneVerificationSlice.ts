import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PhoneVerificationState {
  phone: string;
  operator: string;
  errors: {
    phone: string;
    operator: string;
  };
}

const initialState: PhoneVerificationState = {
  phone: '',
  operator: '',
  errors: {
    phone: '',
    operator: ''
  }
};

const phoneVerificationSlice = createSlice({
  name: 'phoneVerification',
  initialState,
  reducers: {
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setOperator: (state, action: PayloadAction<string>) => {
      state.operator = action.payload;
    },
    setErrors: (state, action: PayloadAction<{phone?: string; operator?: string}>) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    resetErrors: (state) => {
      state.errors = initialState.errors;
    }
  }
});

export const { setPhone, setOperator, setErrors, resetErrors } = phoneVerificationSlice.actions;
export default phoneVerificationSlice.reducer;
