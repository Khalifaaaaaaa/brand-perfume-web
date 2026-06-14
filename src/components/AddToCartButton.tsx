"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "../lib/data";
import { useCart } from "./CartProvider";
import { useInventory } from "./InventoryProvider";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  label?: string;
  unavailableLabel?: string;
  showHelperText?: boolean;
}

export default function AddToCartButton({
  product,
  className = "",
  label = "Add to Bag",
  unavailableLabel = "Unavailable",
  showHelperText = false,
}: AddToCartButtonProps) {
  const { addToCart, getItemQuantity } = useCart();
  const { getProductWithInventory } = useInventory();
  const [feedback, setFeedback] = useState("");
  const [feedbackIsError, setFeedbackIsError] = useState(false);

  const productWithInventory = getProductWithInventory(product);
  const currentCartQuantity = getItemQuantity(productWithInventory.code);
  const isOutOfStock = !productWithInventory.isAvailable || productWithInventory.stock <= 0;
  const stockLimitReached = currentCartQuantity >= productWithInventory.stock && productWithInventory.stock > 0;
  const isDisabled = isOutOfStock || stockLimitReached;

  const handleAddToCart = () => {
    const result = addToCart(productWithInventory);

    setFeedback(result.message);
    setFeedbackIsError(!result.ok);

    window.setTimeout(() => {
      setFeedback("");
      setFeedbackIsError(false);
    }, 1600);
  };

  const buttonText = isOutOfStock
    ? unavailableLabel
    : stockLimitReached
      ? "Max Stock"
      : feedback || label;

  return (
    <div>
      <motion.button
        type="button"
        whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        disabled={isDisabled}
        onClick={handleAddToCart}
        className={className}
      >
        {buttonText}
      </motion.button>

      {showHelperText ? (
        <p className={`mt-4 text-xs leading-6 ${feedbackIsError ? "text-red-500" : "text-neutral-400"}`}>
          {feedback || "Cart uses localStorage for prototype testing. Backend inventory sync will be added later."}
        </p>
      ) : null}
    </div>
  );
}