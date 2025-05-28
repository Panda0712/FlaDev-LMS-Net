import { API_ROOT } from "~/utils/constants";
import api from "./api";

// Admin
export const getUsersAdmin = async () => {
  const res = await api.get("/Admin/users");
  return res.data;
};

export const updateUserRole = async (id, data) => {
  const res = await api.put(`/Admin/users/${id}/role`, data);
  return res.data;
};

export const getDashboardStatistic = async () => {
  const res = await api.get("/Admin/dashboard/stats");
  return res.data;
};

export const createNewUser = async (data) => {
  const res = await api.post("/Admin/users/create", data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/Admin/users/${id}`);
  return res.data;
};

// Courses
export const fetchCourses = async () => {
  const res = await api.get("/Course");
  return res.data;
};

export const fetchCourseById = async (id) => {
  const res = await api.get(`/Course/${id}`);
  return res.data;
};

export const createCourse = async (data) => {
  const res = await api.post("/Course", data);
  return res.data;
};

export const updateCourse = async (id, data) => {
  const res = await api.put(`/Course/${id}`, data);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await api.delete(`/Course/${id}`);
  return res.data;
};

// Reviews
export const fetchReviews = async () => {
  const res = await api.get("/Review");
  return res.data;
};

export const createReview = async (data) => {
  const res = await api.post("/Review", data);
  return res.data;
};

export const fetchReviewsByCourseId = async (courseId) => {
  const res = await api.get(`/Review/course/${courseId}`);
  return res.data;
};

export const updateReview = async (id, data) => {
  const res = await api.put(`/Review/${id}`, data);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/Review/${id}`);
  return res.data;
};

// Blogs
export const fetchBlogs = async () => {
  const res = await api.get("/Blog");
  return res.data;
};

export const fetchBlogById = async (id) => {
  const res = await api.get(`/Blog/${id}`);
  return res.data;
};

export const createBlog = async (data) => {
  const res = await api.post("/Blog", data);
  return res.data;
};

export const updateBlog = async (id, data) => {
  const res = await api.put(`/Blog/${id}`, data);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/Blog/${id}`);
  return res.data;
};

// Contacts
export const fetchContacts = async () => {
  const res = await api.get("/Contact");
  return res.data;
};

export const createContact = async (data) => {
  const res = await api.post("/Contact", data);
  return res.data;
};

export const deleteContact = async (id) => {
  const res = await api.delete(`/Contact/${id}`);
  return res.data;
};

// Orders
export const fetchOrders = async () => {
  const res = await api.get("/Order");
  return res.data;
};

export const fetchOrderById = async (id) => {
  const res = await api.get(`/Order/${id}`);
  return res.data;
};

export const fetchOrdersAdmin = async () => {
  const res = await api.get("/Order/admin");
  return res.data;
};

export const createOrder = async (data) => {
  const res = await api.post("/Order", data);
  return res.data;
};

export const updateOrder = async (id, data) => {
  const res = await api.put(`/Order/${id}`, data);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await api.delete(`/Order/${id}`);
  return res.data;
};

// Vouchers
export const fetchVouchers = async () => {
  const res = await api.get("/Voucher");
  return res.data;
};

export const createVoucher = async (data) => {
  const res = await api.post("/Voucher", data);
  return res.data;
};

export const updateVoucher = async (id, data) => {
  const res = await api.put(`/Voucher/${id}`, data);
  return res.data;
};

export const fetchVoucherByName = async ({ name }) => {
  const res = await api.get("/Voucher/find-by-name", {
    params: { name },
  });
  return res.data;
};

export const deleteVoucher = async (id) => {
  const res = await api.delete(`/Voucher/${id}`);
  return res.data;
};

// Cart
export const fetchCart = async () => {
  const res = await api.get("/Cart");
  return res.data;
};

export const addToCart = async (data) => {
  const res = await api.post("/Cart", data);
  return res.data;
};

export const updateCart = async (id, data) => {
  const res = await api.put(`/Cart/${id}`, data);
  return res.data;
};

export const deleteCart = async (id) => {
  const res = await api.delete(`/Cart/${id}`);
  return res.data;
};

export const findCartByUserAndCourse = async (courseId) => {
  const res = await api.get(`/Cart/find-by-user-and-course`, {
    params: { courseId },
  });
  return res.data;
};

// Wishlist
export const fetchWishlist = async () => {
  const res = await api.get("/Wishlist");
  return res.data;
};

export const addToWishlist = async (data) => {
  const res = await api.post("/Wishlist", data);
  return res.data;
};

export const updateWishlist = async (id, data) => {
  const res = await api.put(`/Wishlist/${id}`, data);
  return res.data;
};

export const deleteWishlist = async (id) => {
  const res = await api.delete(`/Wishlist/${id}`);
  return res.data;
};

// Profile/User
export const fetchUserProfile = async () => {
  const res = await api.get("/User");
  return res.data;
};

export const updateUserProfile = async (id, data) => {
  const res = await api.put(`/User/${id}`, data);
  return res.data;
};

// Auth
export const login = async (data) => {
  const res = await api.post("/Auth/login", data);
  return res.data;
};

export const register = async (data) => {
  const res = await api.post("/Auth/register", data);
  return res.data;
};

export const getCurrentAuth = async () => {
  const res = await api.get("/Auth/current");
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/Auth/logout");
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await api.post("/Auth/reset-password-temp", data);
  return res.data;
};

// Media
export const uploadMedia = async (data) => {
  const res = await api.post("/Media/upload", data);
  return res.data;
};

export const uploadUserImage = async (data) => {
  const res = await api.post("Media/users/uploads", data);
  return res.data;
};

export const uploadBlogImageAPI = async (data) => {
  const res = await api.post("Media/blogs/uploads", data);
  return res.data;
};

export const uploadCourseImageAPI = async (data) => {
  const res = await api.post("Media/courses/uploads", data);
  return res.data;
};

export const uploadCourseVideoAPI = async (data) => {
  const res = await api.post("Media/courses/uploads-videos", data);
  return res.data;
};

// Progress
export const fetchCourseProgress = async (courseId) => {
  const res = await api.get(`/Progress/${courseId}`, { params: { courseId } });
  return res.data;
};

export const fetchAllProgress = async () => {
  const res = await api.get("/Progress");
  return res.data;
};

export const updateLessonProgress = async (data) => {
  const res = await api.post("/Progress/update-lesson", data);
  return res.data;
};

export const initCourseProgress = async (data) => {
  const res = await api.post("/Progress/init", data);
  return res.data;
};

// Momo Payment
export const momoPaymentAPI = async (data) => {
  const res = await api.post(`${API_ROOT}/v1/payment/momo`, data);
  return res.data;
};

// Zalopay Payment
export const zaloPaymentAPI = async (data) => {
  const res = await api.post(`${API_ROOT}/v1/payment/zalopay`, data);
  return res.data;
};

// Create new notification
export const createNewNotificationAPI = async (data) => {
  const res = await api.post(`${API_ROOT}/v1/notifications`, data);
  return res.data;
};

// Upload hotel notification image
export const uploadLMSNotificationImageAPI = async (data) => {
  const res = await api.post(`${API_ROOT}/v1/notifications/uploads`, data);
  return res.data;
};

// Update notification
export const updateNotificationAPI = async (notificationId, updateData) => {
  const res = await api.put(
    `${API_ROOT}/v1/notifications/${notificationId}`,
    updateData
  );
  return res.data;
};

// Delete notification
export const deleteNotificationAPI = async (notificationId) => {
  const res = await api.delete(
    `${API_ROOT}/v1/notifications/${notificationId}`
  );
  return res.data;
};
