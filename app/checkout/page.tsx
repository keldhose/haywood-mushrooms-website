import { getSessionUser } from "@/lib/auth/session";
import { getSavedAddress } from "@/lib/users";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const user = await getSessionUser();
  const savedAddress = user ? await getSavedAddress(user.uid) : null;

  return <CheckoutForm savedAddress={savedAddress} userEmail={user?.email ?? null} />;
}
