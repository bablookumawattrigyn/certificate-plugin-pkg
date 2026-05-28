const API_BASE = 'https://dev2-learning.diksha.gov.in/certificate/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function uploadFormData(formData: FormData): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/media/upload`, { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

export const templateApi = {
  list: () => request<Record<string, unknown>[]>('/templates'),
  create: (data: Record<string, unknown>) =>
    request<Record<string, unknown>>('/templates', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  publish: (id: string) => request<Record<string, unknown>>(`/templates/${id}/publish`, { method: 'PATCH' }),
  delete: (id: string) => request<Record<string, unknown>>(`/templates/${id}`, { method: 'DELETE' }),
  clone: (id: string) => request<Record<string, unknown>>(`/templates/${id}/clone`, { method: 'POST' }),
};

export const certificateApi = {
  list: () => request<Record<string, unknown>[]>('/certificates'),
};

export const mediaApi = {
  upload: (file: File, templateId: string | null, assetType: string, assetKey: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('asset_type', assetType);
    formData.append('asset_key', assetKey);
    if (templateId && templateId !== 'undefined') {
      formData.append('template_id', templateId);
    }
    formData.append('uploaded_by', '00000000-0000-0000-0000-000000000001');
    return uploadFormData(formData);
  },
};
