"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { endAdminSession, isAdminSessionActive } from "../../lib/admin";
import { getStoredOrders, type PrototypeOrder } from "../../lib/orders";
import { getProductStockStatus, products, type Product } from "../../lib/data";
import { useInventory } from "../../components/InventoryProvider";

type AdminTab = "orders" | "sales" | "inventory";

const formatCurrency = (value: number) => `₱${value.toLocaleString("en-PH")}`;

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const formatDateKey = (value: string) => new Date(value).toISOString().slice(0, 10);

const formatMonthKey = (value: string) => new Date(value).toISOString().slice(0, 7);

const formatStockStatus = (stock: number) => {
  const stockStatus = getProductStockStatus(stock);

  if (stockStatus === "out-of-stock") {
    return "Out of Stock";
  }

  if (stockStatus === "low-stock") {
    return "Low Stock";
  }

  return "In Stock";
};

interface InventoryRowProps {
  product: Product;
  stock: number;
  onAdd: (code: string, quantity: number) => string;
  onSubtract: (code: string, quantity: number) => string;
}

function InventoryRow({ product, stock, onAdd, onSubtract }: InventoryRowProps) {
  const [quantity, setQuantity] = useState(1);
  const [rowMessage, setRowMessage] = useState("");

  const handleAction = (type: "add" | "subtract") => {
    const message = type === "add" ? onAdd(product.code, quantity) : onSubtract(product.code, quantity);
    setRowMessage(message);

    window.setTimeout(() => {
      setRowMessage("");
    }, 1800);
  };

  return (
    <tr className="border-b border-neutral-950/10 align-top">
      <td className="px-4 py-5 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
        {product.code}
      </td>

      <td className="px-4 py-5">
        <p className="font-serif text-lg leading-tight tracking-[-0.03em] text-neutral-950">{product.name}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-400">{product.scentFamily}</p>
        {rowMessage ? <p className="mt-3 text-xs leading-5 text-neutral-500">{rowMessage}</p> : null}
      </td>

      <td className="px-4 py-5 text-sm text-neutral-700">{stock}</td>

      <td className="px-4 py-5 text-sm text-neutral-700">{formatStockStatus(stock)}</td>

      <td className="px-4 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <input
            aria-label={`Quantity for ${product.name}`}
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            className="h-11 w-20 border border-neutral-950/10 px-3 text-sm outline-none focus:border-neutral-950"
          />

          <button
            type="button"
            onClick={() => handleAction("add")}
            className="h-11 border border-neutral-950 px-4 text-[10px] font-medium uppercase tracking-[0.2em] transition duration-300 hover:bg-neutral-950 hover:text-white"
          >
            Add
          </button>

          <button
            type="button"
            onClick={() => handleAction("subtract")}
            className="h-11 border border-neutral-950/10 px-4 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 transition duration-300 hover:border-neutral-950 hover:text-neutral-950"
          >
            Subtract
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    hasHydrated,
    getProductStock,
    manualAddStock,
    manualSubtractStock,
    resetPrototypeInventory,
    movements,
  } = useInventory();

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<PrototypeOrder[]>([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    if (!isAdminSessionActive()) {
      router.replace("/admin/login");
      return;
    }

    setOrders(getStoredOrders());
    setIsCheckingSession(false);
  }, [router]);

  useEffect(() => {
    if (orders.length > 0 && !selectedMonth) {
      setSelectedMonth(formatMonthKey(orders[0].createdAt));
    }
  }, [orders, selectedMonth]);

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const searchableText = [
        order.id,
        order.customer.fullName,
        order.customer.phone,
        order.customer.address,
        order.paymentMethod,
        order.status,
        order.items.map((item) => item.name).join(" "),
        order.items.map((item) => item.code).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [orders, orderSearch]);

  const dailySales = useMemo(() => {
    const salesMap = new Map<
      string,
      {
        date: string;
        total: number;
        orderCount: number;
        itemCount: number;
        products: Map<string, { name: string; code: string; quantity: number; total: number }>;
      }
    >();

    orders.forEach((order) => {
      const date = formatDateKey(order.createdAt);
      const existingDay =
        salesMap.get(date) ??
        {
          date,
          total: 0,
          orderCount: 0,
          itemCount: 0,
          products: new Map<string, { name: string; code: string; quantity: number; total: number }>(),
        };

      existingDay.total += order.total;
      existingDay.orderCount += 1;
      existingDay.itemCount += order.totalItems;

      order.items.forEach((item) => {
        const existingProduct =
          existingDay.products.get(item.code) ??
          {
            name: item.name,
            code: item.code,
            quantity: 0,
            total: 0,
          };

        existingProduct.quantity += item.quantity;
        existingProduct.total += item.subtotal;
        existingDay.products.set(item.code, existingProduct);
      });

      salesMap.set(date, existingDay);
    });

    return Array.from(salesMap.values()).sort((firstDay, secondDay) => secondDay.date.localeCompare(firstDay.date));
  }, [orders]);

  const availableMonths = useMemo(() => {
    return Array.from(new Set(orders.map((order) => formatMonthKey(order.createdAt)))).sort((a, b) => b.localeCompare(a));
  }, [orders]);

  const selectedMonthOrders = useMemo(() => {
    if (!selectedMonth) {
      return [];
    }

    return orders.filter((order) => formatMonthKey(order.createdAt) === selectedMonth);
  }, [orders, selectedMonth]);

  const selectedMonthTotal = selectedMonthOrders.reduce((total, order) => total + order.total, 0);
  const selectedMonthItems = selectedMonthOrders.reduce((total, order) => total + order.totalItems, 0);

  const filteredProducts = useMemo(() => {
    const query = inventorySearch.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = [product.code, product.name, product.scentFamily, product.category].join(" ").toLowerCase();
      return searchableText.includes(query);
    });
  }, [inventorySearch]);

  const handleLogout = () => {
    endAdminSession();
    router.push("/");
  };

  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  const handleAddStock = (code: string, quantity: number) => {
    const result = manualAddStock(code, quantity, "Manual stock addition from POS inventory");
    return result.message;
  };

  const handleSubtractStock = (code: string, quantity: number) => {
    const result = manualSubtractStock(code, quantity, "Manual stock subtraction / physical sale from POS inventory");
    return result.message;
  };

  if (isCheckingSession || !hasHydrated) {
    return (
      <main className="min-h-[calc(100vh-116px)] bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Loading POS</p>
          <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Preparing admin dashboard.
          </h1>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white px-6 py-16 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="grid gap-8 border-b border-neutral-950/10 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Prototype POS</p>

            <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl md:text-6xl">
              Admin Dashboard
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
              Orders, sales, and inventory are stored locally in this browser for prototype testing only.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <button
              type="button"
              onClick={refreshOrders}
              className="border border-neutral-950/10 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500 transition duration-300 hover:border-neutral-950 hover:text-neutral-950"
            >
              Refresh Orders
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-neutral-950 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.24em] text-white transition duration-300 hover:bg-neutral-800"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="mt-8 border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
          Prototype security warning: this admin area uses localStorage and hardcoded credentials. Do not publish this as
          a real protected POS without backend authentication and database rules.
        </div>

        <nav className="mt-10 flex flex-wrap gap-3">
          {[
            { id: "orders", label: "Orders" },
            { id: "sales", label: "Sales" },
            { id: "inventory", label: "Inventory" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-5 py-4 text-[10px] font-medium uppercase tracking-[0.26em] transition duration-300 ${
                activeTab === tab.id
                  ? "bg-neutral-950 text-white"
                  : "border border-neutral-950/10 text-neutral-500 hover:border-neutral-950 hover:text-neutral-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "orders" ? (
          <section className="mt-12">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Orders</p>
                <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em]">Customer order records</h2>
              </div>

              <input
                value={orderSearch}
                onChange={(event) => setOrderSearch(event.target.value)}
                placeholder="Search orders..."
                className="border border-neutral-950/10 px-4 py-4 text-sm outline-none transition duration-300 focus:border-neutral-950"
              />
            </div>

            {filteredOrders.length === 0 ? (
              <div className="mt-8 border border-neutral-950/10 px-6 py-10 text-center">
                <p className="font-serif text-2xl tracking-[-0.03em]">No orders found.</p>
                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  Complete a checkout order first, then return here and refresh.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                {filteredOrders.map((order) => (
                  <article key={order.id} className="border border-neutral-950/10 p-6">
                    <div className="grid gap-6 border-b border-neutral-950/10 pb-6 lg:grid-cols-[1fr_auto]">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">
                          {order.id}
                        </p>
                        <h3 className="mt-3 font-serif text-2xl tracking-[-0.03em]">{order.customer.fullName}</h3>
                        <p className="mt-3 text-sm leading-7 text-neutral-500">{formatDateTime(order.createdAt)}</p>
                      </div>

                      <div className="text-left lg:text-right">
                        <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">Total</p>
                        <p className="mt-3 font-serif text-2xl tracking-[-0.03em]">{formatCurrency(order.total)}</p>
                        <p className="mt-2 text-sm text-neutral-500">{order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">Phone</p>
                        <p className="mt-2 text-sm text-neutral-700">{order.customer.phone}</p>
                      </div>

                      <div className="lg:col-span-2">
                        <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">Address</p>
                        <p className="mt-2 text-sm leading-6 text-neutral-700">{order.customer.address}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">Products</p>

                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[680px] text-left">
                          <thead>
                            <tr className="border-b border-neutral-950/10 text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                              <th className="py-3 pr-4 font-medium">Code</th>
                              <th className="py-3 pr-4 font-medium">Product</th>
                              <th className="py-3 pr-4 font-medium">Qty</th>
                              <th className="py-3 pr-4 font-medium">Subtotal</th>
                            </tr>
                          </thead>

                          <tbody>
                            {order.items.map((item) => (
                              <tr key={`${order.id}-${item.code}`} className="border-b border-neutral-950/5">
                                <td className="py-4 pr-4 text-xs text-neutral-500">{item.code}</td>
                                <td className="py-4 pr-4 text-sm text-neutral-700">{item.name}</td>
                                <td className="py-4 pr-4 text-sm text-neutral-700">{item.quantity}</td>
                                <td className="py-4 pr-4 text-sm text-neutral-700">{formatCurrency(item.subtotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {order.receipt ? (
                      <a
                        href={order.receipt.dataUrl}
                        download={order.receipt.fileName}
                        className="mt-6 inline-flex text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500 underline underline-offset-4 transition duration-300 hover:text-neutral-950"
                      >
                        View / Download GCash Receipt
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {activeTab === "sales" ? (
          <section className="mt-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Sales</p>
            <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em]">Daily and monthly sales</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="border border-neutral-950/10 p-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">Total Orders</p>
                <p className="mt-4 font-serif text-3xl tracking-[-0.03em]">{orders.length}</p>
              </div>

              <div className="border border-neutral-950/10 p-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">Total Items Sold</p>
                <p className="mt-4 font-serif text-3xl tracking-[-0.03em]">
                  {orders.reduce((total, order) => total + order.totalItems, 0)}
                </p>
              </div>

              <div className="border border-neutral-950/10 p-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">Total Sales</p>
                <p className="mt-4 font-serif text-3xl tracking-[-0.03em]">
                  {formatCurrency(orders.reduce((total, order) => total + order.total, 0))}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
              <div className="space-y-6">
                {dailySales.length === 0 ? (
                  <div className="border border-neutral-950/10 px-6 py-10 text-center">
                    <p className="font-serif text-2xl tracking-[-0.03em]">No sales yet.</p>
                    <p className="mt-4 text-sm leading-7 text-neutral-500">
                      Sales will appear after checkout orders are submitted.
                    </p>
                  </div>
                ) : (
                  dailySales.map((day) => (
                    <details key={day.date} className="border border-neutral-950/10 p-6">
                      <summary className="cursor-pointer list-none">
                        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">
                              {day.date}
                            </p>
                            <h3 className="mt-3 font-serif text-2xl tracking-[-0.03em]">
                              {day.orderCount} order{day.orderCount === 1 ? "" : "s"} · {day.itemCount} item
                              {day.itemCount === 1 ? "" : "s"}
                            </h3>
                          </div>

                          <p className="font-serif text-2xl tracking-[-0.03em]">{formatCurrency(day.total)}</p>
                        </div>
                      </summary>

                      <div className="mt-6 border-t border-neutral-950/10 pt-6">
                        <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-400">
                          Products Sold
                        </p>

                        <div className="mt-4 space-y-3">
                          {Array.from(day.products.values()).map((product) => (
                            <div
                              key={`${day.date}-${product.code}`}
                              className="flex items-center justify-between gap-4 border-b border-neutral-950/5 pb-3 text-sm"
                            >
                              <span className="text-neutral-700">
                                {product.code} · {product.name}
                              </span>
                              <span className="text-neutral-500">
                                {product.quantity} sold · {formatCurrency(product.total)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))
                )}
              </div>

              <aside className="h-fit border border-neutral-950/10 p-6 lg:sticky lg:top-36">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Monthly View</p>

                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="mt-6 w-full border border-neutral-950/10 px-4 py-4 text-sm outline-none focus:border-neutral-950"
                >
                  {availableMonths.length === 0 ? <option value="">No months yet</option> : null}
                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <div className="mt-8 space-y-5 text-sm text-neutral-500">
                  <div className="flex items-center justify-between">
                    <span>Orders</span>
                    <span className="text-neutral-950">{selectedMonthOrders.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Items Sold</span>
                    <span className="text-neutral-950">{selectedMonthItems}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-950/10 pt-5">
                    <span className="text-[11px] font-medium uppercase tracking-[0.24em]">Month Total</span>
                    <span className="font-serif text-2xl tracking-[-0.03em] text-neutral-950">
                      {formatCurrency(selectedMonthTotal)}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        ) : null}

        {activeTab === "inventory" ? (
          <section className="mt-12">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Inventory</p>
                <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em]">Product stock control</h2>
              </div>

              <input
                value={inventorySearch}
                onChange={(event) => setInventorySearch(event.target.value)}
                placeholder="Search inventory..."
                className="border border-neutral-950/10 px-4 py-4 text-sm outline-none transition duration-300 focus:border-neutral-950"
              />
            </div>

            <div className="mt-8 overflow-x-auto border border-neutral-950/10">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-neutral-950/10 text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                    <th className="px-4 py-4 font-medium">Code</th>
                    <th className="px-4 py-4 font-medium">Product</th>
                    <th className="px-4 py-4 font-medium">Stock</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Manual Adjustment</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <InventoryRow
                      key={product.code}
                      product={product}
                      stock={getProductStock(product.code)}
                      onAdd={handleAddStock}
                      onSubtract={handleSubtractStock}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="border border-neutral-950/10 p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">
                  Inventory Movements
                </p>

                {movements.length === 0 ? (
                  <p className="mt-5 text-sm leading-7 text-neutral-500">No inventory movements recorded yet.</p>
                ) : (
                  <div className="mt-5 max-h-80 space-y-4 overflow-y-auto pr-2">
                    {movements.slice(0, 30).map((movement) => (
                      <div key={movement.id} className="border-b border-neutral-950/10 pb-4">
                        <p className="text-sm text-neutral-700">
                          {movement.code} · {movement.productName}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-neutral-400">
                          {movement.type} · {movement.quantity} PC · {formatDateTime(movement.createdAt)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-neutral-400">{movement.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <aside className="h-fit border border-red-200 bg-red-50 p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-red-700">Danger Zone</p>
                <p className="mt-4 text-sm leading-7 text-red-700">
                  Resetting inventory restores stock from the original Excel product data and clears inventory movement
                  history in this browser.
                </p>

                <button
                  type="button"
                  onClick={resetPrototypeInventory}
                  className="mt-6 w-full bg-red-700 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.24em] text-white transition duration-300 hover:bg-red-800"
                >
                  Reset Prototype Inventory
                </button>
              </aside>
            </div>
          </section>
        ) : null}

        <div className="mt-16 border-t border-neutral-950/10 pt-8">
          <Link
            href="/"
            className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400 transition duration-300 hover:text-neutral-950"
          >
            ← Return to Storefront
          </Link>
        </div>
      </section>
    </main>
  );
}