export async function fetchWithUser(url, options = {}) {
  const userId = localStorage.getItem('userId');
  const headers = { 'Content-Type': 'application/json', ...options.headers, 'X-User-Id': userId };
  return fetch(url, { ...options, headers });
}
