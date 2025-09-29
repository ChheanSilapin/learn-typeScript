

const ACCESS_TOKEN_KEY = "access_token";

let inMemoryAccessToken: string | null = null;

function loadTokenFromSession(): string | null {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    // Ignore storage access issues (e.g., SSR or privacy mode)
  }
  return null;
}

// Initialize in-memory token from session storage
inMemoryAccessToken = loadTokenFromSession();

// --- Public Functions ---


export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}


export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    
    if (token) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  } catch {
    // Ignore storage errors; memory still holds the token until next reload
  }
}


export function clearAccessToken(): void {
  setAccessToken(null);
}