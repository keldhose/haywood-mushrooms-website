import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?next=/admin");
  }
  if (!user.isAdmin) {
    redirect("/account");
  }

  return (
    <div>
      <div className="print:hidden border-b border-line bg-forest-deep">
        <div className="mx-auto flex max-w-[1200px] items-center gap-7 px-6 py-4 md:px-10">
          <Link href="/admin" className="font-mono text-[12px] uppercase tracking-[0.14em] text-brass">
            Admin
          </Link>
          <Link href="/admin/products" className="font-mono text-[12px] uppercase tracking-[0.14em] text-cream/80 hover:text-cream">
            Products
          </Link>
          <Link href="/admin/orders" className="font-mono text-[12px] uppercase tracking-[0.14em] text-cream/80 hover:text-cream">
            Orders
          </Link>
          <Link href="/" className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-cream/50 hover:text-cream">
            ← Back to site
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
