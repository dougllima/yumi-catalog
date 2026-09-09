const externalUrlPattern = /^(https?:|data:|blob:)/;

export function publicAssetUrl(path: string) {
  if (externalUrlPattern.test(path)) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL;
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return `${normalizedBase}${normalizedPath}`;
}
