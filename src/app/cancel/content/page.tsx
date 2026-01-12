import React from "react";
import Link from "next/link";
import {
  Phone,
  Globe,
  Clock,
  ChevronRight,
  X,
  AlertCircle,
  CalendarX,
} from "lucide-react";

const AfbudPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* --- BREADCRUMBS & HERO HEADER --- */}
      <header className="bg-emerald-600 pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-emerald-100 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Hjem
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/praktisk"
              className="hover:text-white transition-colors"
            >
              Praktisk info
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">Afbud og ændring</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-[1.1]">
              Afbud og ændring af aftale
            </h1>
            <p className="text-emerald-50 text-lg leading-relaxed opacity-90">
              Det er vigtigt for os i klinikken, at du giver besked i god tid,
              hvis du bliver forhindret. Det giver os mulighed for at tilbyde
              tiden til en anden patient, som har brug for en hurtig udredning.
            </p>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT SECTION --- */}
      <main className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-12 border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Section */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1579684388669-c153308940c0?q=80&w=2070&auto=format&fit=crop"
                alt="Ortopædkirurgisk undersøgelse"
                className="w-full h-full object-cover min-h-[300px]"
              />
            </div>

            {/* Policy Text Section */}
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-full">
                Politik
              </div>
              <h2 className="text-3xl font-bold text-slate-800">
                Klinikkens afbudspolitik
              </h2>

              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  For at vi kan tilbyde den bedste service og korte ventetider,
                  skal ændringer eller afbud ske senest{" "}
                  <strong>24 timer før aftalens start</strong>.
                </p>
                <div className="p-4 bg-slate-50 border-l-4 border-emerald-500 rounded-r-xl italic">
                  "Ved rettidig afmelding kan vi hjælpe en anden patient på
                  ventelisten, der har brug for en specialistvurdering."
                </div>
                <p>
                  Afbud kan ske digitalt via Lægevejen eller telefonisk i vores
                  åbningstid. Uden for åbningstid kan du lægge en besked med
                  CPR-nummer på telefonsvareren.
                </p>
              </div>
            </div>
          </div>

          <hr className="my-16 border-slate-100" />

          {/* --- LOWER INFO SECTION --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Contact Methods */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-800">
                Udeblivelsesgebyr
              </h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Telefonisk kontakt</p>
                    <p className="text-slate-500 text-sm italic">
                      Oplys navn, CPR og dato for din tid.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <Link
                    href="https://laegevejen.dk"
                    target="_blank"
                    className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                  >
                    <Globe className="w-5 h-5" />
                    lægevejen.dk
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Online (Hele døgnet)</p>
                    <p className="text-slate-500 text-sm italic">
                      Log på med MitID og flyt din tid.
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Table */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-700 font-medium">
                    Konsultation (udeblivelse)
                  </span>
                  <span className="font-bold text-emerald-700">275,- kr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">
                    Operation (udeblivelse)
                  </span>
                  <span className="font-bold text-emerald-700">550,- kr</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-4 leading-snug italic">
                  Bemærk: Gebyrer er fastsat jf. overenskomsten med
                  Speciallægehjælpen.
                </p>
              </div>
            </div>

            {/* Right: Disclaimer and Rights */}
            <div className="space-y-6 pt-4">
              <div className="flex gap-4 items-start">
                <AlertCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <p className="text-slate-600 leading-relaxed">
                  Ved afbud senere end 24 timer, ser vi os nødsaget til at
                  opkræve et gebyr, da vi har reserveret både personale og
                  lokaler til din undersøgelse.
                </p>
              </div>
              <h4 className="font-bold text-slate-800 mt-8">
                Udeblivelsesgebyr i det offentlige
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Gebyret dækker de faste omkostninger ved den planlagte
                undersøgelse. Vi håber på jeres forståelse, så vi sammen kan
                holde ventetiderne så korte som muligt.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* --- FLOATING NOTIFICATION WIDGET (Som i billedet) --- */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {/* Contact Bubble */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 pointer-events-auto flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">35 35 XX XX</span>
            <div className="h-6 w-px bg-slate-200" />
            <Link
              href="https://laegevejen.dk"
              className="text-emerald-600 font-bold hover:underline"
            >
              Lægevejen.dk
            </Link>
          </div>
        </div>

        {/* Floating Action Button */}
        <button className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center pointer-events-auto hover:bg-emerald-700 transition-all hover:scale-110">
          <CalendarX className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default AfbudPage;
