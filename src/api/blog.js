import api from "./axios";

/* ================= GET ALL BLOGS ================= */
export const getBlogs = async () => {
  try {
    const res = await api.get("/admin/blog/get");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

/* ================= GET BLOG COUNT ================= */
export const getBlogCount = async () => {
  try {
    const res = await api.get("/admin/blog/get");
    return res.data.total; // only return total count
  } catch (error) {
    console.error("Error fetching blog count:", error);
    throw error;
  }
};



/* ================= DELETE BLOG ================= */
export const deleteBlog = async (id) => {
  try {
    const res = await api.post(`/admin/blog/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

/* ================= ADD BLOG ================= */
export const addBlog = async (payload) => {
  try {
    const res = await api.post("/admin/blog/add", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding blog:", error);
    throw error;
  }
};

/* ================= UPDATE BLOG (LIKE GET ALL) ================= */
export const updateBlog = async (id, payload) => {
  try {
    const res = await api.post(`/admin/blog/update/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

/* ================= REMOVE BLOG IMAGE ================= */
/* API: x-www-form-urlencoded */
export const removeBlogImage = async (blog_id, imagePath) => {
  try {
    const params = new URLSearchParams();
    params.append("image", imagePath); // full path as backend stores

    const res = await api.post(
      `admin/blog/remove-image/${blog_id}`,
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};










/* Get all blog categories */
export const getBlogCategories = async () => {
  try {
    const res = await api.get("/admin/blogCategory/get");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    throw error;
  }
};

/* Add blog category */
export const addBlogCategory = async (payload) => {
  try {
    return await api.post("/admin/blogCategory/add", payload);
  } catch (error) {
    console.error("Error adding blog category:", error);
    throw error;
  }
};

/* Edit blog category */
export const editBlogCategory = async (id, payload) => {
  try {
    return await api.post(`/admin/blogCategory/edit/${id}`, payload);
  } catch (error) {
    console.error("Error editing blog category:", error);
    throw error;
  }
};

/* Delete blog category */
export const deleteBlogCategory = async (id) => {
  try {
    return await api.post(`/admin/blogCategory/delete/${id}`);
  } catch (error) {
    console.error("Error deleting blog category:", error);
    throw error;
  }
};