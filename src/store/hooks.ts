import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { CertificateAppDispatch, CertificateRootState } from './index';

export const useCertificateDispatch: () => CertificateAppDispatch = useDispatch;
export const useCertificateSelector: TypedUseSelectorHook<CertificateRootState> = useSelector;
