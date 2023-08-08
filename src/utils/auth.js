const TokenKey = 'User-Token'

export function getToken() {
  return document.cookie;
  // return sessionStorage.getItem(TokenKey);
}

export function setToken(token) {
  document.cookie = `TokenKey=${token};`
  // sessionStorage.setItem(TokenKey, token);
}

export function removeToken() {
  document.cookie = "TokenKey=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  // sessionStorage.removeItem(TokenKey);
}
