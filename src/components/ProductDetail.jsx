import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/actions';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            navigate('/404');
            return;
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        brand: product.brand
      }));

      // Show feedback
      const btn = document.querySelector('.add-to-cart-detail');
      if (btn) {
        btn.textContent = '✅ Added!';
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
        }, 1500);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="product-detail loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail error">
        <h2>Error Loading Product</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail not-found">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Products
      </button>

      <div className="detail-container">
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.title}
              loading="lazy"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt={`${product.title} ${index + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1>{product.title}</h1>
            <div className="product-meta">
              <span className="brand">{product.brand || 'No brand'}</span>
              <span className="category">{product.category}</span>
            </div>
          </div>

          <div className="product-rating">
            <div className="stars">
              {'⭐'.repeat(Math.floor(product.rating || 0))}
              {product.rating % 1 >= 0.5 && '⭐'}
            </div>
            <span className="rating-value">{(product.rating || 0).toFixed(1)}</span>
            <span className="reviews">({product.reviews?.length || 0} reviews)</span>
          </div>

          <div className="product-price-container">
            <div className="current-price">{formatPrice(product.price)}</div>
            {product.discountPercentage && (
              <>
                <div className="original-price">
                  {formatPrice(product.price * (1 + product.discountPercentage / 100))}
                </div>
                <div className="discount">
                  Save {Math.round(product.discountPercentage)}%
                </div>
              </>
            )}
          </div>

          <div className="product-stock">
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.stock > 0 && (
              <span className="stock-count">{product.stock} units available</span>
            )}
          </div>

          <div className="product-tabs">
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Specs
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="product-description">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="product-specs">
                <div className="specs-grid">
                  <div><strong>Brand:</strong> {product.brand || 'N/A'}</div>
                  <div><strong>Category:</strong> {product.category}</div>
                  <div><strong>SKU:</strong> #{product.id}</div>
                  <div><strong>Weight:</strong> {product.weight || 'N/A'}</div>
                  <div><strong>Dimensions:</strong> {product.dimensions || 'N/A'}</div>
                  <div><strong>Warranty:</strong> {product.warrantyInformation || '1 year'}</div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="product-reviews">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-name">{review.reviewerName || 'Anonymous'}</div>
                          <div className="review-rating">
                            {'⭐'.repeat(review.rating)}
                            <span className="rating-value">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <div className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-reviews">No reviews yet. Be the first to review this product</p>
                )}
              </div>
            )}
          </div>

          <div className="product-actions">
            <button
              className="add-to-cart-detail"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="buy-now" disabled={product.stock <= 0}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;