import { FormData } from "@/types/cv";

const STORAGE_KEY = "cvexpress_form_data";

export const saveFormData = (data: Partial<FormData>) => {
  const existing = loadFormData();
  const merged = { ...existing, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
};

export const loadFormData = (): Partial<FormData> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const clearFormData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
