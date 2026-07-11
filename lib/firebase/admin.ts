import "server-only";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin SDK is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });
}

export const adminAuth = getAuth(getAdminApp());
export const adminDb = getFirestore(getAdminApp());
// Order/product writes routinely build objects with optional fields left as
// `undefined` (e.g. preorderEstimate, variantId on a non-variant product) —
// without this, Firestore throws on the whole write instead of just omitting them.
// Wrapped because Next bundles this module separately per route; settings()
// throws if it's already been called once on the underlying Firestore client.
try {
  adminDb.settings({ ignoreUndefinedProperties: true });
} catch {
  // Already configured by another bundle instance in this process — fine.
}
export const adminStorage = getStorage(getAdminApp());
