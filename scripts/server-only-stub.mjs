/**
 * Resolves "server-only" to nothing.
 *
 * The package exists to throw when a server module is pulled into a client
 * bundle, and it throws under plain Node too — which is where the tests run.
 * This lets scripts/check-google-reviews.mjs import the real module instead of
 * a copy of it that could drift.
 */
export async function resolve(specifier, context, next) {
  if (specifier === "server-only") {
    return { url: "data:text/javascript,export%20%7B%7D", shortCircuit: true };
  }
  return next(specifier, context);
}
