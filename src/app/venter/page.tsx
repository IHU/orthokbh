import { Clock, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const WaitingListSection = () => {
  return (
    <section className="py-16 bg-emerald-50/50 border-y border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4">
            <Clock className="w-5 h-5" />
            <span>Aktuelle Ventetider</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Kom hurtigt til undersøgelse og behandling
          </h2>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">
            Vi ved, at smerter i bevægeapparatet kræver hurtig handling. Vi
            prioriterer korte ventetider på både konsultation og mindre
            operationer i lokalbedøvelse.
          </p>
          <Link
            href="/ventetider"
            className="inline-flex items-center text-emerald-700 font-bold hover:gap-3 transition-all"
          >
            Se aktuelle ventetider og læs om tidsbestilling
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
            <p className="text-sm text-slate-500 mb-1">Konsultation</p>
            <p className="text-2xl font-bold text-emerald-700 underline decoration-emerald-200">
              1-2 uger
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
            <p className="text-sm text-slate-500 mb-1">Operation</p>
            <p className="text-2xl font-bold text-emerald-700 underline decoration-emerald-200">
              2-4 uger
            </p>
          </div>
          <div className="col-span-2 bg-emerald-900 text-white p-6 rounded-2xl flex items-center gap-4">
            <Calendar className="w-10 h-10 text-emerald-400" />
            <div>
              <p className="text-xs uppercase opacity-80 font-bold">
                Udvidet frit sygehusvalg
              </p>
              <p className="text-sm font-medium">
                Vi hjælper dig med at bruge dine rettigheder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default WaitingListSection;
