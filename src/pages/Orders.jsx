import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../COMPONENTS/Title";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_API_BASE_URL;

const OrdersPage = () => {
  const { user, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) {
      setError("Please log in to view your orders.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${API}:3000/orders/user/${user._id}`,
          { headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-pulse w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
        <p className="text-gray-600 text-sm">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <p className="text-red-600 text-sm mb-4">{error}</p>
        {!user?._id && (
          <Link
            to="/login"
            className="bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Go to Login
          </Link>
        )}
      </div>
    );
  }

  const calculateArrival = (dateString) => {
    const orderDate = new Date(dateString);
    orderDate.setDate(orderDate.getDate() + 2); // 2 days delivery
    return orderDate.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div className="my-12 px-4 sm:px-6 lg:px-8 pt-12">
      <div className="text-center py-10">
        <Title text1="YOUR" text2="ORDERS" />
        <p className="text-gray-600 mt-3 text-base">
          Track your past purchases and delivery updates.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No orders"
            className="w-32 h-32 mx-auto mb-4 opacity-80"
          />
          <p className="text-gray-600 text-sm mb-6">
            You haven’t placed any orders yet.
          </p>
          <Link
            to="/collection"
            className="bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => {
            const arrivalDate = calculateArrival(order.createdAt);
            const progress =
              order.status === "Delivered"
                ? 100
                : order.status === "Processing"
                ? 50
                : 0;

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl shadow p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order ID: {order._id}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Placed on:{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-ZA")}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Expected Arrival: <span className="font-medium">{arrivalDate}</span>
                    </p>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center py-3 gap-4">
                      <img
                        src={
                          Array.isArray(item.image)
                            ? item.image[0]
                            : item.image ||
                              "https://cdn-icons-png.flaticon.com/512/679/679922.png"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {item.name || "Product"}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {item.size && <span>Size: {item.size} · </span>}
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-gray-800 text-sm">
                        {currency}
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delivery progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        progress === 100
                          ? "bg-green-500"
                          : progress === 50
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Pending</span>
                    <span>Processing</span>
                    <span>Delivered</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Total:</span> {currency}
                    {order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
