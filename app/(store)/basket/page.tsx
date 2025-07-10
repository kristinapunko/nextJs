"use client";

import { createCheckoutSession } from "@/actions/createCheckoutSession";
import useBasketStore from "@/app/store/store";
import AddToBasketButton from "@/components/AddToBasketButton";
import Loader from "@/components/Loader";
import { imageUrl } from "@/sanity/lib/imageUrl";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

function BasketPage() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  if (groupedItems.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="fw-bold mb-3">Your Basket</h1>
        <p className="text-muted">Your basket is currently empty.</p>
      </div>
    );
  }

  const handleChekout = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0].emailAddress ?? "unknown",
        clerkUserId: user!.id,
      };

      const chekoutUrl = await createCheckoutSession(groupedItems, metadata);
      if (typeof chekoutUrl === "string") {
        window.location.href = chekoutUrl;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container rounded-2 p-5 shadow-lg mt-5">
      <h1 className="fw-bold mb-4">Your Basket</h1>

      <div>
      {
  groupedItems?.length > 0 ? (
    groupedItems.map((item, index) => (
      <div
        key={`${item.product._id}-${index}`}
        className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 product-item"
        role="listitem"
      >
        <div
          className="d-flex align-items-center cursor-pointer product-info"
          onClick={() => router.push(`/product/${item.product.slug?.current || ""}`)}
          onKeyDown={(e) => e.key === "Enter" && router.push(`/product/${item.product.slug?.current || ""}`)}
          role="button"
          tabIndex={0}
          aria-label={`View details for ${item.product.name ?? "product"}`}
        >
          {item.product.image ? (
            <Image
              src={imageUrl(item.product.image).url()}
              alt={item.product.name ?? "product"}
              width={80}
              height={80}
              className="me-3 rounded shadow-sm product-image"
              loading="lazy"
            />
          ) : (
            <div className="me-3 rounded shadow-sm bg-light placeholder-image" />
          )}
          <div className="product-details">
            <h6 className="mb-1 fw-semibold text-dark">{item.product.name ?? "Unnamed Product"}</h6>
            <p className="mb-0 text-muted small">
              Price:{" "}
              <strong>
              {((item.product.price ?? 0) * item.quantity).toFixed(2)}              </strong>
            </p>
            <p className="mb-0 text-muted small">Quantity: {item.quantity}</p>
          </div>
        </div>
        <div className="product-actions">
          <AddToBasketButton product={item.product} />
        </div>
      </div>
    ))
  ) : (
    <p className="text-muted text-center">No products available.</p>
  )
}
</div>

      <div className="mt-5 p-4 rounded bg-light border">
        <h3 className="fw-semibold mb-3">Order Summary</h3>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Items:</span>
          <span>
            {groupedItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </div>
        <div className="d-flex justify-content-between fw-semibold fs-5 mb-4">
          <span>Total:</span>
          <span>
            ${useBasketStore.getState().getTotalPrice().toFixed(2)}
          </span>
        </div>

        {isSignedIn ? (
          <button
            className="btn btn-primary w-100"
            onClick={handleChekout}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Checkout"}
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="btn btn-outline-primary w-100">
              Sign in to Checkout
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

export default BasketPage;
