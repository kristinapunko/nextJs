"use client";

import useBasketStore from "@/app/store/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearBasket = useBasketStore((state) => state.clearBasket);

  useEffect(() => {
    if (orderNumber) {
      clearBasket();
    }
  }, [orderNumber, clearBasket]);

  return (
    <div className="container text-center py-5">
      <div className="mb-4 p-2">
        <svg
          className="bg-success bg-opacity-10 rounded-5 text-success"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          height="64"
          width="64"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="fw-bold mb-3 text-success">Thank You for Your Order!</h2>

      <p className="text-muted mb-4">
        Your order has been confirmed and will be shipped shortly.
      </p>

      {orderNumber && (
        <div className="mb-3">
          <p className="mb-1 fw-medium">Order Number:</p>
          <p className="text-primary fw-semibold">{orderNumber}</p>
        </div>
      )}

      <p className="text-muted mb-4">
        A confirmation email has been sent to your registered email address.
      </p>

      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <Link href="/orders" passHref>
          <button className="btn btn-outline-primary">View Order Details</button>
        </Link>
        <Link href="/" passHref>
          <button className="btn btn-primary">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}

export default SuccessPage;
