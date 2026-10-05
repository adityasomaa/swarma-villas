"use client";

import { ButtonLabel, buttonStyle } from "@/components/ui";
import { cta } from "@/content/site";
import { useEnquiry } from "@/lib/useEnquiry";

/**
 * A WhatsApp link that knows where it was pressed. The URL has to be built on
 * the client because it carries the current pathname, so this is the one small
 * client component the otherwise static pages use for it.
 */
export function WhatsAppButton({
  action,
  subject,
  opening,
  label = cta.secondary.label,
  className,
}: {
  action: string;
  subject?: string;
  /** Replaces "I have a question about …" for buttons that are not questions. */
  opening?: string;
  label?: string;
  className?: string;
}) {
  const enquiry = useEnquiry();
  return (
    <a
      href={enquiry(action, subject, opening)}
      target="_blank"
      rel="noopener noreferrer"
      className={[buttonStyle("primary"), className].filter(Boolean).join(" ")}
    >
      <ButtonLabel>{label}</ButtonLabel>
    </a>
  );
}
