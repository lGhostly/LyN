import crypto from 'node:crypto';

const pw = () => process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || '';
const token = () => crypto.createHmac('sha256', pw()).update('bazar-admin').digest('hex');

export function login(cookies, input) {
  if (pw() && input === pw()) {
    cookies.set('admin', token(), { path: '/', httpOnly: true, secure: import.meta.env.PROD, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
    return true;
  }
  return false;
}
export const logout = (cookies) => cookies.delete('admin', { path: '/' });
export const isAdmin = (cookies) => !!pw() && cookies.get('admin')?.value === token();
