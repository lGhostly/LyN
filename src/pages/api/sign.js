import { isAdmin } from '../../lib/auth.js';
import { uploadSignature } from '../../lib/cloudinary.js';

export function POST({ cookies }) {
  if (!isAdmin(cookies)) return new Response('No autorizado', { status: 401 });
  return Response.json(uploadSignature());
}
