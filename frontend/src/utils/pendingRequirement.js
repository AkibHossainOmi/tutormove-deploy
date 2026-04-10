const PENDING_REQUIREMENT_KEY = "pending_requirement_job_payload";

export const savePendingRequirement = (payload) => {
  if (!payload) {
    return;
  }

  localStorage.setItem(PENDING_REQUIREMENT_KEY, JSON.stringify(payload));
};

export const getPendingRequirement = () => {
  const raw = localStorage.getItem(PENDING_REQUIREMENT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(PENDING_REQUIREMENT_KEY);
    return null;
  }
};

export const clearPendingRequirement = () => {
  localStorage.removeItem(PENDING_REQUIREMENT_KEY);
};

export { PENDING_REQUIREMENT_KEY };
