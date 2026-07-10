import ContactForm from "../components/ContactForm";

export const metadata = {
  title: "Contact | Haywood Mushrooms",
  description:
    "Get in touch with Haywood Mushrooms about spawn pre-orders, research cultures, or bulk substrate inquiries.",
};

const faqs = [
  {
    q: "Are you shipping spawn yet?",
    a: "We're scaling production in Moncure and taking pre-orders now. Send an inquiry and we'll tell you exactly what's available and when.",
  },
  {
    q: "What forms do cultures come in?",
    a: "Depending on the line and your needs: agar cultures, liquid culture, and colonized grain spawn ready to inoculate substrate.",
  },
  {
    q: "Do you serve research labs?",
    a: "Yes. We provide well-characterized, traceable cultures for mycology research and experimentation — note this in your inquiry type.",
  },
  {
    q: "Which strains can I reserve?",
    before: "Any line on our ",
    linkHref: "/strains",
    linkLabel: "strains page",
    after: ". Tell us which fit your operation and we'll flag them as they come online.",
  },
  {
    q: "Do you offer growing support?",
    before: "Our ",
    linkHref: "/blog",
    linkLabel: "grow guides",
    after: " cover the fundamentals, and we're glad to answer specifics about our lines by email.",
  },
  {
    q: "Where are you located?",
    a: "Research and culture development in Cary, NC; spawn production and cultivation expanding in Moncure, NC.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <section id="form" className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] md:min-h-[calc(100vh-78px)]">
        <div className="flex flex-col justify-center bg-forest-deep px-6 py-16 text-cream md:px-12 md:py-24">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/55">
            Haywood Mushrooms / Contact
          </div>
          <h1 className="mt-5 text-[clamp(38px,4.4vw,60px)] tracking-[-0.025em] text-cream">
            Let&apos;s talk about what you&apos;re <em className="font-serif italic text-brass">growing</em>.
          </h1>
          <p className="mt-6 max-w-[30em] text-[17px] leading-[1.6] text-cream/70">
            Pre-orders and lab inquiries are open. Send a note about your operation and Dr. Thomas or the team will follow up with availability, timelines, and pricing.
          </p>

          <div className="mt-11 flex flex-col">
            <div className="flex gap-4 border-t border-white/10 py-5" style={{ alignItems: "baseline" }}>
              <span className="w-[130px] flex-none font-mono text-[11px] uppercase tracking-[0.14em] text-brass">Inquiries</span>
              <span className="min-w-0 break-words text-[16px] text-cream">info@haywoodmushrooms.com</span>
            </div>
            <div className="flex gap-4 border-t border-white/10 py-5" style={{ alignItems: "baseline" }}>
              <span className="w-[130px] flex-none font-mono text-[11px] uppercase tracking-[0.14em] text-brass">Research lab</span>
              <span className="min-w-0 break-words text-[16px] text-cream">
                Cary, North Carolina
                <span className="mt-[3px] block text-[13px] text-cream/55">Sterile culture development &amp; strain selection</span>
              </span>
            </div>
            <div className="flex gap-4 border-t border-white/10 py-5" style={{ alignItems: "baseline" }}>
              <span className="w-[130px] flex-none font-mono text-[11px] uppercase tracking-[0.14em] text-brass">Production</span>
              <span className="min-w-0 break-words text-[16px] text-cream">
                Moncure, North Carolina
                <span className="mt-[3px] block text-[13px] text-cream/55">Spawn production &amp; gourmet cultivation</span>
              </span>
            </div>
            <div className="flex gap-4 border-y border-white/10 py-5" style={{ alignItems: "baseline" }}>
              <span className="w-[130px] flex-none font-mono text-[11px] uppercase tracking-[0.14em] text-brass">Response</span>
              <span className="min-w-0 break-words text-[16px] text-cream">Typically within 1–2 business days</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-cream px-6 py-16 md:px-12 md:py-24">
          <ContactForm />
        </div>
      </section>

      <section className="border-t border-line bg-paper px-6 py-[76px] md:px-10 md:py-[100px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 max-w-[600px]">
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">Good to know</span>
            <h2 className="mt-4 text-[clamp(30px,3.4vw,42px)]">Questions we hear a lot.</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-16">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-t border-line py-7">
                <div className="font-serif text-[22px] text-ink">{faq.q}</div>
                <p className="mt-3 text-[15px] leading-[1.6] text-muted">
                  {"a" in faq ? (
                    faq.a
                  ) : (
                    <>
                      {faq.before}
                      <a href={faq.linkHref} className="text-forest hover:text-brass">
                        {faq.linkLabel}
                      </a>
                      {faq.after}
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
