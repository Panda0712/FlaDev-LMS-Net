import axios from "axios";

// Các URL API có thể sử dụng:
// "http://127.0.0.1:8000/api"
// "http://localhost:5174/api"

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "/api"; // Use Vite proxy in development

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Temporarily disable for CORS fix
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Danh sách các endpoint KHÔNG cần xác thực (public) - chỉ cho GET requests
    const publicGetEndpoints = [
      "/Review",
      "/Review/course/",
      "/Course",
      "/Course/",
      "/Blog",
      "/Blog/",
    ];

    // Danh sách các endpoint hoàn toàn public (tất cả methods)
    const fullyPublicEndpoints = [
      "/Auth/login",
      "/Auth/register",
      "/Auth/forgot-password",
      "/Auth/reset-password",
    ];

    const isGetRequest = config.method?.toLowerCase() === "get";

    // Kiểm tra xem request có phải là endpoint hoàn toàn public không
    const isFullyPublicEndpoint = fullyPublicEndpoints.some((endpoint) =>
      config.url?.startsWith(endpoint)
    );

    // Kiểm tra xem request có phải là GET request cho endpoint public không
    const isPublicGetEndpoint =
      isGetRequest &&
      publicGetEndpoints.some((endpoint) => config.url?.startsWith(endpoint));

    // Chỉ thêm token nếu:
    // 1. Có token
    // 2. Không phải endpoint hoàn toàn public
    // 3. Không phải GET request cho endpoint public
    if (token && !isFullyPublicEndpoint && !isPublicGetEndpoint) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
