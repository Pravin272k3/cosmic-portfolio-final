import Cookies from 'js-cookie';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'sharma272k3@gmail.com';
const ADMIN_PASSWORD = '27april2003';

// Authentication functions
export const authenticate = (email: string, password: string): boolean => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Set auth cookie with expiration of 1 day
    Cookies.set('admin_authenticated', 'true', { expires: 1 });
    return true;
  }
  return false;
};

export const isAuthenticated = (): boolean => {
  return Cookies.get('admin_authenticated') === 'true';
};

export const logout = (): void => {
  Cookies.remove('admin_authenticated');
};
