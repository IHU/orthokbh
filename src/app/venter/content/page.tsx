import React from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  AlertCircle,
  Phone,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/ui/card";

const VentetiderPage = () => {
  const ventetidData = [
    { label: "Første konsultation", tid: "1-2 uger", status: "Kort" },
    { label: "Operation (Hånd/Fod)", tid: "2-4 uger", status: "Normal" },
    { label: "Kikkertundersøgelse", tid: "3-4 uger", status: "Normal" },
    { label: "Akut vurdering", tid: "< 48 timer", status: "Hurtig" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="bg-[#f0f9f6] py-20 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 italic">
              Ventetider & Tidsbestilling
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Vi ved, at ventetid kan føles lang, når man har smerter. Hos
              Ortopædkirurgisk Klinik ved Søerne arbejder vi målrettet på at
              holde ventelisterne korte, så du hurtigt kan få din mobilitet
              tilbage.
            </p>
          </div>
        </div>
      </section>

      {/* --- AKTUELLE VENTETIDER DASHBOARD --- */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Venstre: Status Oversigt */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ventetidData.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-emerald-800">
                      {item.tid}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                        item.status === "Kort" || item.status === "Hurtig"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-900 font-medium mb-1 italic">
                  Vigtig information om ventetider
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Ventetiderne er vejledende og opdateres månedligt. Den præcise
                  ventetid afhænger af indgrebets karakter og din
                  forsikringstype. Vi anbefaler altid at ringe for den mest
                  aktuelle status.
                </p>
              </div>
            </div>
          </div>

          {/* Højre: Quick Booking Box */}
          <Card className="border-emerald-200 shadow-xl shadow-emerald-50 overflow-hidden">
            <CardHeader className="bg-emerald-900 text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Bestil tid her
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-1">
                    1
                  </div>
                  <p className="text-sm text-slate-600">
                    Få en elektronisk henvisning fra din egen læge.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-1">
                    2
                  </div>
                  <p className="text-sm text-slate-600">
                    Ring til os på <strong>35 35 XX XX</strong> eller brug
                    Lægevejen.
                  </p>
                </div>
              </div>

              <Link
                href="https://www.laegevejen.dk"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
              >
                Lægevejen.dk <ExternalLink className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- RETTIGHEDER SECTION (Det Udvidede Frie Sygehusvalg) --- */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Dine rettigheder som patient
            </h2>
            <p className="text-slate-600">
              Vidste du, at du ofte kan komme hurtigere til behandling via det
              frie sygehusvalg?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mb-4" />
              <h4 className="text-xl font-bold mb-3">Behandlingsgaranti</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Hvis det offentlige sygehus ikke kan tilbyde behandling inden
                for 30 dage, har du ret til at blive omvisiteret til en privat
                klinik som vores.
              </p>
              <Link
                href="/kontakt"
                className="text-emerald-700 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Hjælp til omvisitering <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <Zap className="w-10 h-10 text-emerald-600 mb-4" />
              <h4 className="text-xl font-bold mb-3">Afbudsliste</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Hvis du er fleksibel, kan du blive skrevet på vores afbudsliste.
                Vi kontakter dig, hvis vi får ledige tider med kort varsel (ofte
                samme uge).
              </p>
              <p className="text-emerald-700 text-sm font-bold">
                Ring 35 35 XX XX for opskrivning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- INFO FOOTER --- */}
      <section className="py-16 px-4 text-center max-w-2xl mx-auto">
        <p className="text-slate-500 text-sm italic">
          Klinikken er DDKM-akkrediteret, hvilket sikrer dig den højeste
          kvalitet og sikkerhed i hele dit forløb – uanset om du venter 1 uge
          eller 4.
        </p>
      </section>
    </div>
  );
};

export default VentetiderPage;
