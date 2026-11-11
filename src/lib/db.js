import { MongoClient } from 'mongodb';
import { destroyImage } from './cloudinary.js';

const uri = process.env.MONGODB_URI || import.meta.env.MONGODB_URI;

// La conexión se reutiliza entre ejecuciones (importante en serverless).
async function col() {
  if (!uri) throw new Error('Falta la variable MONGODB_URI');
  if (!globalThis._mongo) {
    globalThis._mongo = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect().catch((e) => {
      globalThis._mongo = null;
      throw e;
    });
  }
  return (await globalThis._mongo).db('bazar').collection('products');
}

const noId = { projection: { _id: 0 } };
export const all = async () => (await col()).find({}, noId).sort({ created: -1 }).toArray();
export const get = async (id) => (await col()).findOne({ id }, noId);
export const save = async (p) => (await col()).replaceOne({ id: p.id }, p, { upsert: true });

export async function remove(id) {
  const c = await col();
  const p = await c.findOne({ id });
  if (!p) return;
  await Promise.all(p.images.map((i) => destroyImage(i.publicId)));
  await c.deleteOne({ id });
}
