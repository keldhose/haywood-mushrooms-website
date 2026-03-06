export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-stone-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Left Column: Information & Status */}
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Connect with Our Lab</h2>
            <p className="mt-6 text-stone-400 text-lg leading-relaxed">
              We are currently scaling our spawn production and laboratory operations in 
              <strong> Moncure, North Carolina</strong>. 
            </p>
            
            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-green-700 p-2 rounded-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002 -2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">General Inquiries</h4>
                  <p className="text-stone-400">info@haywoodmushrooms.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-green-700 p-2 rounded-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Operations</h4>
                  <p className="text-stone-400">Cary Research Lab | Moncure Production Facility</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl text-stone-900 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Inquiry Form</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Name</label>
                  <input type="text" className="w-full bg-stone-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-green-700 outline-none" placeholder="Eldhose K." />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Email</label>
                  <input type="email" className="w-full bg-stone-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-green-700 outline-none" placeholder="name@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Inquiry Type</label>
                <select className="w-full bg-stone-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-green-700 outline-none">
                  <option>Gourmet Spawn Pre-order</option>
                  <option>Research Cultures</option>
                  <option>Bulk Substrate Inquiries</option>
                  <option>General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Message</label>
                <textarea rows={4} className="w-full bg-stone-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-green-700 outline-none" placeholder="Tell us about your growing operation..."></textarea>
              </div>

              <button className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition duration-300 shadow-lg shadow-green-900/20">
                Submit Inquiry
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}