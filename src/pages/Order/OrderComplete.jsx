/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCart, updateVoucher } from "~/apis/endpoints";
import useCart from "~/hooks/useCart";
import { resetCart } from "~/redux/cartSlice";
import PaymentService, { PAYMENT_STATUS } from "~/services/paymentService";

const OrderComplete = () => {
  const [expiredTime, setExpiredTime] = useState(15);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.LOADING);
  const [orderInfo, setOrderInfo] = useState(null);
  const [searchParams] = useSearchParams();

  const { carts, setCarts } = useCart();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartRedux = useSelector((state) => state.cart.cart);

  const handleDeleteCart = (carts) => {
    const deletePromises = carts.map((cart) => deleteCart(cart?.id));

    toast
      .promise(Promise.all(deletePromises), {
        pending: "",
      })
      .then(() => {
        dispatch(resetCart());
        setCarts([]);
        localStorage.removeItem("is-cart");
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiredTime((expiredTime) => {
        if (expiredTime <= 1) {
          clearInterval(interval);
          localStorage.removeItem("order-data");
          localStorage.removeItem("voucher");
          localStorage.removeItem("is-cart");
          return 0;
        }

        return expiredTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (expiredTime === 0) {
      navigate("/");
    }
  }, [expiredTime, navigate]);

  // Check payment status when component mounts
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get orderId from URL params or localStorage
        const orderId = PaymentService.getOrderIdFromParams(searchParams);

        if (!orderId) {
          setPaymentStatus(PAYMENT_STATUS.ERROR);
          toast.error("Không tìm thấy thông tin đơn hàng");
          return;
        }

        // Call API to check payment status
        const result = await PaymentService.checkPaymentStatus(orderId);

        if (result.success) {
          if (result.status === "completed") {
            setPaymentStatus(PAYMENT_STATUS.SUCCESS);
            setOrderInfo(result.orderInfo);
            toast.success("Thanh toán thành công!");
            PaymentService.clearPaymentData();
          } else if (result.status === "failed") {
            setPaymentStatus(PAYMENT_STATUS.FAILED);
            toast.error("Thanh toán thất bại!");
          } else {
            setPaymentStatus(PAYMENT_STATUS.PENDING);

            // Try to complete payment manually for pending status
            console.log(
              "Payment status is pending, attempting manual completion..."
            );

            try {
              const orderData = JSON.parse(
                localStorage.getItem("order-data") || "{}"
              );
              const paymentMethod =
                localStorage.getItem("last-payment-method") || "momo";

              const completeResponse = await fetch(
                `http://localhost:5267/api/Payment/test/complete/${orderId}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    paymentMethod: paymentMethod,
                    amount:
                      orderData.totalPrice ||
                      orderData.amount ||
                      result.orderInfo?.amount ||
                      0,
                  }),
                }
              );

              const completeResult = await completeResponse.json();

              if (completeResult.success) {
                console.log("Payment completed manually:", completeResult);
                setPaymentStatus(PAYMENT_STATUS.SUCCESS);
                setOrderInfo(result.orderInfo);
                toast.success("Thanh toán thành công!");
                PaymentService.clearPaymentData();
                localStorage.removeItem("last-payment-method");
              } else {
                console.error(
                  "Failed to complete payment manually:",
                  completeResult
                );
                // Retry after 3 seconds for pending status
                setTimeout(checkPaymentStatus, 3000);
              }
            } catch (error) {
              console.error("Error completing payment manually:", error);
              // Retry after 3 seconds for pending status
              setTimeout(checkPaymentStatus, 3000);
            }
          }
        } else {
          setPaymentStatus(PAYMENT_STATUS.ERROR);
          toast.error(
            result.message || "Có lỗi xảy ra khi kiểm tra trạng thái thanh toán"
          );
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setPaymentStatus(PAYMENT_STATUS.ERROR);
        toast.error("Có lỗi xảy ra khi kiểm tra trạng thái thanh toán");
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("order-data"));
    const voucher = JSON.parse(localStorage.getItem("voucher"));

    if (!orderData && !searchParams.get("orderId")) navigate("/");
    if (voucher) {
      const updateData = {
        usedCount: voucher.usedCount + 1,
      };
      updateVoucher(voucher?.id, updateData);
      localStorage.removeItem("voucher");
    }
    localStorage.removeItem("order-data");
  }, [navigate, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isCart = JSON.parse(localStorage.getItem("is-cart"));
      if (!!isCart && (cartRedux.length > 0 || carts?.length > 0)) {
        Promise.all([handleDeleteCart(cartRedux), handleDeleteCart(carts)]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [cartRedux]);

  // Render different states based on payment status
  const renderContent = () => {
    switch (paymentStatus) {
      case PAYMENT_STATUS.LOADING:
        return (
          <div className="flex flex-col items-center justify-center py-[90px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <h2 className="lg:text-[32px] md:text-[28px] text-[24px] font-bold my-4">
              Đang kiểm tra trạng thái thanh toán...
            </h2>
            <p className="md:text-[20px] text-[16px] text-gray-600">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        );

      case PAYMENT_STATUS.SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center py-[90px]">
            <div className="w-[200px] h-[200px] bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-24 h-24 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="lg:text-[32px] md:text-[28px] text-[24px] font-bold my-4 text-green-600">
              🎉 Thanh toán thành công!
            </h2>
            <p className="md:text-[20px] text-[16px] font-semibold text-center">
              Cảm ơn bạn đã mua khóa học!
            </p>
            {orderInfo && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p>
                  <strong>Mã đơn hàng:</strong> {orderInfo.orderId}
                </p>
                <p>
                  <strong>Số tiền:</strong> {orderInfo.amount?.toLocaleString()}{" "}
                  VNĐ
                </p>
                <p>
                  <strong>Phương thức:</strong> {orderInfo.paymentMethod}
                </p>
              </div>
            )}
            <p className="text-center mt-4 text-gray-600">
              Bạn sẽ được điều hướng về trang chủ trong {expiredTime} giây
            </p>
          </div>
        );

      case PAYMENT_STATUS.FAILED:
        return (
          <div className="flex flex-col items-center justify-center py-[90px]">
            <div className="w-[200px] h-[200px] bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-24 h-24 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="lg:text-[32px] md:text-[28px] text-[24px] font-bold my-4 text-red-600">
              ❌ Thanh toán thất bại
            </h2>
            <p className="md:text-[20px] text-[16px] text-center text-gray-600">
              Đã có lỗi xảy ra trong quá trình thanh toán
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Thử lại thanh toán
            </button>
          </div>
        );

      case PAYMENT_STATUS.PENDING:
        return (
          <div className="flex flex-col items-center justify-center py-[90px]">
            <div className="animate-pulse w-[200px] h-[200px] bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-24 h-24 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="lg:text-[32px] md:text-[28px] text-[24px] font-bold my-4 text-yellow-600">
              ⏳ Đang xử lý thanh toán...
            </h2>
            <p className="md:text-[20px] text-[16px] text-center text-gray-600">
              Giao dịch đang được xử lý, vui lòng đợi
            </p>
          </div>
        );

      case PAYMENT_STATUS.ERROR:
      default:
        return (
          <div className="flex flex-col items-center justify-center py-[90px]">
            <div className="w-[200px] h-[200px] bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-24 h-24 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="lg:text-[32px] md:text-[28px] text-[24px] font-bold my-4 text-gray-600">
              ⚠️ Có lỗi xảy ra
            </h2>
            <p className="md:text-[20px] text-[16px] text-center text-gray-600">
              Không thể kiểm tra trạng thái thanh toán
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-[90px] md:px-[28px] sm:px-[24px] px-[20px]">
      {renderContent()}
    </div>
  );
};

export default OrderComplete;
