// services/user.js

import axios from "./axios";

export const getAdvertise = async () => {
  const response = await axios.get("/advertise/?format=json");
  return response.data;
};

export const updateUserProfile = async (data: any) => {
  const response = await axios.put("/user/profile", data);
  return response.data;
};
