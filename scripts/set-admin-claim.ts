/**
 * Grants (or revokes) the `admin` custom claim on a Firebase user, by email.
 * Run with: npm run admin:grant -- someone@example.com
 *           npm run admin:revoke -- someone@example.com
 *
 * The user must already have signed up normally (via /signup or /login)
 * before running this — it looks them up by email, it doesn't create them.
 * They'll need to log out and back in (or wait for their session cookie to
 * refresh) before the new claim takes effect.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

const email = process.argv[2];
const revoke = process.argv.includes("--revoke");

if (!email) {
  console.error("Usage: npm run admin:grant -- someone@example.com");
  process.exit(1);
}

async function main() {
  const { adminAuth } = await import("./firebase-admin");

  const user = await adminAuth.getUserByEmail(email);
  await adminAuth.setCustomUserClaims(user.uid, { admin: !revoke });

  console.log(`${revoke ? "Revoked" : "Granted"} admin for ${email} (uid: ${user.uid}).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
