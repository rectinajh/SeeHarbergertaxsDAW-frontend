import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
// import { getCookie } from "./utils";
import https from "https";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // baseURL: "text-api",
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
    // "X-Csrftoken": "3V9NxnHlB4TSFhUX5HtUmZ133U37XFmg",
  },
  withCredentials: true,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

axiosInstance.interceptors.request.use(
  (config) => {
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

const get = (url: string, params?: object, config?: AxiosRequestConfig) => {
  return axiosInstance.get(url, { params, ...config });
};

const post = (url: string, data?: object, config?: AxiosRequestConfig) => {
  return axiosInstance.post(url, data, { ...config });
};

const patch = (url: string, data?: object, config?: AxiosRequestConfig) => {
  return axiosInstance.patch(url, data, { ...config });
};

export { get, post, patch };

export default axiosInstance;
