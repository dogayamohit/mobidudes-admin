import api from "./axios"; // your axios instance


/* ===============================
   Get all portfolios
================================ */
export const getPortfolios = async () => {
  try {
    const response = await api.get("/admin/portfolio/get");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching portfolios:", error?.response || error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch portfolios"
    );
  }
};

/* ===============================
   Add new portfolio
================================ */
export const addPortfolio = async (formData) => {
  try {
    const res = await api.post("/admin/portfolio/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.response?.data?.message || "Failed to add portfolio");
  }
};


/* ===============================
   Update portfolio by ID
================================ */
export const updatePortfolio = async (id, formData) => {
  try {
    const response = await api.post(`/admin/portfolio/update/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating portfolio:", error?.response || error);
    throw new Error(
      error?.response?.data?.message || "Failed to update portfolio"
    );
  }
};

/* ===============================
   Delete portfolio by ID
================================ */
export const deletePortfolio = async (id) => {
  try {
    const response = await api.post(`/admin/portfolio/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting portfolio:", error?.response || error);
    throw new Error(
      error?.response?.data?.message || "Failed to delete portfolio"
    );
  }
};


// Get all portfolio categories
export const getPortfolioCategories = async () => {
  try {
    const response = await api.get("/admin/portfolioCategory/get");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching portfolio categories:", error?.response || error);
    throw new Error(error?.response?.data?.message || "Failed to fetch categories");
  }
};

// Add new portfolio category
export const addPortfolioCategory = async (formData) => {
  try {
    const response = await api.post("/admin/portfolioCategory/add", formData);
    return response.data;
  } catch (error) {
    console.error("Error adding portfolio category:", error?.response || error);
    throw new Error(error?.response?.data?.message || "Failed to add category");
  }
};

// Edit portfolio category by ID
export const editPortfolioCategory = async (id, formData) => {
  try {
    const response = await api.post(`/admin/portfolioCategory/edit/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error editing portfolio category:", error?.response || error);
    throw new Error(error?.response?.data?.message || "Failed to edit category");
  }
};

// Delete portfolio category by ID
export const deletePortfolioCategory = async (id) => {
  try {
    const response = await api.post(`/admin/portfolioCategory/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting portfolio category:", error?.response || error);
    throw new Error(error?.response?.data?.message || "Failed to delete category");
  }
};
