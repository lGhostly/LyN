import { defineMiddleware } from 'astro:middleware';

// Protección CSRF: los POST solo se aceptan si el Origin coincide con el Host del sitio.
export const onRequest = defineMiddleware((context, next) => {
  const { request } = context;
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return next();
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  let ok = false;
  try { ok = !!origin && new URL(origin).host === host; } catch {}
  if (!ok) return new Response('Origen no permitido', { status: 403 });
  return next();
});
