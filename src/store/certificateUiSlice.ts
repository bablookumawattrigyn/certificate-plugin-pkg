import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** UI-only state; domain data stays in AppContext. */
export interface CertificateUiState {
  templatesListSearch: string;
}

const initialState: CertificateUiState = {
  templatesListSearch: '',
};

const certificateUiSlice = createSlice({
  name: 'certificateUi',
  initialState,
  reducers: {
    setTemplatesListSearch(state, action: PayloadAction<string>) {
      state.templatesListSearch = action.payload;
    },
  },
});

export const { setTemplatesListSearch } = certificateUiSlice.actions;
export const certificateUiReducer = certificateUiSlice.reducer;
