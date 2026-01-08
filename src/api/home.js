import api from "./axios";

/* Fetch all reviews */
export const getReviews = async () => {
  try {
    const response = await api.get("/admin/review/get"); // <-- your API endpoint
    return response.data.data; // array of reviews
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};


/* Fetch single review by ID */
export const getReviewById = async (id) => {
  try {
    const response = await api.get(`/admin/review/${id}`);
    return response.data.data; // single review object
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
};


export const deleteReview = async (id) => {
  try {
    // POST request to delete review
    await api.post(`/admin/review/delete/${id}`);
  } catch (error) {
    console.error("Delete review failed:", error);
    throw error;
  }
};


// -----------------------------------------------------------



/* Get all FAQs */
export const getFaqs = async () => {
  try {
    const response = await api.get("/admin/faq/get");
    return response.data.data; // array of FAQs
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
};

/* Delete FAQ by ID */
export const deleteFaq = async (id) => {
  try {
    const response = await api.post(`/admin/faq/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
};


/* GET FAQ BY ID */
export const getFaqById = async (id) => {
  try {
    const res = await api.post(`/admin/faq/get/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Fetch FAQ failed:", error);
    throw error;
  }
};


/* UPDATE FAQ */
export const updateFaq = async (id, payload) => {
  try {
    const res = await api.post(`/admin/faq/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Update FAQ failed:", error);
    throw error;
  }
};

/* Add new FAQ */
export const addFaq = async (payload) => {
  try {
    const res = await api.post("/admin/faq/add", payload);
    return res.data;
  } catch (error) {
    console.error("Add FAQ failed:", error);
    throw error;
  }
};