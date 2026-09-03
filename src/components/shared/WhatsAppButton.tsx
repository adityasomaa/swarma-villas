"use client";

import { buttonStyle } from "@/components/ui";
import { cta } from "@/content/site";
import { useEnquiry } from "@/lib/useEnquiry";
import type { TemplateId } from "@/lib/templates";

/**
 * A WhatsApp link that knows where it was pressed. The URL has to be built on
 * the client because it carries the current pathname, so this is the one small
 * client component the otherwise static pages use for it.
 */
export function WhatsAppButton({
  tpl,
  action,
  subject,
  label = cta.secondary.label,
  className,
}: {
  tpl: TemplateId;
  action: string;
  subject?: string;
  label?: string;
  className?: string;
}) {
  const enquiry = useEnquiry();
  return (
    <a
      href={enquiry(action, subject)}
      target="_blank"
      rel="noopener noreferrer"
      className={[buttonStyle(tpl, "primary"), className].filter(Boolean).join(" ")}
    >
      {label}
    </a>
  );
}
