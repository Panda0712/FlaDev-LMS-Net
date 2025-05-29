import { createPaymentAPI, getPaymentStatusAPI } from "~/apis/endpoints";

/**
 * Payment Service - Handles all payment-related operations
 */
export class PaymentService {
  /**
   * Create a payment request
   * @param {Object} orderData - Order data from localStorage or props
   * @param {string} paymentMethod - 'momo' or 'zalopay'
   * @returns {Promise<Object>} Payment response with paymentUrl
   */
  static async createPayment(orderData, paymentMethod) {
    try {
      // Debug orderData structure
      console.log("OrderData received:", orderData);

      // Extract orderId with multiple fallbacks
      const orderId =
        orderData.id ||
        orderData.orderId ||
        orderData.order_id ||
        orderData.orderID;

      // Validate that we have a real order ID
      if (!orderId) {
        throw new Error("Order ID is required. Please create an order first.");
      }

      const amount =
        orderData.totalPrice ||
        orderData.amount ||
        orderData.total_price ||
        orderData.price ||
        0;

      const courseName =
        orderData.courseName ||
        orderData.course_name ||
        orderData.title ||
        orderData.name ||
        "LMS Course";

      console.log("Extracted values:", { orderId, amount, courseName });

      if (!amount || amount === 0) {
        throw new Error("Amount is required and must be greater than 0");
      }

      const paymentRequest = {
        orderId: orderId,
        amount: amount,
        description: `Thanh toán khóa học ${courseName}`,
        returnUrl: `${window.location.origin}/order-complete?orderId=${orderId}`,
        notifyUrl: `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5267"
        }/api/Payment/${paymentMethod}/callback`,
        paymentMethod: paymentMethod.toLowerCase(),
      };

      console.log("Creating payment with data:", paymentRequest);

      const response = await createPaymentAPI(paymentRequest);

      console.log("Payment API response:", response);

      if (response.success && response.paymentUrl) {
        // Store order ID for OrderComplete page
        localStorage.setItem("current-order-id", paymentRequest.orderId);
        return {
          success: true,
          paymentUrl: response.paymentUrl,
          transactionId: response.transactionId,
          message: response.message,
        };
      } else {
        console.error("Payment failed:", response);
        return {
          success: false,
          message:
            response.message ||
            `Không thể tạo thanh toán ${paymentMethod.toUpperCase()}`,
        };
      }
    } catch (error) {
      console.error(`${paymentMethod} payment error:`, error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      let errorMessage = `Lỗi khi tạo thanh toán ${paymentMethod.toUpperCase()}`;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Create MoMo payment
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Payment response
   */
  static async createMoMoPayment(orderData) {
    return this.createPayment(orderData, "momo");
  }

  /**
   * Create ZaloPay payment
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Payment response
   */
  static async createZaloPayPayment(orderData) {
    return this.createPayment(orderData, "zalopay");
  }

  /**
   * Check payment status
   * @param {string|number} orderId - Order ID
   * @returns {Promise<Object>} Payment status response
   */
  static async checkPaymentStatus(orderId) {
    try {
      const response = await getPaymentStatusAPI(orderId);
      return {
        success: true,
        status: response.status,
        orderInfo: response,
      };
    } catch (error) {
      console.error("Error checking payment status:", error);
      return {
        success: false,
        status: "error",
        message: error.message,
      };
    }
  }

  /**
   * Handle payment redirect
   * @param {string} paymentUrl - Payment URL from gateway
   */
  static redirectToPayment(paymentUrl) {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      throw new Error("Payment URL is required");
    }
  }

  /**
   * Get order ID from URL params or localStorage
   * @param {URLSearchParams} searchParams - URL search params
   * @returns {string|null} Order ID
   */
  static getOrderIdFromParams(searchParams) {
    return (
      searchParams.get("orderId") || localStorage.getItem("current-order-id")
    );
  }

  /**
   * Clear stored payment data
   */
  static clearPaymentData() {
    localStorage.removeItem("current-order-id");
    localStorage.removeItem("order-data");
  }
}

/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  FAILED: "failed",
  PENDING: "pending",
  ERROR: "error",
};

/**
 * Payment method constants
 */
export const PAYMENT_METHODS = {
  MOMO: "momo",
  ZALOPAY: "zalopay",
};

export default PaymentService;
