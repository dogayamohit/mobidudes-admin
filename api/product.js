import api from "./axios";

export const toggleWishlistApi = (product_id) => {
  return api.post("/booking/toggleWishlist", {
    product_id,
  });
};

export const getHomeDashboardApi = () => {
  return api.get("/booking/dashboard");
};

export const createProductApi = (payload) => {
  return api.post("/product/createProduct", payload);
};

export const updateProductApi = (payload) => {
  return api.patch("/product/updateProduct", payload);
};

export const deleteProductApi = async (product_id) => {
  return api.delete(`/user/deleteProduct/${product_id}`);
};

export const getProductListApi = ({ search = "", type = "", category_id = "", page = 1, limit = 10 }) => {
  const params = { page, limit };

  if (search) params.search = search;
  if (type) params.type = type;
  if (category_id) params.category_id = category_id;

  return api.get("/booking/getProductList", { params: params });
};

export const getProductDetailApi = ({ product_id }) => {
  return api.get("/booking/getProductDetail", { params: { product_id } });
};

export const getWishlistApi = ({ page = 1, limit = 10 }) => {
  const params = { page, limit };
  return api.get("/booking/getWishlist", { params: params });
}

export const addCartItemApi = (productId) => {
  return api.post(
    "/booking/addCartItem",
    {
      product_id: productId,
    }
  );
};

export const getCartApi = () => {
  return api.get("/booking/getCart");
}

export const checkoutApi = () => {
  return api.post(`/booking/checkout`);
};

export const removeCartItemApi = (productId) => {
  return api.delete(`/booking/removeCartItem/${productId}`);
};

export const handleTokenClickApi = (productId, type) => {
  return api.post("/booking/handleTokenClick", {
    product_id: productId,
    type, // "add" or "remove"
  });
};

export const addRaffleCartItemApi = (productId) => {
  return api.post("/booking/addRaffleCartItem", {
    product_id: productId
  });
};

export const getRaffleCartApi = () => {
  return api.get(`/booking/getRaffleCart`);
};

export const removeRaffleCartItemApi = (productId) => {
  return api.delete(`/booking/removeRaffleCartItem/${productId}`);
};

export const placeRaffleBidApi = () => {
  return api.post(`/booking/placeRaffleBid`);
};

// Product list
export const getListedProductApi = ({ status = "active", page = 1, limit = 10 }) => {
  return api.get(`/product/getProductList`, {
    params: { status, page, limit },
  });
};

export const getListedProductDetailApi = ({ product_id }) => {
  return api.get("/product/getProductDetail", { params: { product_id } });
};

// Bid list
export const getBidListApi = ({ status = "active", page = 1, limit = 10 }) => {
  return api.get(`/product/getBidList`, {
    params: { status, page, limit },
  });
};

// Order list
export const getOrderListApi = ({ status = "pending", page = 1, limit = 10 }) => {
  return api.get(`/product/getOrderList`, {
    params: { status, page, limit },
  });
};

// Selling dashboard count
export const getSellingDashboardCountApi = () => {
  return api.get(`/product/getSellingDashboardCount`);
};

