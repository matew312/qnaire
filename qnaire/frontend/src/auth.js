import Cookies from "universal-cookie";

export function getAuthHeader() {
  const cookies = new Cookies();
  return `Token ${cookies.get("token")}`;
}
export function setToken(value) {
  const cookies = new Cookies();
  cookies.set("token", value);
}
export function getToken() {
  const cookies = new Cookies();
  return cookies.get("token");
}
