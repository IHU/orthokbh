import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/ui/accordion";
import { HelpCircle } from "lucide-react";

const BehandlingsFAQ = () => {
  const faqData = [
    {
      category: "Hænder & Fingre",
      questions: [
        {
          q: "Hvornår kan jeg bruge min hånd igen efter en operation for springfinger?",
          a: "Du kan bruge hånden til lette dagligdagsting med det samme. Stingene fjernes typisk efter 10-14 dage, hvorefter du gradvist kan belaste hånden mere normalt.",
        },
        {
          q: "Gør operationen for karpaltunnelsyndrom ondt?",
          a: "Indgrebet foregår i lokalbedøvelse, så selve operationen er smertefri. Der kan være lidt ømhed i dagene efter, som let kan klares med almindelig håndkøbsmedicin.",
        },
      ],
    },
    {
      category: "Fodkirurgi",
      questions: [
        {
          q: "Skal jeg have gips på efter en operation for hammertå eller knyst?",
          a: "Nej, som regel skal du blot have en stabil forbinding og en specialsko på i en kortere periode. Du må ofte støtte på foden umiddelbart efter indgrebet.",
        },
        {
          q: "Hvor længe skal jeg være sygemeldt efter fodkirurgi?",
          a: "Det afhænger af dit erhverv. Ved stillesiddende arbejde er det ofte 1-2 uger, mens fysisk krævende arbejde kan kræve 4-6 uger.",
        },
      ],
    },
    {
      category: "Knæ & Idræt",
      questions: [
        {
          q: "Hvordan foregår en kikkertundersøgelse af knæet?",
          a: "Gennem to små huller føres et tyndt kamera ind i knæet. Samir Ejam kan her se og ofte reparere skader på menisken eller fjerne løse legemer med det samme.",
        },
        {
          q: "Hvor hurtigt kan jeg genoptage sport?",
          a: "Det varierer, men mange kan begynde let genoptræning efter 2 uger og vende tilbage til fuld sport efter 6-8 uger, afhængig af indgrebets omfang.",
        },
      ],
    },
    {
      category: "Hud & Praktisk",
      questions: [
        {
          q: "Kan jeg køre bil hjem efter en operation i lokalbedøvelse?",
          a: "Ved mindre indgreb i huden eller hånden kan du ofte godt, men ved fodoperationer anbefaler vi altid, at du får en pårørende til at køre dig eller tager en taxa.",
        },
        {
          q: "Hvad koster behandlingen, hvis jeg har en henvisning?",
          a: "Hvis du er i Sygesikring Gruppe 1 og har en henvisning fra din egen læge, er behandlingen gratis for dig, da den dækkes af den offentlige sygesikring.",
        },
      ],
    },
  ];

  return (
    <section className="py-20 px-4 bg-emerald-50/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-4 text-emerald-700">
          <HelpCircle className="w-5 h-5" />
          <span className="font-bold uppercase tracking-wider text-sm">
            FAQ
          </span>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Ofte stillede spørgsmål
        </h2>

        <div className="space-y-10">
          {faqData.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-lg font-bold text-emerald-900 border-l-4 border-emerald-500 pl-4">
                {section.category}
              </h3>

              <Accordion type="single" collapsible className="w-full space-y-2">
                {section.questions.map((item, qIdx) => (
                  <AccordionItem
                    key={qIdx}
                    value={`item-${idx}-${qIdx}`}
                    className="bg-white border border-slate-200 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left font-medium text-slate-800 hover:text-emerald-700 hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pb-4 leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            Fandt du ikke svar på dit spørgsmål? <br className="md:hidden" />
            Ring til os på{" "}
            <a
              href="tel:+4535350000"
              className="text-emerald-700 font-bold underline"
            >
              35 35 XX XX
            </a>{" "}
            for personlig rådgivning.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BehandlingsFAQ;
