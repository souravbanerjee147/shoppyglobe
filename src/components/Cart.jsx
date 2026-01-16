import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearCart } from '../store/actions';
import CartItem from './CartItem';
import './Cart.css';

const Cart = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      dispatch(clearCart());
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/" className="continue-shopping">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button className="clear-cart-btn" onClick={handleClearCart}>
          Clear Cart
        </button>
      </div>
      
      <div className="cart-container">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Total</span>
          </div>
          
          <div className="cart-items">
            {cart.items.map(item => (
              <CartItem key={`${item.id}-${item.updatedAt}`} item={item} />
            ))}
          </div>
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            <div className="summary-row">
              <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>{formatPrice(cart.total * 0.1)}</span>
            </div>
            
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>{formatPrice(cart.total * 1.1)}</span>
            </div>
          </div>
          
          <div className="cart-actions">
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
          
          <div className="secure-checkout">
            <span className="lock-icon"></span>
            <span>Secure checkout · end-to-end encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;