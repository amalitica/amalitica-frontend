/**
 * Hook para manejar roles de usuario y permisos de acceso.
 */

import { useAuth } from '../context/AuthContext';

// Roles permitidos para acceso administrativo
const ADMIN_ROLES = ['SuperAdmin', 'Admin', 'Manager'];

/**
 * Hook que proporciona utilidades para verificar roles de usuario.
 */
export const useAuthRole = () => {
  const { user } = useAuth();

  // Debug - eliminar en producción
  console.log('User from auth:', user);
  console.log('User role:', user?.role);

  /**
   * Verifica si el usuario tiene un rol específico.
   * @param {string} role - Rol a verificar
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Verifica si el usuario tiene alguno de los roles proporcionados.
   * @param {string[]} roles - Array de roles a verificar
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  /**
   * Verifica si el usuario es administrador (SuperAdmin, Admin o Manager).
   * @returns {boolean}
   */
  const isAdmin = () => {
    const role = user?.role;
    const isAdminRole = ADMIN_ROLES.includes(role);
    console.log('Checking isAdmin:', { role, isAdminRole, ADMIN_ROLES });
    return isAdminRole;
  };

  /**
   * Verifica si el usuario es SuperAdmin.
   * @returns {boolean}
   */
  const isSuperAdmin = () => {
    return user?.role === 'SuperAdmin';
  };

  /**
   * Verifica si el usuario es Manager.
   * @returns {boolean}
   */
  const isManager = () => {
    return user?.role === 'Manager';
  };

  /**
   * Verifica si el usuario es empleado regular (no admin).
   * @returns {boolean}
   */
  const isEmployee = () => {
    return !isAdmin();
  };

  return {
    user,
    role: user?.role,
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
    isManager,
    isEmployee,
    ADMIN_ROLES,
  };
};

export default useAuthRole;
