/**
 * Utilidades para mostrar/limpiar mensajes de validación en el DOM.
 * El span/elemento de error debe existir con id `${fieldId}-error`.
 */
export function setFieldError(fieldId: string, message: string) {
  try {
    const el = document.getElementById(`${fieldId}-error`);
    if (el) {
      // usar textContent para evitar inyección HTML
      el.textContent = message || "";
    }
  } catch (err) {
    // silencioso: evitar romper la validación si no hay DOM (e.g., tests)
    // console.warn(`setFieldError failed for ${fieldId}`, err);
  }
}

export function clearFieldError(fieldId: string) {
  try {
    const el = document.getElementById(`${fieldId}-error`);
    if (el) el.textContent = "";
  } catch (err) {
    // noop
  }
}

export function clearErrorsForFields(fieldIds: string[]) {
  fieldIds.forEach((fid) => clearFieldError(fid));
}
