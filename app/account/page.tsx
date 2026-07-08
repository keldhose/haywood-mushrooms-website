import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import LogoutButton from "../components/auth/LogoutButton";

export const metadata = {
  title: "Your Account | Haywood Mushrooms",
};

export default async function AccountPage() {
  const user = await getSessionUser();

  return (
    <main className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-[640px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Haywood Mushrooms / Account
        </div>
        <h1 className="mt-4 font-serif text-[36px] text-ink">Your account</h1>

        <div className="mt-8 rounded-[4px] border border-line bg-paper p-8">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Signed in as</div>
          <div className="mt-1.5 text-[17px] text-ink">{user?.email}</div>
        </div>

        <div className="mt-4">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-[9px] rounded-[2px] border border-forest px-[22px] py-[13px] text-[14.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper"
          >
            View your orders <span className="font-mono">→</span>
          </Link>
        </div>

        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
