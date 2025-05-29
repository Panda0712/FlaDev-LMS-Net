import { isArray } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "~/components/Button/Button";
import CheckoutDetails from "~/pages/Order/CheckoutDetails/CheckoutDetails";
import CheckoutNote from "~/pages/Order/CheckoutNote/CheckoutNote";
import CheckoutPrice from "~/pages/Order/CheckoutPrice/CheckoutPrice";
import CheckoutRadio from "~/pages/Order/CheckoutRadio/CheckoutRadio";
import PaymentService from "~/services/paymentService";
import { createOrder } from "~/apis/endpoints";
import { PAYMENT_METHODS } from "~/utils/constants";

const OrderCheckout = () => {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.MOMO);

  const orderData = JSON.parse(localStorage.getItem("order-data"));
  const navigate = useNavigate();

  // Debug orderData structure
  console.log("OrderData from localStorage:", orderData);

  const handleChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán!!!");
      return;
    }

    try {
      const courseData = isArray(orderData)
        ? orderData[0] // Take first order if array
        : orderData;

      console.log("Course data for order creation:", courseData);

      // Step 1: Create order first
      const orderCreateData = {
        courseId: courseData.courseId,
        userEmail: courseData.userEmail,
        userName: courseData.userName,
        courseName: courseData.courseName,
        courseThumbnail: courseData.courseThumbnail,
        instructor: courseData.instructor,
        totalPrice: courseData.totalPrice,
        paymentMethod: paymentMethod,
      };

      console.log("Creating order with data:", orderCreateData);
      const createdOrder = await createOrder(orderCreateData);
      console.log("Order created successfully:", createdOrder);

      // Step 2: Create payment for the created order
      const paymentData = {
        ...courseData,
        id: createdOrder.id, // Use the real order ID
        orderId: createdOrder.id, // Explicitly set orderId
      };

      console.log("Creating payment with order data:", paymentData);

      // Store payment method for later use
      localStorage.setItem("last-payment-method", paymentMethod);

      let result;
      if (paymentMethod === PAYMENT_METHODS.MOMO) {
        result = await PaymentService.createMoMoPayment(paymentData);
      } else {
        result = await PaymentService.createZaloPayPayment(paymentData);
      }

      if (result.success) {
        PaymentService.redirectToPayment(result.paymentUrl);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại!");
      }
    }
  };

  useEffect(() => {
    if (!orderData) navigate("/");
  }, [navigate, orderData]);

  return (
    <section className="lg:px-28 md:px-24 sm:px-18 px-12 pt-[32px] pb-[90px]">
      <h3 className="lg:text-[32px] md:text-[28px] text-[24px] font-semibold mb-5">
        Thanh toán
      </h3>

      <div
        className="relative flex max-md:flex-col
      gap-5 justify-between basis-[100%]"
      >
        <div className="flex flex-col basis-[calc(60%-10px)] max-md:mb-12">
          <h6 className="md:text-[24px] text-[20px] font-semibold mb-4">
            Phương thức thanh toán:
          </h6>
          <CheckoutRadio
            paymentMethod={paymentMethod}
            handleChange={handleChange}
          />

          <CheckoutNote />
        </div>

        <div className="w-[1px] max-md:hidden h-auto bg-slate-300" />

        <div className="flex flex-col basis-[calc(30%-10px)]">
          <h4 className="md:text-[24px] text-[20px] font-semibold mb-4">
            Chi tiết đơn hàng
          </h4>

          <CheckoutDetails courseInfo={orderData} />

          <CheckoutPrice courseInfo={orderData} />

          <Button
            onClick={handlePayment}
            title="Thanh toán"
            type="cart"
            style="mt-5"
          />
        </div>
      </div>
    </section>
  );
};

export default OrderCheckout;
