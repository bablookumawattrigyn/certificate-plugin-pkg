import { configureStore } from '@reduxjs/toolkit';
import { certificateUiReducer } from './certificateUiSlice';

export const certificateStore = configureStore({
  reducer: {
    certificateUi: certificateUiReducer,
  },
});

export type CertificateRootState = ReturnType<typeof certificateStore.getState>;
export type CertificateAppDispatch = typeof certificateStore.dispatch;
