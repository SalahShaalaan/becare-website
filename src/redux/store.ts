import { configureStore } from '@reduxjs/toolkit';
import phoneVerificationReducer from './slices/phoneVerificationSlice';
import cardVerificationReducer from './slices/cardVerificationSlice';
import insuranceDetailsReducer from './slices/insuranceDetailsSlice';
import otpVerificationReducer from './slices/otpVerificationSlice';
import paymentReducer from './slices/paymentSlice';
import cardOwnershipReducer from './slices/cardOwnershipSlice';

export const store = configureStore({
  reducer: {
    phoneVerification: phoneVerificationReducer,
    cardVerification: cardVerificationReducer,
    insuranceDetails: insuranceDetailsReducer,
    otpVerification: otpVerificationReducer,
    payment: paymentReducer,
    cardOwnership: cardOwnershipReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
