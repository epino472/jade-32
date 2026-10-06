export function normalizeCode(code) {
  return String(code).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export async function hashCode(missionId, code) {
  const data = new TextEncoder().encode(`piyi|${missionId}|${normalizeCode(code)}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
