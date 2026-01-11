import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import {
  TokenCredentialAuthenticationProvider,
  TokenCredentialAuthenticationProviderOptions,
} from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

interface ContactFormPayload {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

let cachedClient: Client | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildGraphClient(): Client {
  if (cachedClient) {
    return cachedClient;
  }

  const tenantId = getRequiredEnv("NEXT_MS_GRAPH_TENANT_ID");
  const clientId = getRequiredEnv("NEXT_MS_GRAPH_CLIENT_ID");
  const clientSecret = getRequiredEnv("NEXT_MS_GRAPH_CLIENT_SECRET");
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const options: TokenCredentialAuthenticationProviderOptions = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  const authProvider = new TokenCredentialAuthenticationProvider(
    credential,
    options
  );

  cachedClient = Client.initWithMiddleware({ authProvider });
  return cachedClient;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactMail(payload: ContactFormPayload): Promise<void> {
  const mailbox = getRequiredEnv("NEXT_MS_GRAPH_MAILBOX");
  const recipients = getRequiredEnv("NEXT_CONTACT_EMAIL_RECIPIENT");
  const fromDisplayName =
    process.env.NEXT_CONTACT_FROM_NAME?.trim() || "no-reply@uslu.dk";

  const client = buildGraphClient();

  const htmlBody = `
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(payload.mobile)}</p>
    <p><strong>Message:</strong><br/>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>
  `;

  const mail = {
    message: {
      subject: `New contact form submission from ${payload.name}`,
      body: {
        contentType: "HTML" as const,
        content: htmlBody,
      },
      from: {
        emailAddress: {
          address: mailbox,
          name: fromDisplayName,
        },
      },
      sender: {
        emailAddress: {
          address: mailbox,
          name: fromDisplayName,
        },
      },
      toRecipients: [
        {
          emailAddress: {
            address: recipients,
            name: "Contact Recipient",
          },
        },
      ],
      replyTo: [
        {
          emailAddress: {
            address: payload.email,
            name: payload.name,
          },
        },
      ],
    },
  };

  await client.api(`/users/${mailbox}/sendMail`).post(mail);
}
