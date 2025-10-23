export function getAuthToken() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; auth_token=`);

  if (parts !== undefined && parts.length === 2 && parts.pop() !== undefined) {
    return parts.pop()?.split(";").shift();
  }

  return undefined;
}
