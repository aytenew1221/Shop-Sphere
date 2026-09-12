import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // Delivery calculation
  const freeDeliveryLimit = 5000;
  const standardDeliveryFee = 200;

  const deliveryFee = cartTotal >= freeDeliveryLimit ? 0 : standardDeliveryFee;

  const grandTotal = cartTotal + deliveryFee;

  // Customer form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    paymentMethod: "",
    telebirrPhone: "",
    cbeAccountNumber: "",
    deliveryMethod: "physical",
    location: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // If cart is empty
  if (cart.length === 0) {
    return (
      <section className="section">
        <div className="container empty-cart">
          <div className="empty-icon">🛒</div>

          <h1>Your Cart Is Empty</h1>

          <p>
            You need to add products to your cart before proceeding to checkout.
          </p>

          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  // Handle form changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove error while user is correcting the field
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Customer name
    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Please enter a valid name.";
    }

    // Main phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^(?:\+251|0)9\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid Ethiopian phone number.";
    }

    // Email is optional, but validate if entered
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Payment method
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method.";
    }

    // Telebirr validation
    if (formData.paymentMethod === "Telebirr") {
      if (!formData.telebirrPhone.trim()) {
        newErrors.telebirrPhone = "Telebirr phone number is required.";
      } else if (!/^(?:\+251|0)9\d{8}$/.test(formData.telebirrPhone.trim())) {
        newErrors.telebirrPhone = "Enter a valid Telebirr phone number.";
      }
    }

    // CBE validation
    if (formData.paymentMethod === "CBE") {
      if (!formData.cbeAccountNumber.trim()) {
        newErrors.cbeAccountNumber = "CBE account number is required.";
      } else if (!/^\d{8,16}$/.test(formData.cbeAccountNumber.trim())) {
        newErrors.cbeAccountNumber =
          "CBE account number must contain 8–16 digits.";
      }
    }

    // Physical delivery validation
    if (formData.deliveryMethod === "physical") {
      if (!formData.location.trim()) {
        newErrors.location = "Physical delivery location is required.";
      } else if (formData.location.trim().length < 5) {
        newErrors.location = "Please enter a complete delivery location.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Generate order number
  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-8);

    const randomNumber = Math.floor(100 + Math.random() * 900);

    return `SS-${timestamp}-${randomNumber}`;
  };

  // Place order
  const handlePlaceOrder = (event) => {
    event.preventDefault();

    // Validate all information
    const isValid = validateForm();

    if (!isValid) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // Final confirmation
    const paymentText =
      formData.paymentMethod === "Telebirr"
        ? "Telebirr"
        : formData.paymentMethod === "CBE"
          ? "CBE"
          : formData.paymentMethod;

    const deliveryText =
      formData.deliveryMethod === "physical" ? "Physical Delivery" : "Pickup";

    const confirmed = window.confirm(
      `Confirm your purchase?\n\n` +
        `Customer: ${formData.name}\n` +
        `Payment: ${paymentText}\n` +
        `Delivery: ${deliveryText}\n` +
        `Total: ${grandTotal.toLocaleString()} ETB\n\n` +
        `Click OK to place your order.`,
    );

    if (!confirmed) {
      return;
    }

    setIsProcessing(true);

    // Create order
    const orderNumber = generateOrderNumber();

    const order = {
      orderNumber,

      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      },

      payment: {
        method: formData.paymentMethod,

        // Store the payment identifier needed for the demo.
        // In a real application, payment should be handled
        // securely by the payment provider.
        telebirrPhone:
          formData.paymentMethod === "Telebirr"
            ? formData.telebirrPhone.trim()
            : "",

        cbeAccountNumber:
          formData.paymentMethod === "CBE"
            ? formData.cbeAccountNumber.trim()
            : "",
      },

      delivery: {
        method: formData.deliveryMethod,
        location: formData.location.trim(),
        notes: formData.notes.trim(),
      },

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),

      totals: {
        subtotal: cartTotal,
        deliveryFee,
        grandTotal,
      },

      status: "Confirmed",

      createdAt: new Date().toISOString(),
    };

    // Save the latest order
    localStorage.setItem("shopsphere-last-order", JSON.stringify(order));

    // Save order history
    const existingOrders = JSON.parse(
      localStorage.getItem("shopsphere-orders") || "[]",
    );

    existingOrders.push(order);

    localStorage.setItem("shopsphere-orders", JSON.stringify(existingOrders));

    // Clear cart AFTER successful confirmation
    clearCart();

    // Redirect to success page
    navigate("/order-success", {
      replace: true,
      state: {
        order,
      },
    });
  };

  return (
    <section className="section">
      <div className="container">
        {/* Page Heading */}
        <div className="page-heading">
          <h1>Checkout</h1>

          <p>Complete your information and confirm your order.</p>
        </div>

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
          noValidate
        >
          {/* Left Side */}
          <div className="checkout-form">
            {/* Customer Information */}
            <div className="checkout-card">
              <h2>Customer Information</h2>

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

                {errors.name && (
                  <small className="form-error">{errors.name}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09XXXXXXXX or +2519XXXXXXXX"
                  autoComplete="tel"
                />

                {errors.phone && (
                  <small className="form-error">{errors.phone}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  autoComplete="email"
                />

                {errors.email && (
                  <small className="form-error">{errors.email}</small>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-card">
              <h2>Payment Method</h2>

              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Telebirr"
                    checked={formData.paymentMethod === "Telebirr"}
                    onChange={handleChange}
                  />

                  <span>
                    📱 <strong>Telebirr</strong>
                    <small>Pay using your Telebirr phone number.</small>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CBE"
                    checked={formData.paymentMethod === "CBE"}
                    onChange={handleChange}
                  />

                  <span>
                    🏦 <strong>CBE</strong>
                    <small>Pay using your CBE account.</small>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === "Cash on Delivery"}
                    onChange={handleChange}
                  />

                  <span>
                    💵 <strong>Cash on Delivery</strong>
                    <small>Pay when your order is delivered.</small>
                  </span>
                </label>
              </div>

              {errors.paymentMethod && (
                <small className="form-error">{errors.paymentMethod}</small>
              )}

              {/* Telebirr */}
              {formData.paymentMethod === "Telebirr" && (
                <div className="form-group payment-detail">
                  <label htmlFor="telebirrPhone">Telebirr Phone Number *</label>

                  <input
                    id="telebirrPhone"
                    name="telebirrPhone"
                    type="tel"
                    value={formData.telebirrPhone}
                    onChange={handleChange}
                    placeholder="09XXXXXXXX"
                  />

                  {errors.telebirrPhone && (
                    <small className="form-error">{errors.telebirrPhone}</small>
                  )}
                </div>
              )}

              {/* CBE */}
              {formData.paymentMethod === "CBE" && (
                <div className="form-group payment-detail">
                  <label htmlFor="cbeAccountNumber">CBE Account Number *</label>

                  <input
                    id="cbeAccountNumber"
                    name="cbeAccountNumber"
                    type="text"
                    inputMode="numeric"
                    value={formData.cbeAccountNumber}
                    onChange={handleChange}
                    placeholder="Enter CBE account number"
                  />

                  {errors.cbeAccountNumber && (
                    <small className="form-error">
                      {errors.cbeAccountNumber}
                    </small>
                  )}
                </div>
              )}
            </div>

            {/* Delivery */}
            <div className="checkout-card">
              <h2>Delivery Method</h2>

              <label className="delivery-option">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="physical"
                  checked={formData.deliveryMethod === "physical"}
                  onChange={handleChange}
                />

                <span>
                  🚚 <strong>Physical Delivery</strong>
                  <small>Your order will be delivered to your location.</small>
                </span>
              </label>

              {/* Location */}
              {formData.deliveryMethod === "physical" && (
                <div className="form-group delivery-detail">
                  <label htmlFor="location">Delivery Location *</label>

                  <textarea
                    id="location"
                    name="location"
                    rows="3"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your delivery location, area, street or landmark"
                  />

                  {errors.location && (
                    <small className="form-error">{errors.location}</small>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="notes">Delivery Notes</label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional delivery instructions"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <aside className="checkout-summary">
            <div className="summary">
              <h2>Order Review</h2>

              {/* Products */}
              <div className="checkout-products">
                {cart.map((item) => (
                  <div className="checkout-product" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>

                      <small>
                        {item.quantity} × {item.price.toLocaleString()} ETB
                      </small>
                    </div>

                    <strong>
                      {(item.price * item.quantity).toLocaleString()} ETB
                    </strong>
                  </div>
                ))}
              </div>

              <hr />

              <div className="summary-row">
                <span>Subtotal</span>

                <strong>{cartTotal.toLocaleString()} ETB</strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>

                <strong>
                  {deliveryFee === 0
                    ? "FREE"
                    : `${deliveryFee.toLocaleString()} ETB`}
                </strong>
              </div>

              <hr />

              <div className="summary-total">
                <span>Total</span>

                <strong>{grandTotal.toLocaleString()} ETB</strong>
              </div>

              <div className="checkout-notice">
                🔒 Your order will only be placed after you confirm the
                purchase.
              </div>

              <button
                type="submit"
                className="btn btn-primary checkout-btn"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing Order..." : `Confirm & Place Order`}
              </button>

              <Link to="/cart" className="continue-shopping">
                ← Back to Cart
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

export default Checkout;
