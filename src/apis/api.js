import axios from "axios";

// Các URL API có thể sử dụng:
// "http://127.0.0.1:8000/api"
// "http://localhost:5174/api"

const API_BASE_URL =
  import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5267/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Danh sách các endpoint KHÔNG cần xác thực (public)
    const publicEndpoints = [
      "/Review",
      "/Review/course/",
      "/Course",
      "/Course/",
      "/Blog",
      "/Blog/",
      "/Auth/login",
      "/Auth/register",
      "/Auth/forgot-password",
      "/Auth/reset-password",
    ];

    // Kiểm tra xem request hiện tại có phải là endpoint public không
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.startsWith(endpoint)
    );

    // Trường hợp đặc biệt: Course endpoints - chỉ GET requests là public
    const isCourseEndpoint = config.url?.startsWith("/Course");
    const isGetRequest = config.method?.toLowerCase() === "get";

    // Chỉ thêm token cho các endpoint không phải public
    // Ngoại lệ: Course endpoints cần token cho các request không phải GET
    if (token && (!isPublicEndpoint || (isCourseEndpoint && !isGetRequest))) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
