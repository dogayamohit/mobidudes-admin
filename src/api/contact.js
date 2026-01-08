import api from "./axios"

/* Get all contacts */
export const getContacts = async () => {
  const res = await api.get("/admin/contact/get");
  return res.data.data;
};

/* Delete contact */
export const deleteContact = async (id) => {
  return api.post(`/admin/contact/delete/${id}`);
};

/* Get Contact By ID */
export const getContactById = async (id) => {
  const res = await api.get(`/admin/contact/view/${id}`);
  return res.data.data;
};