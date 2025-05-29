/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchCart } from "~/apis/endpoints";
import { updateCart } from "~/redux/cartSlice";

const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [carts, setCarts] = useState([]);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const handleGetCarts = () => {
    // Chỉ fetch cart khi user đã đăng nhập
    if (!currentUser) {
      setCarts([]);
      dispatch(updateCart([]));
      return;
    }

    setLoading(true);
    fetchCart()
      .then((res) => {
        setCarts(res || []);
        dispatch(updateCart(res || []));
      })
      .catch((error) => {
        console.log(error);
        // Không hiển thị toast error khi user chưa đăng nhập
        if (currentUser) {
          toast.error(error?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleGetCarts();
  }, [currentUser]); // Thêm currentUser vào dependency

  return { loading, carts, setCarts };
};

export default useCart;
