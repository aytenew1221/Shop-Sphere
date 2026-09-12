import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  // Empty cart
  if (cart.length === 0) {
    return (
      <section className="section">
        <div className="container empty-cart">
          <div className="empty-icon">🛒</div>

          <h1>Your Cart Is Empty</h1>

          <p>You haven't added any products yet.</p>

          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  // Delivery rules
  const freeDeliveryLimit = 5000;
  const standardDeliveryFee = 200;

  const deliveryFee = cartTotal >= freeDeliveryLimit ? 0 : standardDeliveryFee;

  const grandTotal = cartTotal + deliveryFee;

  const amountForFreeDelivery = Math.max(freeDeliveryLimit - cartTotal, 0);

  // Verify removing product
  const handleRemove = (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${item.name}" from your cart?`,
    );

    if (confirmed) {
      removeFromCart(item.id);
    }
  };

  // Verify checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add products before checkout.");
      return;
    }

    const confirmed = window.confirm(
      `Confirm checkout?\n\n` +
        `Items: ${cart.length}\n` +
        `Subtotal: ${cartTotal.toLocaleString()} ETB\n` +
        `Delivery: ${
          deliveryFee === 0 ? "FREE" : deliveryFee.toLocaleString() + " ETB"
        }\n` +
        `Total: ${grandTotal.toLocaleString()} ETB`,
    );

    if (confirmed) {
      navigate("/checkout", {
        state: {
          subtotal: cartTotal,
          deliveryFee,
          grandTotal,
        },
      });
    }
  };

  return (
    <section className="section">
      <div className="container">
        {/* Page Heading */}
        <div className="page-heading">
          <h1>Your Shopping Cart</h1>

          <p>Review your selected products before checkout.</p>
        </div>

        {/* Delivery Message */}
        {deliveryFee === 0 ? (
          <div className="delivery-message success">
            🚚 <strong>Congratulations!</strong> Your order qualifies for{" "}
            <strong> FREE DELIVERY.</strong>
          </div>
        ) : (
          <div className="delivery-message info">
            🚚 Add <strong>{amountForFreeDelivery.toLocaleString()} ETB</strong>{" "}
            more to your cart and get <strong>FREE DELIVERY!</strong>
          </div>
        )}

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p>{item.price.toLocaleString()} ETB</p>

                  <div className="quantity">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-right">
                  <strong>
                    {(item.price * item.quantity).toLocaleString()} ETB
                  </strong>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemove(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="summary">
            <h2>Order Summary</h2>

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

            {/* Delivery Information */}
            <div className="delivery-info">
              <p>
                🚚 <strong>Delivery Information</strong>
              </p>

              {deliveryFee === 0 ? (
                <p>
                  Your order qualifies for free delivery because your subtotal
                  is {freeDeliveryLimit.toLocaleString()} ETB or more.
                </p>
              ) : (
                <p>
                  Standard delivery is{" "}
                  <strong>{standardDeliveryFee} ETB</strong>. Orders of{" "}
                  <strong>{freeDeliveryLimit.toLocaleString()} ETB</strong> or
                  more receive free delivery.
                </p>
              )}
            </div>

            {/* Checkout */}
            <button
              type="button"
              className="btn btn-primary checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Cart;
