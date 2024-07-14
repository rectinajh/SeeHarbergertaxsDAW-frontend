import axios, { AxiosResponse } from "axios";
// import { message as Message } from "antd";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // baseURL: "/api/proxy/",
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // const token =
    //   typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const {
      data: { code, message, data },
      status,
    } = response;
    if (status === 200 && code === 200) {
    } else {
      // typeof window !== "undefined" && Message.error(message);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // typeof window !== "undefined" && Message.error(error.message);
      // 处理未授权错误，比如跳转到登录页
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
