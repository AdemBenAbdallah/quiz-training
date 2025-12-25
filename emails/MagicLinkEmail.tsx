import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type MagicLinkEmailProps = {
  firstName?: string;
  magicLinkUrl: string; // <- the full URL Better Auth gives you
  appName?: string; // e.g. "Acme"
  expiresInMinutes?: number; // e.g. 15
  supportEmail?: string; // e.g. "support@yourapp.com"
};

export default function MagicLinkEmail({
  firstName = "there",
  magicLinkUrl,
  appName = "Quiz Aws",
  expiresInMinutes = 15,
  supportEmail = "support@certquickly.com",
}: MagicLinkEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{appName}: your secure sign-in link</Preview>
      <Body style={styles.body}>
        <Container style={styles.card}>
          <Heading style={styles.h1}>Welcome, {firstName}!</Heading>

          <Text style={styles.text}>
            Tap the button below to sign in to <strong>{appName}</strong>. For
            security, this link works only once and expires in{" "}
            {expiresInMinutes} minutes.
          </Text>

          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button href={magicLinkUrl} style={styles.cta}>
              Sign in to {appName}
            </Button>
          </Section>

          <Text style={styles.textSmall}>
            If the button doesn’t work, copy and paste this link into your
            browser:
          </Text>
          <Text style={styles.codeWrap}>
            <Link href={magicLinkUrl} style={styles.link}>
              {magicLinkUrl}
            </Link>
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.textSmall}>
            Didn’t request this email? You can safely ignore it. If you need
            help, contact us at{" "}
            <Link href={`mailto:${supportEmail}`} style={styles.link}>
              {supportEmail}
            </Link>
            .
          </Text>

          <Text style={styles.footer}>{appName}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#0b0b0b",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    color: "#e5e7eb",
    margin: 0,
    padding: "24px",
  },
  card: {
    maxWidth: "520px",
    margin: "0 auto",
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: "28px 28px 20px",
    boxShadow:
      "0 2px 6px rgba(16,24,40,0.06), 0 12px 24px -8px rgba(16,24,40,0.14)",
  },
  h1: { fontSize: 24, lineHeight: "28px", margin: "0 0 10px" },
  text: { fontSize: 14, lineHeight: "22px", margin: "12px 0" },
  textSmall: { fontSize: 12, lineHeight: "20px", color: "#9ca3af" },
  codeWrap: {
    wordBreak: "break-all",
    backgroundColor: "#1f2937",
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 12,
  },
  cta: {
    display: "inline-block",
    fontSize: 14,
    padding: "12px 18px",
    textDecoration: "none",
    borderRadius: 999,
    backgroundColor: "#dc2626",
    color: "#ffffff",
  },
  link: { color: "#ef4444", textDecoration: "underline" },
  hr: { borderColor: "#374151", margin: "20px 0" },
  footer: {
    marginTop: 8,
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
  },
};
