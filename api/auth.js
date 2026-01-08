import api from "./axios";

// --- SEND OTP ---
export const sendOtpApi = async (country_code, phone) => {
  return api.post("/user/sendOtp", {
    country_code,
    phone_number: phone,
  });
};

// --- VERIFY OTP ---
export const verifyOtpApi = async (country_code, phone, otp, notifTokens) => {
  return api.post("/user/verifyOtp", {
    country_code,
    phone_number: phone,
    otp,
    ...notifTokens,
  });
};

// --- Get Profile API ---
export const getProfileApi = async () => {
  return api.get("/user/getProfile");
};

// --- Update Profile API ---
export const updateProfileApi = async (first_name, last_name, profile_path, email_address, address, city, country, postal_code) => {
  return api.patch("/user/updateProfile", {
      first_name,
      last_name,
      profile_path,  
      email_address,
      address,
      city,
      country,
      postal_code,
  });
};

// --- SEND OTP ---
export const sendChangePhoneOtpApi = async (country_code, phone) => {
  return api.post("/user/sendChangePhoneOtp", {
    country_code,
    phone_number: phone,
  });
};

// --- VERIFY OTP ---
export const verifyChangePhoneOtpApi = async (country_code, phone, otp) => {
  return api.post("/user/verifyChangePhoneOtp", {
    country_code,
    phone_number: phone,
    otp,
  });
};
