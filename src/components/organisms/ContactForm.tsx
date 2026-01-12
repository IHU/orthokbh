"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { Textarea } from "@/components/atoms/ui/textarea";
import { Button } from "@/components/atoms/ui/button";
import { ContactFormBlockData } from "@ihu/umbraco-components";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";
import { useAnalyticsBlock } from "@/components/analytics/analytics-block";

export default function ContactForm({
  content,
}: {
  content: ContactFormBlockData;
}) {
  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      message: "",
    },
  });
  const { trackFormStart, trackFormSubmit, trackFormView } =
    useAnalyticsEvents();
  const blockContext = useAnalyticsBlock();
  const [hasStarted, setHasStarted] = useState(false);

  const formId = useMemo(() => {
    if (content?.title) {
      return content.title.toLowerCase().replace(/\s+/g, "-");
    }
    return "contact-form";
  }, [content?.title]);

  const formName = content?.title ?? undefined;

  useEffect(() => {
    trackFormView({
      formId,
      formName,
      metadata: blockContext?.blockId
        ? { block_id: blockContext.blockId }
        : undefined,
    });
  }, [blockContext?.blockId, formId, formName, trackFormView]);

  useEffect(() => {
    if (hasStarted) {
      return;
    }

    const subscription = form.watch(() => {
      setHasStarted(true);
      trackFormStart({
        formId,
        formName,
        metadata: blockContext?.blockId
          ? { block_id: blockContext.blockId }
          : undefined,
      });
    });

    return () => subscription.unsubscribe();
  }, [
    blockContext?.blockId,
    form,
    formId,
    formName,
    hasStarted,
    trackFormStart,
  ]);

  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured");
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}"]`
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = form.handleSubmit(
    async (values) => {
      setSubmitMessage(null);
      setSubmitError(null);

      if (!RECAPTCHA_SITE_KEY) {
        setSubmitError("Google reCAPTCHA configuration is missing.");
        trackFormSubmit({
          formId,
          formName,
          status: "error",
          metadata: blockContext?.blockId
            ? { block_id: blockContext.blockId }
            : undefined,
        });
        return;
      }

      try {
        const recaptchaToken = await getRecaptchaToken(RECAPTCHA_SITE_KEY);

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            recaptchaToken,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(payload?.error ?? "Submission failed");
        }

        trackFormSubmit({
          formId,
          formName,
          status: "success",
          metadata: {
            ...(blockContext?.blockId
              ? { block_id: blockContext.blockId }
              : {}),
            hasMessage: Boolean(values.message),
          },
        });

        setSubmitMessage("Tak for din besked. Vi vender tilbage snarest.");
        form.reset();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Der skete en fejl. Prøv igen.";
        setSubmitError(message);
        trackFormSubmit({
          formId,
          formName,
          status: "error",
          metadata: blockContext?.blockId
            ? { block_id: blockContext.blockId }
            : undefined,
        });
      }
    },
    () => {
      setSubmitError("Udfyld venligst alle felter korrekt.");
      trackFormSubmit({
        formId,
        formName,
        status: "error",
        metadata: blockContext?.blockId
          ? { block_id: blockContext.blockId }
          : undefined,
      });
    }
  );

  return (
    <div className="bg-background rounded-2xl shadow-xl p-8 max-w-md mx-auto text-foreground">
      <h2 className="text-2xl font-bold mb-8 text-center">
        {content.title ?? "Contact"}
      </h2>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <FormField
            control={form.control}
            name="name"
            rules={{
              required: "Navn er påkrævet",
              minLength: {
                value: 2,
                message: "Navn skal være mindst 2 tegn",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fulde navn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Hans Hansen"
                    {...field}
                    className="bg-background text-foreground border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email er påkrævet",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Indtast en gyldig email",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                    className="bg-background text-foreground border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            rules={{
              required: "Telefonnummer er påkrævet",
              minLength: {
                value: 6,
                message: "Indtast et gyldigt telefonnummer",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefonnummer</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+45 12 34 56 78"
                    {...field}
                    className="bg-background text-foreground border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            rules={{
              required: "Besked er påkrævet",
              minLength: {
                value: 10,
                message: "Beskeden skal være mindst 10 tegn",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Besked</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Hvordan kan vi hjælpe dig i dag?"
                    rows={4}
                    {...field}
                    className="bg-background text-foreground border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              variant="default"
              className="px-6 py-2 rounded-lg text-base font-medium bg-primary text-primary-foreground"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Sender..." : "Send Besked"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Denne hjemmeside er beskyttet af reCAPTCHA, og Googles{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Privatlivspolitik
            </a>{" "}
            og{" "}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Servicevilkår
            </a>{" "}
            er gældende.
          </p>
          <div className="text-sm text-center" aria-live="polite">
            {submitMessage ? (
              <span className="text-green-600">{submitMessage}</span>
            ) : null}
            {submitError ? (
              <span className="text-destructive">{submitError}</span>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type ContactFormValues = {
  name: string;
  email: string;
  mobile: string;
  message: string;
};

async function getRecaptchaToken(siteKey: string): Promise<string> {
  if (!window.grecaptcha) {
    throw new Error(
      "reCAPTCHA kunne ikke initialiseres. Opdater siden og prøv igen."
    );
  }

  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(
        new Error(
          "reCAPTCHA kunne ikke initialiseres. Opdater siden og prøv igen."
        )
      );
      return;
    }
    window.grecaptcha.ready(() => {
      if (!window.grecaptcha) {
        reject(
          new Error(
            "reCAPTCHA kunne ikke initialiseres. Opdater siden og prøv igen."
          )
        );
        return;
      }
      window.grecaptcha
        .execute(siteKey, { action: "contact_form" })
        .then(resolve)
        .catch((error) => {
          reject(
            error instanceof Error
              ? error
              : new Error("reCAPTCHA validering mislykkedes")
          );
        });
    });
  });
}
