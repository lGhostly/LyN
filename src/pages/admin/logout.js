import { logout } from '../../lib/auth.js';

export function GET({ cookies, redirect }) {
  logout(cookies);
  return redirect('/');
}
