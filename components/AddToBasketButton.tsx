"use client";

import useBasketStore from "@/app/store/store";
import { Product } from "@/sanity.types";
import { useEffect, useState } from "react";

interface AddToBasketButtonProps {
  product: Product;
  disabled?: boolean;
}

const AddToBasketButton = ({ product, disabled }: AddToBasketButtonProps) => {
  const { addItem, removeItem, getItemCount } = useBasketStore();
  const itemCount = getItemCount(product._id);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center gap-2">
      <button
        type="button"
        className="btn btn-outline-dark rounded-5 px-3 py-2"
        onClick={() => removeItem(product._id)}
        disabled={itemCount === 0 || disabled}
        aria-label="Remove one item"
      >
        −
      </button>

      <span className="fw-bold mx-2">{itemCount}</span>

      <button
        type="button"
        className="btn btn-dark rounded-5 px-3 py-2"
        onClick={() => addItem(product)}
        disabled={disabled}
        aria-label="Add one item"
      >
        +
      </button>
    </div>
  );
};

export default AddToBasketButton;
