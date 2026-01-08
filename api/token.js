import api from "./axios";

export const addTokenApi = async (data) => {
  return api.post("/user/addToken", data);
};

export const getTokenTransactionsApi = async (page = 1, limit = 10) => {
  return api.get("/user/getTokenTransactions", {
    params: { page, limit },
  });
};
