import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InsuranceDetailsState {
  insurance_type: string
  start_date: string;
  vehicle_use_purpose: string;
  estimated_worth: string;
  year: string;
  repair_place: string
  agreeToTerms: boolean;
  selectedCompany: string;
}

const initialState: InsuranceDetailsState = {
  insurance_type: '',
  start_date: '',
  vehicle_use_purpose: '',
  estimated_worth: '',
  year: '',
  repair_place: '',
  agreeToTerms: false,
  selectedCompany: '',

};

const insuranceDetailsSlice = createSlice({
  name: 'insuranceDetails',
  initialState,
  
  reducers: {
    updateField: (state, action: PayloadAction<Partial<InsuranceDetailsState>>) => {
      return { ...state, ...action.payload };
    },
    resetDetails: () => initialState,
  },
});

export const { updateField, resetDetails } = insuranceDetailsSlice.actions;
export default insuranceDetailsSlice.reducer;
