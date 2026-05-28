import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import type { CertificateTemplate, IssuedCertificate, User } from '../types';
import { templateApi, certificateApi } from '../services/api';
import { mapCertificateFromDB, mapTemplateFromDB } from '../services/mappers';
import { newOfflineTemplateId } from '../utils/templateHelpers';

interface AppState {
  user: User;
  templates: CertificateTemplate[];
  certificates: IssuedCertificate[];
  backendConnected: boolean;
  templatesLoading: boolean;
  certificatesLoading: boolean;
  templatesLoaded: boolean;
  certificatesLoaded: boolean;
}

type AppAction =
  | { type: 'SET_TEMPLATES'; payload: CertificateTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: CertificateTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: CertificateTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'PUBLISH_TEMPLATE'; payload: string }
  | { type: 'SET_CERTIFICATES'; payload: IssuedCertificate[] }
  | { type: 'SET_BACKEND_CONNECTED'; payload: boolean }
  | { type: 'SET_TEMPLATES_LOADING'; payload: boolean }
  | { type: 'SET_CERTIFICATES_LOADING'; payload: boolean }
  | { type: 'SET_TEMPLATES_LOADED'; payload: boolean }
  | { type: 'SET_CERTIFICATES_LOADED'; payload: boolean };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.templateId === action.payload.templateId ? action.payload : t,
        ),
      };
    case 'DELETE_TEMPLATE':
      return { ...state, templates: state.templates.filter((t) => t.templateId !== action.payload) };
    case 'PUBLISH_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.templateId === action.payload
            ? { ...t, status: 'published' as const, updatedAt: new Date().toISOString() }
            : t,
        ),
      };
    case 'SET_CERTIFICATES':
      return { ...state, certificates: action.payload };
    case 'SET_BACKEND_CONNECTED':
      return { ...state, backendConnected: action.payload };
    case 'SET_TEMPLATES_LOADING':
      return { ...state, templatesLoading: action.payload };
    case 'SET_CERTIFICATES_LOADING':
      return { ...state, certificatesLoading: action.payload };
    case 'SET_TEMPLATES_LOADED':
      return { ...state, templatesLoaded: action.payload };
    case 'SET_CERTIFICATES_LOADED':
      return { ...state, certificatesLoaded: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  loadTemplates: () => Promise<void>;
  loadCertificates: () => Promise<void>;
  actions: {
    createTemplate: (data: Record<string, unknown>) => Promise<CertificateTemplate>;
    updateTemplate: (id: string, data: Record<string, unknown>) => Promise<CertificateTemplate>;
    publishTemplate: (id: string) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
    cloneTemplate: (id: string) => Promise<void>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUser: User = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Dr. Priya Sharma',
  role: 'course_creator',
  tenantId: 'tenant-ncert',
  tenantName: 'NCERT',
};

const initialState: AppState = {
  user: defaultUser,
  templates: [],
  certificates: [],
  backendConnected: false,
  templatesLoading: false,
  certificatesLoading: false,
  templatesLoaded: false,
  certificatesLoaded: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const loadTemplates = useCallback(async () => {
    const { templatesLoaded, templatesLoading } = stateRef.current;
    if (templatesLoaded || templatesLoading) return;

    dispatch({ type: 'SET_TEMPLATES_LOADING', payload: true });
    try {
      const rows = await templateApi.list();
      dispatch({ type: 'SET_TEMPLATES', payload: rows.map(mapTemplateFromDB) });
      dispatch({ type: 'SET_BACKEND_CONNECTED', payload: true });
    } catch (err) {
      console.warn('Templates API unavailable:', (err as Error).message);
      dispatch({ type: 'SET_BACKEND_CONNECTED', payload: false });
    } finally {
      dispatch({ type: 'SET_TEMPLATES_LOADING', payload: false });
      dispatch({ type: 'SET_TEMPLATES_LOADED', payload: true });
    }
  }, []);

  const loadCertificates = useCallback(async () => {
    const { certificatesLoaded, certificatesLoading } = stateRef.current;
    if (certificatesLoaded || certificatesLoading) return;

    dispatch({ type: 'SET_CERTIFICATES_LOADING', payload: true });
    try {
      const rows = await certificateApi.list();
      dispatch({ type: 'SET_CERTIFICATES', payload: rows.map(mapCertificateFromDB) });
      dispatch({ type: 'SET_BACKEND_CONNECTED', payload: true });
    } catch (err) {
      console.warn('Certificates API unavailable:', (err as Error).message);
      dispatch({ type: 'SET_BACKEND_CONNECTED', payload: false });
    } finally {
      dispatch({ type: 'SET_CERTIFICATES_LOADING', payload: false });
      dispatch({ type: 'SET_CERTIFICATES_LOADED', payload: true });
    }
  }, []);

  const actions = useMemo(
    () => ({
      createTemplate: async (data: Record<string, unknown>): Promise<CertificateTemplate> => {
        if (!stateRef.current.backendConnected) {
          const template = {
            ...data,
            templateId: newOfflineTemplateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as CertificateTemplate;
          dispatch({ type: 'ADD_TEMPLATE', payload: template });
          return template;
        }
        const result = await templateApi.create(data);
        const mapped = mapTemplateFromDB(result);
        dispatch({ type: 'ADD_TEMPLATE', payload: mapped });
        return mapped;
      },

      updateTemplate: async (id: string, data: Record<string, unknown>): Promise<CertificateTemplate> => {
        if (!stateRef.current.backendConnected) {
          const template = { ...data, templateId: id, updatedAt: new Date().toISOString() } as CertificateTemplate;
          dispatch({ type: 'UPDATE_TEMPLATE', payload: template });
          return template;
        }
        const result = await templateApi.update(id, data);
        const mapped = mapTemplateFromDB(result);
        dispatch({ type: 'UPDATE_TEMPLATE', payload: mapped });
        return mapped;
      },

      publishTemplate: async (id: string) => {
        if (!stateRef.current.backendConnected) {
          dispatch({ type: 'PUBLISH_TEMPLATE', payload: id });
          return;
        }
        await templateApi.publish(id);
        dispatch({ type: 'PUBLISH_TEMPLATE', payload: id });
      },

      deleteTemplate: async (id: string) => {
        if (!stateRef.current.backendConnected) {
          dispatch({ type: 'DELETE_TEMPLATE', payload: id });
          return;
        }
        await templateApi.delete(id);
        dispatch({ type: 'DELETE_TEMPLATE', payload: id });
      },

      cloneTemplate: async (id: string) => {
        if (!stateRef.current.backendConnected) {
          const source = stateRef.current.templates.find((t) => t.templateId === id);
          if (source) {
            dispatch({
              type: 'ADD_TEMPLATE',
              payload: {
                ...source,
                templateId: newOfflineTemplateId(),
                name: `${source.name} (Copy)`,
                status: 'draft',
                version: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            });
          }
          return;
        }
        const result = await templateApi.clone(id);
        dispatch({ type: 'ADD_TEMPLATE', payload: mapTemplateFromDB(result) });
      },
    }),
    [],
  );

  const value = useMemo(
    () => ({ state, loadTemplates, loadCertificates, actions }),
    [state, loadTemplates, loadCertificates, actions],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
