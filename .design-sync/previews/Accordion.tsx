import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "daab-client";

export function FAQ() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-96"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>What is your refund policy?</AccordionTrigger>
        <AccordionContent>
          We offer a full refund within 30 days of purchase, no questions asked.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Do you offer technical support?</AccordionTrigger>
        <AccordionContent>
          Yes — every plan includes email support, and Team plans add priority
          chat.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I change plans later?</AccordionTrigger>
        <AccordionContent>
          You can upgrade or downgrade at any time from your billing settings.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
