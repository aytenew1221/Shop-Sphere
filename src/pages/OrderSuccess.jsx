import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  // First try to get order from navigation state
  let order = location.state?.order;

  // If page was refreshed, get the order from localStorage
  if (!order) {
    try {
      const savedOrder = localStorage.getItem("shopsphere-last-order");

      if (savedOrder) {
        order = JSON.parse(savedOrder);
      }
    } catch (error) {
      console.error("Unable to load saved order:", error);
    }
  }

  // No order available
  if (!order) {
    return <Navigate to="/products" replace />;
  }

  const { orderNumber, customer, payment, delivery, items, totals, createdAt } =
    order;

  const orderDate = createdAt ? new Date(createdAt).toLocaleString() : "N/A";

  return (
    <section className="section">
      <div className="container order-success">
        {/* Success Message */}
        <div className="success-icon">✓</div>

        <h1>Order Confirmed!</h1>

        <p className="success-message">
          Thank you, <strong>{customer.name}</strong>! Your ShopSphere order has
          been successfully placed.
        </p>

        {/* Order Number */}
        <div className="order-number">
          <span>Order Number</span>

          <strong>{orderNumber}</strong>
        </div>

        {/* Customer Information */}
        <div className="success-layout">
          <div className="success-card">
            <h2>Customer Information</h2>

            <div className="detail-row">
              <span>Name</span>
              <strong>{customer.name}</strong>
            </div>

            <div className="detail-row">
              <span>Phone</span>
              <strong>{customer.phone}</strong>
            </div>

            {customer.email && (
              <div className="detail-row">
                <span>Email</span>
                <strong>{customer.email}</strong>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="success-card">
            <h2>Payment</h2>

            <div className="detail-row">
              <span>Method</span>
              <strong>{payment.method}</strong>
            </div>

            {payment.method === "Telebirr" && (
              <div className="detail-row">
                <span>Telebirr Phone</span>
                <strong>{payment.telebirrPhone}</strong>
              </div>
            )}

            {payment.method === "CBE" && (
              <div className="detail-row">
                <span>CBE Account</span>
                <strong>{payment.cbeAccountNumber}</strong>
              </div>
            )}
          </div>

          {/* Delivery */}
          <div className="success-card">
            <h2>Delivery</h2>

            <div className="detail-row">
              <span>Method</span>
              <strong>
                {delivery.method === "physical"
                  ? "Physical Delivery"
                  : delivery.method}
              </strong>
            </div>

            {delivery.location && (
              <div className="detail-row">
                <span>Location</span>
                <strong>{delivery.location}</strong>
              </div>
            )}

            {delivery.notes && (
              <div className="detail-row">
                <span>Notes</span>
                <strong>{delivery.notes}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Ordered Products */}
        <div className="success-card order-products">
          <h2>Order Details</h2>

          {items.map((item) => (
            <div className="success-product" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="success-product-info">
                <strong>{item.name}</strong>

                <span>
                  {item.quantity} × {item.price.toLocaleString()} ETB
                </span>
              </div>

              <strong>
                {(item.price * item.quantity).toLocaleString()} ETB
              </strong>
            </div>
          ))}

          <hr />

          {/* Totals */}
          <div className="success-total-row">
            <span>Subtotal</span>

            <strong>{totals.subtotal.toLocaleString()} ETB</strong>
          </div>

          <div className="success-total-row">
            <span>Delivery</span>

            <strong>
              {totals.deliveryFee === 0
                ? "FREE"
                : `${totals.deliveryFee.toLocaleString()} ETB`}
            </strong>
          </div>

          <div className="success-total-row grand-total">
            <span>Total Paid</span>

            <strong>{totals.grandTotal.toLocaleString()} ETB</strong>
          </div>
        </div>

        {/* Order Status */}
        <div className="order-status">
          <div>
            <span className="status-icon">✓</span>

            <div>
              <strong>Order Confirmed</strong>

              <p>Your order has been received by ShopSphere.</p>
            </div>
          </div>

          <div>
            <span className="status-icon">🚚</span>

            <div>
              <strong>Delivery Processing</strong>

              <p>Your order will be prepared for delivery.</p>
            </div>
          </div>
        </div>

        {/* Date */}
        <p className="order-date">Order placed: {orderDate}</p>

        {/* Actions */}
        <div className="success-actions">
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>

          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;
