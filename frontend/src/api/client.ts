import axios from "axios";

/**
 * Axios 实例：统一配置后端基础地址与通用设置。
 */
export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000
});

export default apiClient;
