/**
 * Lists every Firebase Auth user that currently has the `admin` custom
 * claim. Run with: npm run admin:list
 */
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { adminAuth } = await import("./firebase-admin");

  const admins: string[] = [];
  let pageToken: string | undefined;

  do {
    const result = await adminAuth.listUsers(1000, pageToken);
    for (const user of result.users) {
      if (user.customClaims?.admin === true) {
        admins.push(user.email ?? user.uid);
      }
    }
    pageToken = result.pageToken;
  } while (pageToken);

  if (admins.length === 0) {
    console.log("No admins found.");
  } else {
    console.log(`Admins (${admins.length}):`);
    admins.forEach((a) => console.log(`  - ${a}`));
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
