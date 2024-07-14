import axios from "../libs/axios";

export const getAdvertise = async () => {
  const response = await axios.get("/v1/advertise/?format=json");
  return response.data;
};

export const addAdvertise = async (data: any) => {
  const response = await axios.post("/v1/advertise", data);
  return response.data;
};

export const updateUserProfile = async (data: any) => {
  const response = await axios.put("/user/profile", data);
  return response.data;
};
