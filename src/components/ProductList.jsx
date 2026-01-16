import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductItem from './ProductItem';
import PropTypes from 'prop-types';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchTerm = useSelector(state => state.search);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = searchTerm 
          ? `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`
          : 'https://dummyjson.com/products';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="product-list loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list error">
        <h2>Error Loading Products</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h1>Our Products</h1>
        {searchTerm && (
          <p className="search-results">
            Showing results for: <strong>"{searchTerm}"</strong>
          </p>
        )}
      </div>
      
      {products.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or browse all products</p>
        </div>
      ) : (
        <>
          <p className="product-count">
            Found {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
          <div className="products-grid">
            {products.map(product => (
              <ProductItem 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.array
};

export default ProductList;