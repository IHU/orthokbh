import { NextRequest, NextResponse } from "next/server";
import { sendContactMail } from "@/lib/email/sendContactMail";

interface ContactFormBody {
  name?: string;
  email?: string;
  mobile?: string;
  message?: string;
  recaptchaToken?: string;
}

interface ValidationResult {
  data?: Required<Omit<ContactFormBody, "recaptchaToken">> & {
    recaptchaToken: string;
  };
  error?: string;
}

const REQUIRED_FIELDS: Array<keyof ContactFormBody> = [
  "name",
  "email",
  "mobile",
  "message",
  "recaptchaToken",
];

function validate(body: ContactFormBody): ValidationResult {
  for (const key of REQUIRED_FIELDS) {
    const value = body[key];
    if (!value || typeof value !== "string" || !value.trim()) {
      return { error: `${key} is required` };
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email!)) {
    return { error: "email must be a valid email address" };
  }

  return {
    data: {
      name: body.name!.trim(),
      email: body.email!.trim(),
      mobile: body.mobile!.trim(),
      message: body.message!.trim(),
      recaptchaToken: body.recaptchaToken!.trim(),
    },
  };
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.NEXT_RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("Missing NEXT_RECAPTCHA_SECRET_KEY environment variable");
    return false;
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      console.error("reCAPTCHA verification failed", await response.text());
      return false;
    }

    const result = (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      [key: string]: unknown;
    };

    return Boolean(result.success) && (result.score ?? 0) >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification threw", error);
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let rawBody: ContactFormBody;

  try {
    rawBody = (await request.json()) as ContactFormBody;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const { data, error } = validate(rawBody);

  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const recaptchaOk = await verifyRecaptcha(data.recaptchaToken);

  if (!recaptchaOk) {
    return NextResponse.json(
      { error: "Failed human verification" },
      { status: 403 }
    );
  }

  try {
    await sendContactMail({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      message: data.message,
    });
    console.error("sendContactMail SUCCESS", data.email);
  } catch (error) {
    console.error("sendContactMail failed", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
