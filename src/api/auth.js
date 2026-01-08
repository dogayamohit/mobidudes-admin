import api from "./axios";

/* LOGIN */
export const login = async (payload) => {
  const response = await api.post("/admin/login", payload);

  // your API response structure
  // response.data.data contains user + token
  return response.data.data;
};

/* SAVE AUTH DATA */
export const setAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("admin", JSON.stringify(data));
};

/* GET TOKEN */
export const getToken = () => {
  return localStorage.getItem("token");
};

/* CHECK LOGIN */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/* LOGOUT */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
};
