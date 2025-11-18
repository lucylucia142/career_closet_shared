import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import Title from '../COMPONENTS/Title';
const API_BASE_URL= import.meta.env.VITE_API_BASE_URL;
const CheckoutPage = () => {
  const {
    products,
    cartItems,
    currency,
    getCartAmount,
    delivery_fee,
    user,
    isAuthenticated,
    clearCartState,
    // Assuming updateQuantity is available, though unused in the final code block:
    // updateQuantity, 
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // 🔑 1. State for Shipping/Billing Information (Pre-fill with user data if available)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    country: user?.country || '',
  });

  // 🔑 2. State for Payment Information (Card Mockup)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Helper function to handle form changes
  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
    setFormError('');
  };

  // Build a list of cart items with product details
  const cartProductList = [];
  for (const itemId in cartItems) {
    for (const size in cartItems[itemId]) {
      const quantity = cartItems[itemId][size];
      const product = products.find((p) => p._id === itemId);
      if (product) {
        cartProductList.push({
          name: product.name,
          image: Array.isArray(product.image) ? product.image[0] : product.image,
          price: product.price,
          _id: product._id,
          size,
          quantity,
        });
      }
    }
  }
  
  // 🔑 Validation check
  const validateForm = () => {
    // Simple check for required shipping fields
    for (const key in shippingInfo) {
      if (!shippingInfo[key]) {
        setFormError('All shipping fields are required.');
        return false;
      }
    }

    // Simple check for payment fields (in a real app, this is handled by a secure gateway)
    if (!paymentInfo.cardNumber || paymentInfo.cardNumber.length < 16) {
      setFormError('Please enter a valid card number.');
      return false;
    }
    if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
      setFormError('Please enter a valid CVV.');
      return false;
    }

    setFormError('');
    return true;
  };

  const handleCheckout = async () => {
    if (!isAuthenticated || !user?._id) {
      alert('You must be logged in to place an order.');
      navigate('/login');
      return;
    }

    if (cartProductList.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    
    // 🔑 Run validation before proceeding
    if (!validateForm()) {
        return;
    }

    setLoading(true);

    try {
      // 🔑 Combine user data and new form data for the order
      const orderDetails = {
        userId: user._id,
        items: cartProductList.map(p => ({
            productId: p._id,
            name: p.name,
            image: p.image,
            price: p.price,
            size: p.size,
            quantity: p.quantity,
        })),
        totalAmount: getCartAmount() + delivery_fee,
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}, ${shippingInfo.country}`,
        // Note: Payment data is typically handled securely by a payment gateway, 
        // but we include a flag here for the server.
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid', 
      };

      const response = await fetch(`${API_BASE_URL}:3000/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user._id}`, 
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        const data = await response.json();
        alert('✅ Order placed successfully! You will now be taken to your tracking page.');
        
        clearCartState(); 
        
        // 🔑 Redirect to the individual order tracking page
        navigate(`/order/${data._id}`); 
      } else {
        const errorData = await response.json();
        alert(`⚠️ ${errorData.message || 'Something went wrong while placing your order.'}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('❌ Failed to process checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container mx-auto px-4 py-10 max-w-5xl">
      <Title text1="SECURE" text2="CHECKOUT" />

      {cartProductList.length === 0 ? (
        <div className="text-center my-10">
          <h2 className="text-lg font-semibold mb-4">Your cart is empty.</h2>
          <Link
            to="/collection"
            className="bg-pink-500 text-white py-2 px-5 rounded hover:bg-pink-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
          {/* LEFT COLUMN: Shipping & Payment Forms (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
                
                {/* 🔑 STEP 1: Shipping Information */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <span className="bg-pink-100 text-pink-500 w-8 h-8 flex items-center justify-center rounded-full mr-3 font-mono">1</span>
                        Shipping Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="fullName" placeholder="Full Name" value={shippingInfo.fullName} onChange={handleShippingChange} className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500" required />
                        <input type="email" name="email" placeholder="Email Address" value={shippingInfo.email} onChange={handleShippingChange} className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500" required />
                        <div className="md:col-span-2">
                             <input type="text" name="address" placeholder="Street Address" value={shippingInfo.address} onChange={handleShippingChange} className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 w-full" required />
                        </div>
                        <input type="text" name="city" placeholder="City" value={shippingInfo.city} onChange={handleShippingChange} className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500" required />
                        <input type="text" name="zipCode" placeholder="Zip/Postal Code" value={shippingInfo.zipCode} onChange={handleShippingChange} className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500" required />
                        <input type="text" name="country" placeholder="Country" value={shippingInfo.country} onChange={handleShippingChange} className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500" required />
                    </div>
                </div>

                {/* 🔑 STEP 2: Payment Information (Mock Card Form) */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <span className="bg-pink-100 text-pink-500 w-8 h-8 flex items-center justify-center rounded-full mr-3 font-mono">2</span>
                        Payment Details
                    </h2>
                    <div className="space-y-4">
                        <input type="text" name="cardNumber" placeholder="Card Number (e.g., 4000 1234 5678 9010)" value={paymentInfo.cardNumber} onChange={handlePaymentChange} maxLength="16" className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 w-full" required />
                        <input type="text" name="cardName" placeholder="Name on Card" value={paymentInfo.cardName} onChange={handlePaymentChange} className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 w-full" required />
                        <div className="flex space-x-4">
                             <input type="text" name="expiryDate" placeholder="MM/YY" value={paymentInfo.expiryDate} onChange={handlePaymentChange} maxLength="5" className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 w-1/2" required />
                             <input type="text" name="cvv" placeholder="CVV" value={paymentInfo.cvv} onChange={handlePaymentChange} maxLength="4" className="p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 w-1/2" required />
                        </div>
                    </div>
                    {formError && <p className="text-red-500 text-sm mt-3">{formError}</p>}
                </div>
                
                {/* 🔑 Summary of Cart Items (Optional, but good UX) */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Items in Cart</h2>
                    <div className="divide-y divide-gray-100">
                        {cartProductList.map((product, index) => (
                            <div key={index} className="flex justify-between items-center py-3">
                                <div className="flex items-center space-x-3">
                                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                    <div>
                                        <p className="font-medium text-sm">{product.name} ({product.size})</p>
                                        <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-sm">
                                    {currency} {(product.price * product.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

          </div>

          {/* RIGHT COLUMN: Order Summary & Place Order Button (1/3 width) */}
          <div className="summary lg:col-span-1 h-fit sticky top-20">
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Final Total</h2>
                
                {/* Summary Details */}
                <div className="flex justify-between mb-2 text-gray-700">
                  <span>Subtotal:</span>
                  <span>
                    {currency} {getCartAmount().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-4 text-gray-700">
                  <span>Delivery Fee:</span>
                  <span>
                    {currency} {delivery_fee.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between font-bold text-xl border-t pt-4">
                  <span>TOTAL:</span>
                  <span>
                    {currency}
                    {(getCartAmount() + delivery_fee).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || cartProductList.length === 0}
                  className={`mt-5 w-full py-3 rounded text-white font-semibold transition ${
                    loading || cartProductList.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-pink-500 hover:bg-pink-600'
                  }`}
                >
                  {loading ? 'Processing Payment...' : 'Place Order & Pay'}
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">
                    2-day delivery guaranteed. You will be redirected to the tracking page.
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;