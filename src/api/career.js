import api from "./axios";


/* Fetch all career applications */
export const getCareerList = async () => {
  try {
    const response = await api.get("/admin/career/get");
    return response.data.data; // <-- API array
  } catch (error) {
    console.error("Error fetching career list:", error);
    throw error;
  }
};


/* GET total career count */
export const getCareerCount = async () => {
  try {
    const res = await api.get("/admin/career/get");
    return res.data.count; // ✅ 4
  } catch (error) {
    console.error("Error fetching career count:", error);
    throw error;
  }
};


/* Toggle career status */
export const toggleCareerStatus = async (id, isActive) => {
  try {
    const response = await api.post(`/admin/career/toggle-status/${id}`, {
      is_active: isActive,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling career status:", error);
    throw error;
  }
};


/* Download resume */
export const downloadCareerResume = async (id) => {
  try {
    const response = await api.get(
      `/admin/career/downloadResume/${id}`,
      { responseType: "blob" } // 🔥 IMPORTANT
    );
    return response;
  } catch (error) {
    console.error("Resume download failed:", error);
    throw error;
  }
};


/* Delete career */
export const deleteCareer = async (id) => {
  try {
    const response = await api.post(`/admin/career/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete career failed:", error);
    throw error;
  }
};


/* GET all vacancies */
export const getVacancies = async () => {
  try {
    const res = await api.get("/admin/vacancy/get");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching vacancies:", error);
    throw error;
  }
};


/* GET total vacancy open roles count */
export const getVacancyOpenRoleCount = async () => {
  try {
    const res = await api.get("/admin/vacancy/get");
    return res.data.total_open_roles; 
  } catch (error) {
    console.error("Error fetching vacancy open roles count:", error);
    throw error;
  }
};


/* TOGGLE vacancy status */
export const toggleVacancyStatus = async (id, isActive) => {
  try {
    const response = await api.post(
      `/admin/vacancy/toggle-status/${id}`,
      { is_active: isActive }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling vacancy status:", error);
    throw error;
  }
};


/* DELETE vacancy */
export const deleteVacancy = async (id) => {
  try {
    const res = await api.post(`/admin/vacancy/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete vacancy failed:", error.response?.data || error);
    throw error;
  }
};


/* GET career roles (employee roles) */
export const getCareerRoles = async () => {
  try {
    const response = await api.get("/admin/career/list");
    return response.data.data; // [{ id, name }]
  } catch (error) {
    console.error("Error fetching career roles:", error);
    throw error;
  }
};

/* ADD OPEN JOB / VACANCY */
export const addVacancy = async (payload) => {
  try {
    const res = await api.post("/admin/vacancy/add", payload);
    return res.data;
  } catch (error) {
    console.error("Add vacancy failed:", error);
    throw error;
  }
};


/* UPDATE vacancy */
export const updateVacancy = async (id, payload) => {
  try {
    const res = await api.post(`/admin/vacancy/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Update vacancy failed:", error.response?.data || error);
    throw error;
  }
};
