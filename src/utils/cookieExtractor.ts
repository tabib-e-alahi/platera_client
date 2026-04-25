export function getCookieValue(cookieHeader: string, name: string) {
  const cookies = cookieHeader.split(";").map(c => c.trim());

  const target = cookies.find(c => c.startsWith(name + "="));

  return target ? decodeURIComponent(target.split("=")[1]) : null;
}