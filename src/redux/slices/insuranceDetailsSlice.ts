import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InsuranceDetailsState {
  insuranceType: 'against-others' | 'special' | 'comprehensive';
  startDate: string;
  vehicleUse: string;
  estimatedValue: string;
  manufacturingYear: string;
  repairLocation: 'workshop' | 'agency';
  agreeToTerms: boolean;
  selectedCompany: string;
}

const initialState: InsuranceDetailsState = {
  insuranceType: 'against-others',
  startDate: '',
  vehicleUse: '',
  estimatedValue: '',
  manufacturingYear: '',
  repairLocation: 'workshop',
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
