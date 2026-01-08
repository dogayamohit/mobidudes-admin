import api from "./axios";


/* GET all services */
export const getServices = async () => {
    try {
        const res = await api.get("/admin/service/get");
        return res.data.data; // services array
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
    }
};


/* GET service count */
export const getServiceCount = async () => {
  try {
    const res = await api.get("/admin/service/get");
    return res.data.total_services; 
  } catch (error) {
    console.error("Error fetching service count:", error);
    throw error;
  }
};

/* DELETE service */
export const deleteService = async (id) => {
    try {
        const res = await api.post(`/admin/service/delete/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
};


/* EDIT service */
export const editService = async (id, payload) => {
    try {
        const res = await api.post(`/admin/service/edit/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error editing service:", error);
        throw error;
    }
};


export const addService = async (formData) => {
  try {
    const response = await api.post("/admin/service/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Log detailed error for debugging
    console.error("Error adding service:", error?.response || error);

    // Throw a user-friendly message or the server message
    throw new Error(
      error?.response?.data?.message || "Failed to add service"
    );
  }
};



/* GET all service categories */
export const getServiceCategories = async () => {
    try {
        const response = await api.get("/admin/serviceCategory/get");
        return response.data.data; // array
    } catch (error) {
        console.error("Error fetching service categories:", error);
        throw error;
    }
};

/* DELETE service category */
export const deleteServiceCategory = async (id) => {
    try {
        return await api.post(`/admin/serviceCategory/delete/${id}`);
    } catch (error) {
        console.error("Error deleting service category:", error);
        throw error;
    }
};


/* ADD service category */
export const addServiceCategory = async (formData) => {
    try {
        const response = await api.post(
            "/admin/serviceCategory/add",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error adding service category:", error);
        throw error;
    }
};


/* UPDATE service category */
export const updateServiceCategory = async (id, formData) => {
    try {
        const response = await api.post(
            `/admin/serviceCategory/update/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multi part/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating service category:", error);
        throw error;
    }
};