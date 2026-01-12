import React from "react";
import Image from "next/image";
import { BadgeCheck, Clock, MapPin, Award } from "lucide-react";

const OmSamir = () => {
  const highlights = [
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      text: "Speciallæge siden 2008",
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "Ekspert i hånd- & fodkirurgi",
    },
    { icon: <Clock className="w-5 h-5" />, text: "Korte ventetider" },
    {
      icon: <MapPin className="w-5 h-5" />,
      text: "Centralt på Rosenørns Allé",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Venstre side: Billede/Visuelt */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-emerald-50 relative z-10 shadow-2xl">
              {/* Erstat src med det rigtige billede af Samir */}
              <div className="absolute inset-0 flex items-center justify-center text-emerald-200">
                <p className="font-medium">Portræt af Samir Ejam</p>
              </div>
              {/* <Image 
                src="/images/samir-ejam.jpg" 
                alt="Speciallæge Samir Ejam" 
                fill 
                className="object-cover"
              /> */}
            </div>
            {/* Dekorativt element bag billedet */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-emerald-100 rounded-full -z-0 opacity-50" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-50 rounded-full -z-0" />
          </div>

          {/* Højre side: Tekstindhold */}
          <div className="space-y-6">
            <div>
              <h2 className="text-emerald-700 font-bold tracking-wider uppercase text-sm mb-2">
                Mød din kirurg
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Speciallæge Samir Ejam
              </h3>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed italic">
              &quot;Det vigtigste for mig er, at du føler dig tryg og hørt fra
              det øjeblik, du træder ind i klinikken, til du er fuldt
              restitueret.&quot;
            </p>

            <div className="space-y-4 text-slate-600">
              <p>
                Samir Ejam blev uddannet speciallæge i ortopædkirurgi i 2008 og
                har siden opbygget en omfattende ekspertise inden for særligt
                hånd-, fod- og idrætskirurgi. I 2015 overtog han klinikken ved
                Søerne med en vision om at skabe et sted, hvor høj faglighed går
                hånd i hånd med personlig opfølgning.
              </p>
              <p>
                Klinikken er i dag <strong>DDKM-akkrediteret</strong>, hvilket
                er din sikkerhed for, at vi lever op til de strengeste nationale
                krav om kvalitet og patientsikkerhed. Her udføres alle
                operationer i lokalbedøvelse, hvilket betyder et skånsomt forløb
                og hurtig returnering til hverdagen.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 py-6">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 text-slate-700"
                >
                  <div className="text-emerald-600">{item.icon}</div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="inline-flex flex-col p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-emerald-900 font-bold">
                  Ortopædkirurgisk Klinik ved Søerne
                </span>
                <span className="text-emerald-700 text-sm">
                  Rosenørns Allé 4, 1634 København V
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OmSamir;
