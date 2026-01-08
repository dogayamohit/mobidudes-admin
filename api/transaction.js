import api from "./axios";

export const manageBankAccountApi = async () => {
  return api.post("/user/manageBankAccount");
};

export const getWalletTransactionsApi = async (page = 1, limit = 10) => {
  return api.get("/user/getWalletTransactions", {
    params: { page, limit },
  });
};

export const withdrawWalletApi = async (amount) => {
  return api.post("/user/withdrawWallet", { amount });
};
