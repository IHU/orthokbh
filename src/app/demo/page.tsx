import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/atoms/ui/card";
import { Info, CreditCard, UserCheck, ArrowRight } from "lucide-react";

const KonsultationInfo = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-emerald-700 font-bold tracking-widest uppercase text-sm mb-3">
              Henvisning & Priser
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Hvordan kommer jeg i gang med min behandling?
            </h3>
          </div>
          <Link
            href="/konsultation"
            className="flex items-center text-emerald-700 font-semibold hover:text-emerald-800 transition-colors group"
          >
            Læs alt om din første konsultation
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sygesikringsgruppe 1 */}
          <Card className="border-2 border-emerald-100 shadow-none hover:border-emerald-500 transition-colors">
            <CardContent className="pt-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-700">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">
                Gruppe 1 Patient
              </h4>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Behandles vederlagsfrit via den offentlige sygesikring. Du skal
                have en henvisning fra din praktiserende læge.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-start italic text-slate-500">
                  <span className="text-emerald-500 mr-2">•</span>
                  Vigtigt: Henvisningen skal ligge klar i
                  &quot;Henvisningshotellet&quot; før tidsbestilling.
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  Frit valg: Du kan bruge din henvisning hos os, uanset hvilken
                  kirurg din læge har noteret.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Sygesikringsgruppe 2 */}
          <Card className="border border-slate-200 shadow-none bg-slate-50">
            <CardContent className="pt-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-700">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">
                Gruppe 2 Patient
              </h4>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Du kan henvende dig direkte uden henvisning. Der er en mindre
                egenbetaling til konsultationen.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Ofte dækket: Medlemmer af &quot;danmark&quot; får det meste af
                  egenbetalingen refunderet.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Hurtig adgang: Ingen ventetid på lægehenvisning.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Privatpatienter */}
          <Card className="border border-slate-200 shadow-none bg-slate-50">
            <CardContent className="pt-8">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-6 text-slate-700">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">
                Privatpatient
              </h4>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                For patienter uden for den offentlige sygesikring eller ved
                ønske om fuld privat behandling.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-2">•</span>
                  Fuldt honorar betales af patienten selv.
                </li>
                <li className="flex items-start font-semibold">
                  <span className="text-slate-400 mr-2">•</span>
                  Husk altid det gule sygesikringskort ved ankomst.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <div className="mt-10 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start space-x-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Bemærk:</strong> Henvisnings-ordningen har været
            obligatorisk siden 2009. Vi kan <u>ikke</u> tildele en tid til
            Gruppe 1 patienter, før din læge har uploadet henvisningen digitalt.
          </p>
        </div>
      </div>
    </section>
  );
};

export default KonsultationInfo;
