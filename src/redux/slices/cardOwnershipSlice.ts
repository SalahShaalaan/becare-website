import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CardOwnershipState {
  otp: string[];
  timer: number;
  error: string;
  amount: number;
  cardLastDigits: string;
  cardPin: string
}

const initialState: CardOwnershipState = {
  otp: ['', '', '', ''],
  timer: 180,
  error: '',
  amount: 429.42,
  cardLastDigits: '8452',
  cardPin: '',
};

const cardOwnershipSlice = createSlice({
  name: 'cardOwnership',
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
    setCardPin: (state, action: PayloadAction<string>) => {
      state.cardPin = action.payload;
    }
  }
});

export const { setOtpDigit, decrementTimer, resetTimer, setError, clearError, setCardPin  } = cardOwnershipSlice.actions;
export default cardOwnershipSlice.reducer;
