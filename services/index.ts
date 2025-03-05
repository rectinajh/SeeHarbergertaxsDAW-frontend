import { post, get, patch } from "../libs/axios";

export const login = async (data: any) => {
  const response = await post("/v1/login/", data, {
    withCredentials: false,
  });
  return response;
};
export const getAuditAdvertise = async (params?: any) => {
  const response = await get(`/v1/audit/${params?.id || ""}`, params);
  return response.data;
};

export const getAdvertise = async (params?: any) => {
  const response = await get("/v1/advertise/", params, {
    // withCredentials: false,
  });
  return response.data;
};

export const addAdvertise = async (data: any) => {
  const response = await post("/v1/advertise/", data);
  return response.data;
};

export const auditAdvertise = async ({
  data,
  id,
}: {
  data: any;
  id: number;
}) => {
  const response = await patch("/v1/advertise/" + id, data);
  return response.data;
};
