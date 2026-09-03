/**
 * One script tag of JSON-LD, rendered on the server. It costs nothing at
 * runtime and is present in the HTML a crawler receives without any JavaScript
 * running.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Built from our own content file, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
