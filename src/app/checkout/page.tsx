"use client";

import React, { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Upload } from "lucide-react";
import { useCart } from "../../components/CartProvider";
import { useInventory } from "../../components/InventoryProvider";
import {
  createOrderId,
  createOrderItems,
  savePrototypeOrder,
  type PaymentMethod,
  type PrototypeOrder,
  type ReceiptInfo, 
} from "../../lib/orders";

const formatCurrency = (value: number) => `₱${value.toLocaleString("en-PH")}`;

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export default function CheckoutPage() {
  const { items, totalItems, subtotal, hasHydrated, clearCart } = useCart();
  const { deductStockForCheckout } = useInventory();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash on Delivery");
  const [receiptInfo, setReceiptInfo] = useState<ReceiptInfo | null>(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PrototypeOrder | null>(null);

  const orderItems = useMemo(() => createOrderItems(items), [items]);

  const handleReceiptUpload = (file: File | undefined) => {
    setFormError("");

    if (!file) {
      setReceiptInfo(null);
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setReceiptInfo(null);
      setFormError("For prototype localStorage testing, please upload a receipt smaller than 1.5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setReceiptInfo({
        fileName: file.name,
        fileType: file.type || "Unknown file type",
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        dataUrl: String(reader.result),
      });
    };

    reader.onerror = () => {
      setReceiptInfo(null);
      setFormError("Receipt upload failed. Please try another file.");
    };

    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (items.length === 0) {
      return "Your cart is empty.";
    }

    if (!fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!address.trim()) {
      return "Please enter your complete address.";
    }

    if (paymentMethod === "GCash" && !receiptInfo) {
      return "Please upload your GCash receipt before submitting.";
    }

    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    const orderId = createOrderId();
    const stockResult = deductStockForCheckout(
      items.map((item) => ({
        code: item.code,
        quantity: item.quantity,
      })),
      orderId,
    );

    if (!stockResult.ok) {
      setFormError(stockResult.message);
      setIsSubmitting(false);
      return;
    }

    const order: PrototypeOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      },
      items: orderItems,
      totalItems,
      subtotal,
      total: subtotal,
      paymentMethod,
      receipt: paymentMethod === "GCash" ? receiptInfo : null,
      status: "Pending",
      prototypeNotice:
        "This order is stored only in this browser through localStorage. A real backend/database is required before public launch.",
    };

    try {
      savePrototypeOrder(order);
      clearCart();
      setCompletedOrder(order);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError(
        "Order could not be saved locally. If you uploaded a large receipt, try a smaller file. Real receipt storage needs backend file storage.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasHydrated) {
    return (
      <main className="min-h-[calc(100vh-116px)] bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Loading Checkout</p>
          <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Preparing your order.
          </h1>
        </section>
      </main>
    );
  }

  if (completedOrder) {
    return (
      <main className="bg-white px-6 py-20 text-neutral-950 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neutral-950/10">
            <Check size={30} strokeWidth={1.4} />
          </div>

          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Order Submitted</p>

          <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
            Your prototype order has been saved locally. Please record the order ID below for testing.
          </p>

          <div className="mx-auto mt-10 max-w-2xl border border-neutral-950/10 p-6 text-left">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">Order ID</p>
            <p className="mt-3 font-serif text-2xl tracking-[-0.03em] text-neutral-950">{completedOrder.id}</p>

            <div className="mt-6 grid gap-5 border-t border-neutral-950/10 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">Customer</p>
                <p className="mt-2 text-sm text-neutral-700">{completedOrder.customer.fullName}</p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">Payment</p>
                <p className="mt-2 text-sm text-neutral-700">{completedOrder.paymentMethod}</p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">Items</p>
                <p className="mt-2 text-sm text-neutral-700">{completedOrder.totalItems}</p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">Total</p>
                <p className="mt-2 text-sm text-neutral-700">{formatCurrency(completedOrder.total)}</p>
              </div>
            </div>

            {completedOrder.receipt ? (
              <a
                href={completedOrder.receipt.dataUrl}
                download={completedOrder.receipt.fileName}
                className="mt-6 inline-flex text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500 underline underline-offset-4 transition duration-300 hover:text-neutral-950"
              >
                Download uploaded receipt
              </a>
            ) : null}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/#shop"
              className="inline-flex items-center justify-center bg-neutral-950 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition duration-300 hover:bg-neutral-800"
            >
              Continue Shopping
            </Link>

            <Link
              href="/cart"
              className="inline-flex items-center justify-center border border-neutral-950 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-950 transition duration-300 hover:bg-neutral-950 hover:text-white"
            >
              View Cart
            </Link>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-xs leading-6 text-neutral-400">
            Prototype note: this order, receipt, and inventory deduction exist only in this browser. Real public checkout
            requires backend API routes, database storage, file storage, and authentication.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white px-6 py-20 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="border-b border-neutral-950/10 pb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Checkout</p>

          <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Complete your order.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
            No login required. Enter your delivery details and choose GCash or Cash on Delivery.
          </p>
        </header>

        {items.length === 0 ? (
          <section className="mx-auto max-w-3xl py-24 text-center">
            <h2 className="font-serif text-3xl tracking-[-0.04em] text-neutral-950">Your cart is empty.</h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-500">
              Add at least one fragrance before checking out.
            </p>

            <Link
              href="/#shop"
              className="mt-10 inline-flex items-center justify-center border border-neutral-950 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-950 transition duration-300 hover:bg-neutral-950 hover:text-white"
            >
              Return to Shop
            </Link>
          </section>
        ) : (
          <div className="grid gap-12 py-12 lg:grid-cols-[1fr_420px]">
            <form onSubmit={handleSubmit} className="space-y-10">
              <section className="border border-neutral-950/10 p-6 sm:p-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">
                  Customer Details
                </p>

                <div className="mt-8 grid gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-500"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="mt-3 w-full border border-neutral-950/10 px-4 py-4 text-sm outline-none transition duration-300 focus:border-neutral-950"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-500"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="mt-3 w-full border border-neutral-950/10 px-4 py-4 text-sm outline-none transition duration-300 focus:border-neutral-950"
                      placeholder="09XXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-500"
                    >
                      Complete Address
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      className="mt-3 min-h-32 w-full resize-y border border-neutral-950/10 px-4 py-4 text-sm outline-none transition duration-300 focus:border-neutral-950"
                      placeholder="House number, street, barangay, city, province"
                    />
                  </div>
                </div>
              </section>

              <section className="border border-neutral-950/10 p-6 sm:p-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Payment Method</p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {(["Cash on Delivery", "GCash"] as PaymentMethod[]).map((method) => (
                    <label
                      key={method}
                      className={`cursor-pointer border px-5 py-5 transition duration-300 ${
                        paymentMethod === method
                          ? "border-neutral-950 bg-neutral-950 text-white"
                          : "border-neutral-950/10 text-neutral-600 hover:border-neutral-950"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => {
                          setPaymentMethod(method);
                          setFormError("");
                        }}
                        className="sr-only"
                      />
                      <span className="text-[11px] font-medium uppercase tracking-[0.26em]">{method}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === "GCash" ? (
                  <div className="mt-8 border border-neutral-950/10 bg-neutral-50 p-5">
                    <label
                      htmlFor="receipt"
                      className="flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-neutral-950/20 bg-white px-5 py-8 text-center transition duration-300 hover:border-neutral-950"
                    >
                      <Upload size={24} strokeWidth={1.4} className="text-neutral-500" />
                      <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-neutral-600">
                        Upload GCash Receipt
                      </span>
                      <span className="text-xs leading-6 text-neutral-400">
                        Required for GCash. Use a small image/file for prototype testing.
                      </span>
                    </label>

                    <input
                      id="receipt"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => handleReceiptUpload(event.target.files?.[0])}
                      className="sr-only"
                    />

                    {receiptInfo ? (
                      <div className="mt-5 border border-neutral-950/10 bg-white p-4">
                        <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">
                          Receipt Uploaded
                        </p>
                        <p className="mt-2 text-sm text-neutral-700">{receiptInfo.fileName}</p>
                        <p className="mt-1 text-xs text-neutral-400">{formatFileSize(receiptInfo.fileSize)}</p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-6 text-sm leading-7 text-neutral-500">
                    Cash on Delivery orders can be submitted without a receipt upload.
                  </p>
                )}
              </section>

              {formError ? (
                <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-600">
                  {formError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-950 px-8 py-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition duration-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-950/40 sm:w-auto"
              >
                {isSubmitting ? "Submitting Order..." : "Submit Order"}
              </button>
            </form>

            <aside className="h-fit border border-neutral-950/10 p-6 lg:sticky lg:top-36">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Order Summary</p>

              <div className="mt-8 space-y-5">
                {items.map((item) => (
                  <div key={item.code} className="grid grid-cols-[70px_1fr] gap-4 border-b border-neutral-950/10 pb-5">
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="70px" />
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-400">
                        {item.code}
                      </p>
                      <p className="mt-2 font-serif text-lg leading-tight tracking-[-0.03em] text-neutral-950">
                        {item.name}
                      </p>
                      <p className="mt-2 text-sm text-neutral-500">
                        {item.quantity} × {formatCurrency(item.priceValue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-5 border-b border-neutral-950/10 pb-6 text-sm text-neutral-500">
                <div className="flex items-center justify-between gap-4">
                  <span>Items</span>
                  <span className="text-neutral-950">{totalItems}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="text-neutral-950">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Payment</span>
                  <span className="text-neutral-950">{paymentMethod}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">Grand Total</span>
                <span className="font-serif text-2xl tracking-[-0.03em]">{formatCurrency(subtotal)}</span>
              </div>

              <p className="mt-6 text-xs leading-6 text-neutral-400">
                Prototype checkout only. Orders, receipts, and stock deductions are stored locally in this browser.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}