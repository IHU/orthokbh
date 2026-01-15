import React from "react";
import Link from "next/link";
import {
  User,
  Calendar,
  Stethoscope,
  ArrowUpRight,
  FileText,
  ShieldCheck,
  HeartPulse,
  ChevronRight,
} from "lucide-react";

const PraktiskInfoGrid = () => {
  // Her kan du nemt tilføje 4, 5 eller 6+ sider
  const subPages = [
    {
      title: "Din første konsultation",
      description:
        "Alt om forsikringstyper, registrering og din personlige behandlingsplan.",
      icon: <Stethoscope className="w-5 h-5" />,
      href: "/praktisk-info/konsultation",
      tag: "Forberedelse",
    },
    {
      title: "Afbud og ændring",
      description:
        "Regler for afbud og hvordan du nemt flytter din tid senest 24 timer før.",
      icon: <Calendar className="w-5 h-5" />,
      href: "/praktisk-info/afbud-og-aendring",
      tag: "Administration",
    },
    {
      title: "Speciallæge Samir Ejam",
      description:
        "Mød kirurgen bag klinikken og læs om vores faglige ekspertise.",
      icon: <User className="w-5 h-5" />,
      href: "/praktisk-info/speciallaege-samir-ejam",
      tag: "Om os",
    },
    {
      title: "Priser & Forsikring",
      description:
        "Oversigt over takster for selvbetalere og samarbejde med forsikringsselskaber.",
      icon: <ShieldCheck className="w-5 h-5" />,
      href: "/praktisk-info/priser",
      tag: "Økonomi",
    },
    {
      title: "Genoptræning",
      description:
        "Øvelser og vejledning til tiden efter din operation eller behandling.",
      icon: <HeartPulse className="w-5 h-5" />,
      href: "/praktisk-info/genoptraening",
      tag: "Efterforløb",
    },
    {
      title: "Patientrettigheder",
      description:
        "Information om klageadgang, aktindsigt og behandling af dine data.",
      icon: <FileText className="w-5 h-5" />,
      href: "/praktisk-info/rettigheder",
      tag: "Juridisk",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Kompakt Hero for at give plads til grid */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 italic">
            Praktisk Info
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl">
            Find svar på alt vedrørende dit forløb i klinikken herunder.
          </p>
        </div>
      </section>

      {/* Dynamisk Grid: Tilpasser sig automatisk 4+ kort */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subPages.map((page, i) => (
            <Link key={i} href={page.href} className="group">
              <div className="bg-card p-6 rounded-3xl shadow-sm border border-border h-full flex flex-col hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {page.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-secondary px-2 py-1 rounded text-muted-foreground group-hover:text-primary">
                    {page.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {page.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                  {page.description}
                </p>
                <div className="pt-4 border-t border-border flex items-center text-sm font-bold text-primary group-hover:gap-2 transition-all">
                  Læs mere <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PraktiskInfoGrid;
