import React from "react";
import { Clock, Phone, AlertTriangle, CheckCircle, Mail } from "lucide-react";

const AfbudPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Afbud & Ændring
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Her finder du information om, hvordan du ændrer din tid, og hvilke
          regler der gælder for afbud hos Ortopædkirurgisk Klinik ved Søerne.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Deadline Card */}
        <div className="bg-red-50 border-2 border-red-100 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-900 mb-1 italic">
              Husk 24-timers reglen
            </h2>
            <p className="text-red-800">
              Afbud skal ske senest 24 timer før din aftale. Ved for sent afbud
              eller udeblivelse opkræves et gebyr på 275 kr. for konsultation og
              550 kr. for operation.
            </p>
          </div>
        </div>

        {/* Methods */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 border border-slate-200 rounded-3xl hover:border-emerald-500 transition-colors">
            <Phone className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Ring til os</h3>
            <p className="text-slate-600 text-sm mb-4">
              Ring på 35 35 XX XX. Svarer vi ikke, så læg en besked med CPR-nr
              og navn.
            </p>
            <a href="tel:+4535350000" className="text-emerald-700 font-bold">
              Ring nu →
            </a>
          </div>

          <div className="p-8 border border-slate-200 rounded-3xl hover:border-emerald-500 transition-colors">
            <CheckCircle className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Lægevejen.dk</h3>
            <p className="text-slate-600 text-sm mb-4">
              Log ind med MitID og flyt eller aflys din tid direkte i vores
              system.
            </p>
            <a
              href="https://laegevejen.dk"
              className="text-emerald-700 font-bold"
            >
              Gå til Lægevejen →
            </a>
          </div>
        </div>

        {/* FAQ/Info Footer */}
        <div className="bg-slate-50 p-8 rounded-3xl text-sm text-slate-500 space-y-4 leading-relaxed">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-1" />
            <p>
              Gebyret for udeblivelse er fastsat af Overenskomsten med
              Regionerne og faktureres direkte til patienten (ikke
              sygesikringen).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfbudPage;
