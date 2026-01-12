import React from "react";
import Link from "next/link";
import {
  FileText,
  UserCheck,
  CreditCard,
  CheckCircle2,
  Info,
  Search,
  Stethoscope,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";

const KonsultationPage = () => {
  const steps = [
    {
      title: "Ankomst & Registrering",
      description:
        "Scan dit gule sundhedskort ved terminalen. Dette bekræfter din ankomst i systemet.",
      icon: <UserCheck className="w-6 h-6" />,
    },
    {
      title: "Samtale med Samir Ejam",
      description:
        "Vi gennemgår din sygehistorie, dine symptomer og hvordan de påvirker din hverdag.",
      icon: <Stethoscope className="w-6 h-6" />,
    },
    {
      title: "Klinisk Undersøgelse",
      description:
        "En grundig fysisk test af leddet (hånd, fod eller knæ) for at stille en præcis diagnose.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      title: "Behandlingsplan",
      description:
        "Vi lægger en plan sammen. Det kan være alt fra operation i lokalbedøvelse til videre skanning.",
      icon: <ClipboardList className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 bg-emerald-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight italic">
              Din første konsultation
            </h1>
            <p className="text-xl text-emerald-100 leading-relaxed mb-8">
              Vi tager os tid til at lytte. Hos Ortopædkirurgisk Klinik ved
              Søerne er målet en grundig udredning og en plan, der hurtigt får
              dig tilbage til din hverdag.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-50 transition-colors"
              >
                Book tid nu
              </Link>
            </div>
          </div>
        </div>
        {/* Dekorativ cirkel */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-emerald-800/30 rounded-full blur-3xl" />
      </section>

      {/* --- DE 3 VEJE (GRUPPER) --- */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-emerald-700 font-bold uppercase tracking-widest text-sm mb-4">
            Patientgrupper
          </h2>
          <h3 className="text-3xl font-bold text-slate-900">
            Hvordan er du forsikret?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Gruppe 1 */}
          <div className="relative p-8 rounded-3xl border border-emerald-100 bg-emerald-50/30 flex flex-col h-full">
            <div className="bg-emerald-600 text-white text-xs font-bold uppercase py-1 px-3 rounded-full w-fit mb-6">
              Mest brugt
            </div>
            <h4 className="text-2xl font-bold mb-4">Gruppe 1</h4>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Vederlagsfri</strong> behandling med henvisning.
                </span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Du har <strong>frit valg</strong> af specialist (uanset hvad
                  lægen har skrevet).
                </span>
              </li>
            </ul>
            <div className="text-sm p-4 bg-white rounded-xl border border-emerald-100 italic text-slate-500">
              Kræver elektronisk henvisning i &quot;Henvisningshotellet&quot;.
            </div>
          </div>

          {/* Gruppe 2 */}
          <div className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col h-full">
            <div className="bg-slate-100 text-slate-600 text-xs font-bold uppercase py-1 px-3 rounded-full w-fit mb-6">
              Uden henvisning
            </div>
            <h4 className="text-2xl font-bold mb-4">Gruppe 2</h4>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Henvend dig direkte uden om din praktiserende læge.</span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Mindre egenbetaling – ofte dækket af{" "}
                  <strong>Sygeforsikringen &quot;danmark&quot;</strong>.
                </span>
              </li>
            </ul>
          </div>

          {/* Privatpatient */}
          <div className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col h-full">
            <div className="bg-slate-100 text-slate-600 text-xs font-bold uppercase py-1 px-3 rounded-full w-fit mb-6">
              Hurtig adgang
            </div>
            <h4 className="text-2xl font-bold mb-4">Privat / Forsikring</h4>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>For dig uden for den offentlige sygesikring.</span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Vi samarbejder med de fleste private sundhedsforsikringer.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- PATIENTREJSEN (STEPPER) --- */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Din rejse gennem klinikken
          </h2>
          <p className="text-slate-600">
            Vi har strømlinet vores processer, så du føler dig tryg fra start
            til slut.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Lodret linje til tidslinje (kun desktop) */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-emerald-100" />

            <div className="space-y-12">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col md:flex-row gap-8 items-start"
                >
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                    {step.icon}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed max-w-xl">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- HENVISNINGSHOTELLET INFO BOX --- */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="bg-emerald-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-emerald-800 p-4 rounded-2xl">
              <Info className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Forstå &quot;Henvisningshotellet&quot;
              </h2>
              <div className="space-y-4 text-emerald-100 text-sm md:text-base leading-relaxed">
                <p>
                  Siden 2009 har det været lovpligtigt for praktiserende læger
                  at sende henvisninger digitalt. Vi kan <strong>ikke</strong>{" "}
                  tildele en tid, før din læge har &quot;lagt&quot; henvisningen op.
                </p>
                <p>
                  Tjek evt. din henvisning på <strong>Sundhed.dk</strong> eller
                  i appen <strong>Min Læge</strong>, før du kontakter os for
                  tidsbestilling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-20 text-center px-4">
        <h2 className="text-3xl font-bold mb-8">
          Klar til at bestille din tid?
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="/kontakt"
            className="px-10 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
          >
            Book tid nu
          </Link>
          <a
            href="tel:+4535350000"
            className="px-10 py-4 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all"
          >
            Ring til os: 35 35 XX XX
          </a>
        </div>
      </section>
    </div>
  );
};

export default KonsultationPage;
