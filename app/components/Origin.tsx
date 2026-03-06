export default function Origin() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight">
            Our Origin
          </h2>
          <div className="mt-4 h-1 w-20 bg-green-700 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Narrative Column */}
          <div className="space-y-6">
            <p className="text-xl text-stone-700 leading-relaxed font-medium">
              Haywood Mushrooms began as a scientific exploration into fungal
              cultivation and plant–microbe interactions, led by plant pathology
              researcher Dr. Anna Thomas.
            </p>
            
            <p className="text-lg text-stone-600 leading-relaxed">
              Early experiments conducted in <strong>Cary, North Carolina</strong> focused on sterile culture development, 
              strain selection, and understanding how fungal genetics translate into 
              reliable mushroom production.
            </p>

            <div className="p-6 bg-stone-50 border-l-4 border-green-700 rounded-r-xl">
              <p className="text-stone-700 italic">
                "Today, those laboratory foundations are expanding toward a dedicated 
                spawn and cultivation operation at our facility in Moncure, North Carolina".
              </p>
            </div>
          </div>

          {/* Location/Growth Visual Column */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white border border-stone-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-green-800 font-bold uppercase tracking-wider text-sm mb-2">Research Phase</h3>
              <p className="text-2xl font-semibold text-stone-900">Cary, NC</p>
              <p className="text-stone-500 mt-2">Home of our sterile culture development and primary laboratory research operations.</p>
            </div>

            <div className="bg-green-50 border border-green-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase">Expanding</span>
              </div>
              <h3 className="text-green-800 font-bold uppercase tracking-wider text-sm mb-2">Cultivation Phase</h3>
              <p className="text-2xl font-semibold text-stone-900">Moncure, NC</p>
              <p className="text-stone-600 mt-2">Expansion facility dedicated to high-volume spawn production and gourmet cultivation.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}