import api from "./axios";

// --- GET TERMS AND CONDITION ---
export const getTermsAndConditionApi = async () => {
  return api.get("/global/getPrivacyPolicy?type=terms");
};

export const getPrivacyPolicyApi = async () => {
  return api.get("/global/getPrivacyPolicy?type=privacy");
};

export const getAboutApi = async () => {
  return api.get("/global/getPrivacyPolicy?type=about");
};

export const getCategoryApi = async (page = 1, limit = 10) => {
  return api.get("/global/getCategoryList", {
    params: {
      page,
      limit,
    },
  });
};

export const getSubCategoryApi = async (category_id, page = 1, limit = 10) => {
  return api.get("/global/getSubCategoryList", {
    params: {
      category_id,
      page,
      limit,
    },
  });
};

export const getDynamicPriceApi = async () => {
  return api.get("/global/getDynamicPrice");
};
