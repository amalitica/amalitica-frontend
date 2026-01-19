/**
 * Utilidades para manejo de errores de API y validación.
 */

/**
 * Formatea errores de validación de Pydantic a un mensaje legible.
 * 
 * @param {Object} error - Error de Axios
 * @returns {string} - Mensaje de error formateado
 */
export function formatValidationError(error) {
  // Si no hay respuesta del servidor
  if (!error.response) {
    return 'Error de conexión. Por favor, verifica tu conexión a internet.';
  }

  const { data, status } = error.response;

  // Error 422: Errores de validación de Pydantic
  if (status === 422 && data?.detail) {
    // Si detail es un array de errores de validación
    if (Array.isArray(data.detail)) {
      const errors = data.detail.map((err) => {
        // Extraer el campo del error (loc es un array como ["body", "field_name"])
        const field = err.loc ? err.loc.slice(1).join('.') : 'campo desconocido';
        const message = err.msg || 'Error de validación';
        
        // Traducir mensajes comunes
        const translatedMessage = translateValidationMessage(message);
        
        return `${capitalizeFirst(field)}: ${translatedMessage}`;
      });

      return errors.join('\n');
    }

    // Si detail es un string simple
    if (typeof data.detail === 'string') {
      return data.detail;
    }

    // Si detail es un objeto con estructura de error de Pydantic
    if (data.detail.msg) {
      return translateValidationMessage(data.detail.msg);
    }
  }

  // Error 400: Bad Request
  if (status === 400 && data?.detail) {
    return typeof data.detail === 'string' 
      ? data.detail 
      : 'Solicitud inválida';
  }

  // Error 401: No autorizado
  if (status === 401) {
    return 'No autorizado. Por favor, inicia sesión nuevamente.';
  }

  // Error 403: Prohibido
  if (status === 403) {
    return 'No tienes permisos para realizar esta acción.';
  }

  // Error 404: No encontrado
  if (status === 404) {
    return 'Recurso no encontrado.';
  }

  // Error 500: Error del servidor
  if (status >= 500) {
    return 'Error del servidor. Por favor, intenta nuevamente más tarde.';
  }

  // Error genérico
  return data?.detail || data?.message || 'Error al procesar la solicitud';
}

/**
 * Traduce mensajes de validación comunes de Pydantic al español.
 * 
 * @param {string} message - Mensaje en inglés
 * @returns {string} - Mensaje traducido
 */
function translateValidationMessage(message) {
  const translations = {
    'Field required': 'Campo requerido',
    'field required': 'Campo requerido',
    'String should have at least': 'Debe tener al menos',
    'string should have at least': 'Debe tener al menos',
    'String should have at most': 'Debe tener como máximo',
    'string should have at most': 'Debe tener como máximo',
    'Value error': 'Error de valor',
    'value error': 'Error de valor',
    'Input should be a valid': 'Debe ser un',
    'input should be a valid': 'Debe ser un',
    'Invalid email': 'Email inválido',
    'invalid email': 'Email inválido',
    'characters': 'caracteres',
  };

  let translated = message;
  
  for (const [english, spanish] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(english, 'gi'), spanish);
  }

  return translated;
}

/**
 * Capitaliza la primera letra de un string.
 * 
 * @param {string} str - String a capitalizar
 * @returns {string} - String capitalizado
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extrae mensajes de error de un objeto de error de Axios.
 * Útil para mostrar errores en formularios con react-hook-form.
 * 
 * @param {Object} error - Error de Axios
 * @returns {Object} - Objeto con campos y sus mensajes de error
 */
export function extractFieldErrors(error) {
  if (!error.response || error.response.status !== 422) {
    return {};
  }

  const { detail } = error.response.data;
  
  if (!Array.isArray(detail)) {
    return {};
  }

  const fieldErrors = {};
  
  detail.forEach((err) => {
    if (err.loc && err.loc.length > 1) {
      const field = err.loc.slice(1).join('.');
      fieldErrors[field] = translateValidationMessage(err.msg);
    }
  });

  return fieldErrors;
}
