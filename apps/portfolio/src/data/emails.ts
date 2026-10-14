import type { EmailSenderConfig, EmailTemplateKey } from "./types";

export type { EmailSenderConfig, EmailTemplateKey };

/**
 * Centralized Email Sender Configuration Registry
 * Defines default sender names, addresses, subject prefixes, and template-specific environment overrides.
 */
export const EMAIL_CONFIG: Record<EmailTemplateKey, EmailSenderConfig> = {
  reminder: {
    id: "reminder",
    name: "UOweMe Daily Reminder",
    defaultSenderName: "UOweMe Reminders",
    defaultEmail: "reminders@machi.asia",
    fallbackAddress: "onboarding@resend.dev",
    envOverrideKey: "RESEND_FROM_REMINDERS",
    subjectPrefix: "[UOWEME]",
    description: "Daily automated debt summaries and pending obligation reminder digests.",
  },
  transaction: {
    id: "transaction",
    name: "UOweMe Transaction Notice",
    defaultSenderName: "UOweMe",
    defaultEmail: "transactions@machi.asia",
    fallbackAddress: "onboarding@resend.dev",
    envOverrideKey: "RESEND_FROM_TRANSACTIONS",
    subjectPrefix: "[UOWEME]",
    description: "Real-time notifications sent when debts or credits are created or updated.",
  },
  settlement: {
    id: "settlement",
    name: "UOweMe Settlement Notice",
    defaultSenderName: "UOweMe Payments",
    defaultEmail: "payments@machi.asia",
    fallbackAddress: "onboarding@resend.dev",
    envOverrideKey: "RESEND_FROM_SETTLEMENTS",
    subjectPrefix: "[UOWEME]",
    description: "Settlement confirmations and PayMongo payment receipt notifications.",
  },
  commission: {
    id: "commission",
    name: "Machi Commission Request",
    defaultSenderName: "Machi Commissions",
    defaultEmail: "commissions@machi.asia",
    fallbackAddress: "onboarding@resend.dev",
    envOverrideKey: "RESEND_FROM_COMMISSIONS",
    subjectPrefix: "[COMMISSION]",
    description: "Admin alerts and confirmations for client bespoke software development bookings.",
  },
};

/**
 * Resolves the sender address string for Resend email dispatch.
 * 
 * Resolution Precedence:
 * 1. Dedicated template environment variable (e.g. `RESEND_FROM_COMMISSIONS`)
 * 2. Global fallback environment variable (`RESEND_FROM_EMAIL`)
 * 3. Default template sender formatting (`"<Default Name> <fallbackAddress>"`)
 */
export function getSenderEmail(templateKey: EmailTemplateKey): string {
  const config = EMAIL_CONFIG[templateKey] || EMAIL_CONFIG.transaction;

  // 1. Check template-specific environment variable override
  const specificEnv = process.env[config.envOverrideKey];
  if (specificEnv && specificEnv.trim()) {
    return specificEnv.trim();
  }

  // 2. Check global environment variable
  const globalEnv = process.env.RESEND_FROM_EMAIL;
  if (globalEnv && globalEnv.trim()) {
    return globalEnv.trim();
  }

  // 3. Fallback to template default formatted address
  return `${config.defaultSenderName} <${config.fallbackAddress}>`;
}

/**
 * Returns the full metadata profile for a given email template key.
 */
export function getEmailSenderProfile(templateKey: EmailTemplateKey): EmailSenderConfig {
  return EMAIL_CONFIG[templateKey] || EMAIL_CONFIG.transaction;
}

/**
 * Returns all configured email template sender profiles as a list.
 */
export function getAllEmailSenderProfiles(): EmailSenderConfig[] {
  return Object.values(EMAIL_CONFIG);
}
