import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CardVerificationState {
  pin: string;
  error: string;
}

const initialState: CardVerificationState = {
  pin: '',
  error: ''
};

const cardVerificationSlice = createSlice({
  name: 'cardVerification',
  initialState,
  reducers: {
    setPin: (state, action: PayloadAction<string>) => {
      state.pin = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = '';
    }
  }
});

export const { setPin, setError, resetError } = cardVerificationSlice.actions;
export default cardVerificationSlice.reducer;
