import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui";
import { clsx } from "@/lib/clsx";

/* =============================================================================
   THE MENU SLOT
   -----------------------------------------------------------------------------
   The villa asked for the space to be held for two menus they have not sent
   yet: Paon's, and the treatment menu.

   A button that goes nowhere is worse than no button, so until `href` is
   filled in this renders the space as a small panel that says the menu is
   coming and offers the one thing that does work today — asking for it. Put a
   path or a URL in content/site.ts and the same slot becomes the button, with
   no other change.
   ========================================================================== */

export type Menu = {
  label: string;
  href: string | null;
  pending: string;
};

export function MenuSlot({
  menu,
  action,
  subject,
  className,
}: {
  menu: Menu;
  /** Where the WhatsApp message says it came from, when there is no menu yet. */
  action: string;
  subject: string;
  className?: string;
}) {
  if (menu.href) {
    /*
     * A PDF counts as off-site even when it is served from /public. Without
     * this the Button falls through to TLink, which sees a path beginning with
     * "/" and hands it to the client router — and the router has no route for
     * a PDF. It also belongs in its own tab: a menu is something to look at
     * beside the page, not instead of it.
     */
    const leavesThePage = /^https?:/.test(menu.href) || /\.pdf($|\?)/i.test(menu.href);
    return (
      <Button href={menu.href} external={leavesThePage} className={className}>
        {menu.label}
      </Button>
    );
  }

  return (
    <div className={clsx("border border-line bg-canvas p-6 md:p-7", className)}>
      <h3 className="display text-[1.125rem]">{menu.label}</h3>
      <p className="mt-2 text-[0.875rem] leading-[1.65] text-muted">{menu.pending}</p>
      <div className="mt-5">
        <WhatsAppButton action={action} subject={subject} label="Ask for the menu" />
      </div>
    </div>
  );
}
