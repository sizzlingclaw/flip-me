export function publicOrigin(request: Request): string {
  const fwdHost = request.headers.get("x-forwarded-host");
  if (fwdHost) {
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    return `${proto}://${fwdHost}`;
  }
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv;
  return new URL(request.url).origin;
}
