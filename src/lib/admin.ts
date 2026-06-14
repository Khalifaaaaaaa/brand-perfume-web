export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin";
export const ADMIN_SESSION_STORAGE_KEY = "scent-of-visayas-admin-session-v1";

export const isAdminSessionActive = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === "true";
};

export const startAdminSession = () => {
  window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, "true");
};

export const endAdminSession = () => {
  window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
};

export const validateAdminCredentials = (username: string, password: string) => {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
};