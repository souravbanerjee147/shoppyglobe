import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/actions';
import PropTypes from 'prop-types';
import './ProductItem.css';

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      brand: product.brand
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="product-item">
      <Link to={`/product/${product.id}`} className="product-item-link">
        <div className="product-image-container">
          <img 
            src={product.thumbnail} 
            alt={product.title}
            loading="lazy"
            className="product-image"
          />
          {product.discountPercentage && (
            <span className="product-discount">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>
        
        <div className="product-info">
          <div className="product-brand">{product.brand || 'Generic'}</div>
          <h3 className="product-title">{product.title}</h3>
          <p className="product-description">
            {product.description ? product.description.substring(0, 80) + '...' : 'No description available'}
          </p>
          
          <div className="product-footer">
            <div className="product-price">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.discountPercentage && (
                <span className="original-price">
                  {formatPrice(product.price * (1 + product.discountPercentage/100))}
                </span>
              )}
            </div>
            
            <div className="product-rating">
              <span className="rating-stars">
                {'⭐'.repeat(Math.floor(product.rating || 0))}
                {(product.rating || 0) % 1 >= 0.5 && '⭐'}
              </span>
              <span className="rating-value">{(product.rating || 0).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <button 
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        aria-label={`Add ${product.title} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    brand: PropTypes.string,
    description: PropTypes.string,
    discountPercentage: PropTypes.number,
    rating: PropTypes.number
  }).isRequired
};

export default ProductItem;