import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

export function useTemplate(templateId: string | undefined) {
  const { state } = useAppContext();
  return useMemo(
    () => (templateId ? state.templates.find((t) => t.templateId === templateId) : undefined),
    [state.templates, templateId],
  );
}

/** Template lookup with route-aware loading / not-found flags. */
export function useTemplateState(templateId: string | undefined) {
  const { state } = useAppContext();
  const template = useTemplate(templateId);

  return {
    template,
    pending: Boolean(templateId) && state.templatesLoading,
    missing: Boolean(templateId) && state.templatesLoaded && !template,
  };
}
