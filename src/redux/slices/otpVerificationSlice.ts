import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OtpVerificationState {
  otp: string[];
  timer: number;
  error: string;
  phoneNumber: string;
}

const initialState: OtpVerificationState = {
  otp: ['', '', '', ''],
  timer: 180,
  error: '',
  phoneNumber: '', 
};

const otpVerificationSlice = createSlice({
  name: 'otpVerification',
  initialState,
  reducers: {
    setOtpDigit: (state, action: PayloadAction<{ index: number; value: string }>) => {
      state.otp[action.payload.index] = action.payload.value;
    },
    decrementTimer: (state) => {
      if (state.timer > 0) {
        state.timer -= 1;
      }
    },
    resetTimer: (state) => {
      state.timer = 180;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
  }
});

export const { setOtpDigit, decrementTimer, resetTimer, setError, clearError, setPhoneNumber } = otpVerificationSlice.actions;
export default otpVerificationSlice.reducer;
