export function buildHeaders(isProduction?: boolean) {
  return {
    "Content-Type": "text/css; charset=utf-8",
    "Cache-Control": isProduction ? "public, max-age=3600" : "no-store",
  };
}
