import api from "./axios";

// ADD ADDRESS
export const addAddressApi = async (data) => {
  return api.post("/user/addAddress", data);
};

// UPDATE ADDRESS
export const updateAddressApi = async (data) => {
  return api.put("/user/updateAddress", data);
};

// DELETE ADDRESS
export const deleteAddressApi = async (address_id) => {
  return api.delete(`/user/deleteAddress/${address_id}`);
};

// GET ADDRESS LIST
export const getAddressApi = async (page = 1, limit = 10) => {
  return api.get("/user/getAddressList", {
    params: { page, limit } 
  });
};

//GET MyOrder LIST
export const getMyOrderApi = async (page = 1, limit = 9) => {
  return api.get("/user/getOrderList", {
    params: { page, limit },
  });
};

export const getOrderDetailApi = async ({ product_id }) => {
  return api.get(`/user/getOrderDetail`, { params: { product_id } });
};

// GET Bid List API
export const getBidListApi = async (status = 'pending', page = 1, limit = 2) => {
  return api.get("/user/getBidList", {
    params: { status, page, limit },
  });
};

// GET Bid Detail API
export const getBidDetailApi = ({ product_id }) => {
  return api.get("/user/getBidDetail", {
    params: { product_id }
  });
};


