"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden rounded-[2px] border border-forest px-[16px] py-[10px] text-[13.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper"
    >
      Print / save as PDF →
    </button>
  );
}
