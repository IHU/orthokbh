import { FaqBlockData } from "@ihu/umbraco-components";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../atoms/ui/accordion";

export default function FaqAccordion({ content }: { content: FaqBlockData }) {
  return (
    <section className="bg-secondary/75">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-10">
          <div className="space-y-4">
            {/* <h3 className="text-lg font-bold text-foreground border-l-4 border-primary pl-4">
                {section.category}
              </h3>*/}
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem
                value={`item-${content.question}`}
                className="bg-background border border-border rounded-lg px-4"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-4">
                  {content.question || "Question"}
                </AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed">
                  {content.answer && (
                    <div
                      className="richtext"
                      dangerouslySetInnerHTML={{
                        __html: content.answer.markup || "",
                      }}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
