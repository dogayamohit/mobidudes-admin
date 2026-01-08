import api from "./axios";

export const getAboutList = async () => {
  const res = await api.get("/admin/about/get");
  return res.data.data;
};


export const updateAbout = async (id, payload) => {
  return api.post(`/admin/about/edit/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};



// https://stage.mobile.dayhike.com/administrator
// devops@dayhike.com

// 1936DayHike$69