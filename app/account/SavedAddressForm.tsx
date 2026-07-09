"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
// Type-only: importing anything runtime from "@/lib/orders" here would pull
// the server-only firebase-admin module graph into the client bundle.
import type { ShippingAddress } from "@/lib/orders";

export default function SavedAddressForm({ initial }: { initial: ShippingAddress | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(!initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [street1, setStreet1] = useState(initial?.street1 ?? "");
  const [street2, setStreet2] = useState(initial?.street2 ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [state, setState] = useState(initial?.state ?? "");
  const [zip, setZip] = useState(initial?.zip ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/account/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, street1, street2, city, state, zip }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not save address.");
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    if (!confirm("Remove your saved address?")) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/account/address", { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Could not remove address.");
      }
      setName("");
      setStreet1("");
      setStreet2("");
      setCity("");
      setState("");
      setZip("");
      setEditing(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!editing && initial) {
    return (
      <div className="rounded-[4px] border border-line bg-paper p-8">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Saved shipping address</div>
        <p className="mt-2.5 text-[15px] leading-[1.6] text-ink">
          {initial.name}
          <br />
          {initial.street1}
          {initial.street2 ? `, ${initial.street2}` : ""}
          <br />
          {initial.city}, {initial.state} {initial.zip}
        </p>
        <div className="mt-4 flex gap-5">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-mono text-[12px] uppercase tracking-[0.1em] text-forest hover:text-brass"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={saving}
            className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted hover:text-red-700 disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="rounded-[4px] border border-line bg-paper p-8">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Saved shipping address</div>
      <p className="mt-1.5 text-[13px] text-muted">Pre-fills checkout next time — still editable per order.</p>

      <div className="mt-5">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Full name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-[2px] border border-line bg-cream p-[12px] text-[15px] outline-none focus:border-forest"
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Street address</label>
        <input
          type="text"
          required
          value={street1}
          onChange={(e) => setStreet1(e.target.value)}
          className="w-full rounded-[2px] border border-line bg-cream p-[12px] text-[15px] outline-none focus:border-forest"
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
          Apt / suite <span className="normal-case text-muted/70">(optional)</span>
        </label>
        <input
          type="text"
          value={street2}
          onChange={(e) => setStreet2(e.target.value)}
          className="w-full rounded-[2px] border border-line bg-cream p-[12px] text-[15px] outline-none focus:border-forest"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">City</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-[2px] border border-line bg-cream p-[12px] text-[15px] outline-none focus:border-forest"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">State</label>
          <input
            type="text"
            required
            maxLength={2}
            placeholder="NC"
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase())}
            className="w-full rounded-[2px] border border-line bg-cream p-[12px] text-[15px] uppercase outline-none focus:border-forest"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">ZIP</label>
          <input
            type="text"
            required
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full rounded-[2px] border border-line bg-cream p-[12px] text-[15px] outline-none focus:border-forest"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-[13px] font-medium text-red-700">{error}</p>}

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-[2px] bg-brass px-[22px] py-[12px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save address"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={saving}
            className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted hover:text-ink disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
