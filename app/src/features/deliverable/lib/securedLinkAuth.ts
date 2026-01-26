import { useEffect, useState } from "react";

const COOKIE_NAME = "secured_link_tokens";
const TTL_DAYS = 7;

interface StoredTokens {
  [linkToken: string]: {
    jwt: string;
    expiresAt: number;
  };
}

function getStoredTokens(): StoredTokens {
  if (typeof document === "undefined") return {};

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return {};

  try {
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return {};
  }
}

function saveStoredTokens(tokens: StoredTokens): void {
  const maxAge = TTL_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(tokens)
  )}; path=/; max-age=${maxAge}; SameSite=None; Secure`;
}

export function getSecuredLinkJwt(linkToken: string): string | null {
  const tokens = getStoredTokens();
  const entry = tokens[linkToken];

  if (!entry) return null;

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    removeSecuredLinkJwt(linkToken);
    return null;
  }

  return entry.jwt;
}

export function setSecuredLinkJwt(linkToken: string, jwt: string): void {
  const tokens = getStoredTokens();

  tokens[linkToken] = {
    jwt,
    expiresAt: Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000,
  };

  saveStoredTokens(tokens);
}

export function removeSecuredLinkJwt(linkToken: string): void {
  const tokens = getStoredTokens();
  delete tokens[linkToken];
  saveStoredTokens(tokens);
}

export function isSecuredLinkAuthenticated(linkToken: string): boolean {
  return getSecuredLinkJwt(linkToken) !== null;
}

interface UseSecuredLinkAuthResult {
  isLoading: boolean;
  isAuthenticated: boolean;
  jwtToken: string | null;
}

export function useSecuredLinkAuth(linkToken: string): UseSecuredLinkAuthResult {
  const [isLoading, setIsLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    const storedJwtToken = getSecuredLinkJwt(linkToken);
    setJwtToken(storedJwtToken);
    setIsLoading(false);
  }, [linkToken]);

  return {
    isLoading,
    isAuthenticated: jwtToken !== null,
    jwtToken: jwtToken,
  };
}