import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../COMPONENTS/Title";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const { user, currency } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const steps = [
    { status: "Pending", label: "Order Placed", progress: 0 },
    { status: "Processing", label: "Processing", progress: 33 },
    { status: "Shipped", label: "Shipped", progress: 66 },
    { status: "Delivered", label: "Delivered", progress: 100 },
  ];

  useEffect(() => {
    if (!user?._id) {
      setError("Please log in to view order details.");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        // You may need a new backend endpoint for fetching a single order by ID
        const response = await fetch(
          `http://localhost:3000/orders/${orderId}`, // Assumes backend route like /orders/:orderId
          { headers: { "Authorization": `Bearer ${user._id}` } } // Good practice to authenticate
        );

        if (!response.ok) {
          throw new Error("Order not found or access denied.");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">Loading order...</div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-red-600 mb-4">Error: {error || "Order details unavailable."}</h2>
        <Link to="/orders" className="text-blue-600 hover:underline">
          Go back to all orders
        </Link>
      </div>
    );
  }
  
  // Custom logic for tracking status and estimated delivery
  const currentStepIndex = steps.findIndex(step => step.status === order.status);
  const activeSteps = steps.slice(0, currentStepIndex + 1);

  const calculateArrival = (dateString) => {
    const orderDate = new Date(dateString);
    orderDate.setDate(orderDate.getDate() + 2); // 2 days delivery
    return orderDate.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" });
  };

  const arrivalDate = calculateArrival(order.createdAt);
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-ZA");

  return (
    <div className="my-12 px-4 sm:px-6 lg:px-8 pt-12 max-w-5xl mx-auto">
      <Title text1="ORDER" text2={`#${order._id.slice(0, 8)}`} />
        <Link to="/orders" className="text-sm text-gray-500 hover:text-black mb-4 block">
            ← Back to all orders
        </Link>
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Tracking Information 🚀</h3>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-gray-600 text-sm">Order Date: <span className="font-medium">{orderDate}</span></p>
                    <p className="text-gray-600 text-sm">Expected Arrival: <span className="font-medium text-green-600">{arrivalDate}</span></p>
                </div>
                <span
                    className={`text-base px-4 py-2 rounded-full font-semibold ${
                        order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped" || order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {order.status || "Pending"}
                </span>
            </div>
            
            {/* Progress/Tracking Timeline */}
            <div className="relative pt-1">
                <div className="flex mb-2 items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${steps[currentStepIndex]?.progress || 10}%` }}
                        ></div>
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center relative">
                            <div 
                                className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                                    index <= currentStepIndex ? 'bg-pink-500' : 'bg-gray-300'
                                }`}
                            ></div>
                            <span className={`block mt-2 ${index <= currentStepIndex ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800">Order Summary</h3>
                <div className="space-y-4">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-3">
                                <img
                                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-md"
                                />
                                <div>
                                    <p className="font-medium text-sm">{item.name || "Product"}</p>
                                    <p className="text-xs text-gray-500">
                                        Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold text-sm">
                                {currency} {(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t">
                <h4 className="text-lg font-bold mb-3">Totals</h4>
                <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>{currency} {(order.totalAmount - 10).toFixed(2)}</span> {/* Assuming 10 is the fixed delivery fee */}
                </div>
                <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee:</span>
                    <span>{currency} 10.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>Total Paid:</span>
                    <span>{currency} {order.totalAmount.toFixed(2)}</span>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
                <h4 className="text-lg font-bold mb-2">Shipping To</h4>
                <p className="text-sm text-gray-600">{order.shippingAddress || "Address not provided"}</p>
            </div>
        </div>
    </div>
  );
};

export default OrderDetailsPage;