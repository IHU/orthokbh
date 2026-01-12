import {
  CalendarX,
  Clock,
  Phone,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CalendarPlus,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";

const CancellationBlock = () => {
  return (
    <>
      <section className="py-12 bg-white border border-slate-100 rounded-3xl my-12 mx-4 max-w-7xl lg:mx-auto shadow-sm">
        <div className="px-6 md:px-12 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-red-50 p-4 rounded-2xl text-red-600">
            <CalendarX className="w-10 h-10" />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-2 italic">
              Blevet forhindret?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Husk at melde afbud senest 24 timer før din aftale, så en anden
              patient kan få glæde af tiden. Afbud kan ske telefonisk eller via
              Lægevejen.
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <Link
              href="/afbud"
              className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              Læs afbudspolitik
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+4535350000"
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-center hover:bg-slate-800 transition-all"
            >
              Ring afbud nu
            </a>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto border border-emerald-100 rounded-[3rem] p-8 md:p-20 text-center relative bg-gradient-to-b from-emerald-50/50 to-white">
          {/* Subtil Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles className="w-4 h-4" />
            Din vej til bedring
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight italic">
            Få din bevægelighed <br /> tilbage
          </h2>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Du behøver ikke leve med smerterne. Speciallæge Samir Ejam står klar
            til at hjælpe dig med en personlig behandlingsplan og hurtig adgang
            til operation i lokalbedøvelse.
          </p>

          <div className="flex flex-col items-center gap-6">
            <Link
              href="https://laegevejen.dk"
              className="group relative inline-flex items-center justify-center px-12 py-5 bg-emerald-600 text-white font-bold text-lg rounded-full overflow-hidden transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-95"
            >
              <CalendarPlus className="w-5 h-5 mr-3" />
              Book din konsultation nu
            </Link>

            <div className="flex items-center gap-4 text-slate-400">
              <div className="h-px w-8 bg-slate-200" />
              <span className="text-sm font-medium italic">
                Eller ring direkte
              </span>
              <div className="h-px w-8 bg-slate-200" />
            </div>

            <a
              href="tel:+4535350000"
              className="flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-900 transition-colors py-2"
            >
              <PhoneCall className="w-5 h-5" />
              35 35 XX XX
            </a>
          </div>

          {/* Diskret tillidserklæring */}
          <p className="mt-12 text-xs text-slate-400 font-medium uppercase tracking-[0.2em]">
            DDKM-akkrediteret speciallægeklinik · København V
          </p>
        </div>
      </section>
    </>
  );
};
export default CancellationBlock;
