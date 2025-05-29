export const PAYMENT_METHODS = {
  MOMO: "MOMO",
  ZALOPAY: "ZALOPAY",
};

export const ORDER_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const ACCOUNT_ROLES = {
  ADMIN: "admin",
  CLIENT: "student",
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 8;

let apiRoot =
  "https://lms-cnnet-gjeydkc6e8h8esbx.southeastasia-01.azurewebsites.net";
// if (process.env.BUILD_MODE === "dev") {
//   apiRoot = "http://localhost:8017";
// }
// if (process.env.BUILD_MODE === "production") {
//   apiRoot = "https://trello-backend-wkjl.onrender.com";
// }
export const API_ROOT = apiRoot;
