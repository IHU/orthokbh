import React from "react";
import Link from "next/link";
import {
  User,
  Calendar,
  Stethoscope,
  ArrowUpRight,
  Phone,
  Clock,
  MapPin,
  ChevronRight,
  Info,
} from "lucide-react";

const PraktiskInfoModern = () => {
  const categories = [
    {
      title: "Din første konsultation",
      subtitle: "Forberedelse & Forløb",
      description:
        "Bliv klar til dit møde med speciallægen. Vi guider dig gennem forsikringstyper, registrering og din personlige behandlingsplan.",
      icon: <Stethoscope className="w-6 h-6" />,
      href: "/praktisk-info/konsultation",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Afbud og ændring",
      subtitle: "Fleksibilitet & Regler",
      description:
        "Har dine planer ændret sig? Se hvordan du nemt flytter eller aflyser din tid senest 24 timer før din planlagte aftale.",
      icon: <Calendar className="w-6 h-6" />,
      href: "/praktisk-info/afbud-og-aendring",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Speciallæge Samir Ejam",
      subtitle: "Ekspertise & Tryghed",
      description:
        "Lær mere om erfaringen bag klinikken. Specialiseret kirurgi i lokalbedøvelse med fokus på hænder, fødder og knæ.",
      icon: <User className="w-6 h-6" />,
      href: "/praktisk-info/speciallaege-samir-ejam",
      color: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-20 font-sans">
      {/* --- MODERN HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-primary">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <nav className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-10">
            <Link
              href="/"
              className="hover:text-primary-foreground transition-colors"
            >
              Hjem
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary-foreground">Praktisk Info</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-8 tracking-tight">
              Alt det praktiske <br />
              <span className="text-primary-foreground/80 italic font-light tracking-normal">
                før dit besøg
              </span>
            </h1>
            <p className="text-primary-foreground/80 text-xl leading-relaxed max-w-2xl">
              Vi har gjort det enkelt for dig at finde svar på dine spørgsmål,
              så du kan føle dig tryg og velforberedt til din behandling hos os.
            </p>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE CARDS --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href} className="group">
              <div className="bg-card p-8 rounded-[2.5rem] shadow-lg border border-border h-full flex flex-col transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div
                  className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110`}
                >
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-3 block">
                  {cat.subtitle}
                </span>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                  {cat.description}
                </p>
                <div className="flex items-center gap-2 font-bold text-foreground group-hover:gap-4 transition-all">
                  Gå til siden <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- QUICK HELP & CONTACT SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left: Quick Tips */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6 italic">
                Hurtig hjælp til dagen
              </h2>
              <p className="text-muted-foreground text-lg italic">
                Vi ved, at små detaljer gør en stor forskel for din oplevelse.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  q: "Husk dit sundhedskort",
                  a: "Dit gule kort er din identifikation og adgang til din henvisning i 'Henvisningshotellet'.",
                },
                {
                  q: "Ingen faste nødvendig",
                  a: "Da vi opererer i lokalbedøvelse, behøver du ikke faste før din tid i klinikken.",
                },
                {
                  q: "Parkering & Ankomst",
                  a: "Vi ligger centralt ved Søerne. Kom gerne 5-10 minutter før din aftalte tid til registrering.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-1">
                      {item.q}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Glass Card */}
          <div className="lg:col-span-5">
            <div className="bg-primary rounded-[3rem] p-10 md:p-14 text-primary-foreground relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/20 blur-[80px]" />

              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Info className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">Har du spørgsmål?</h3>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-5">
                    <Phone className="w-6 h-6 text-primary-foreground shrink-0" />
                    <div>
                      <p className="text-primary-foreground/50 text-xs uppercase font-bold tracking-widest mb-1">
                        Telefon
                      </p>
                      <p className="text-xl font-medium">43 96 02 55</p>
                      <p className="text-sm text-primary-foreground/40 mt-1">
                        Man-Tor: 08:00 - 16:00
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <MapPin className="w-6 h-6 text-primary-foreground shrink-0" />
                    <div>
                      <p className="text-primary-foreground/50 text-xs uppercase font-bold tracking-widest mb-1">
                        Adresse
                      </p>
                      <p className="text-xl font-medium text-balance">
                        Rosenørns Allé 4, st. tv <br /> 1634 København V
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/kontakt"
                  className="w-full py-5 bg-primary-foreground hover:bg-primary-foreground/90 text-primary font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Gå til kontakt
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PraktiskInfoModern;
