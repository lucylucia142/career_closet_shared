import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductDetail = () => {
  const { productId } = useParams();
  const { addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}:3000/products/${productId}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();

      // Normalize image field → always array
      const normalizedImage = Array.isArray(data.image)
        ? data.image
        : [data.image].filter(Boolean);

      // Normalize sizes field → always array, with fallback
      const normalizedSizes =
        Array.isArray(data.sizes) && data.sizes.length > 0
          ? data.sizes
          : ['S', 'M', 'L', 'XL'];

      setProductData({ ...data, image: normalizedImage, sizes: normalizedSizes });
      setImage(normalizedImage[0] || '');
    } catch (err) {
      console.error('Failed to fetch product:', err);
    }
  };

  if (!productData) return <p>Loading product details...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Images */}
      <div className="flex gap-6">
        <div className="flex flex-col gap-2">
          {productData.image.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`product-${idx}`}
              className={`w-20 h-20 object-cover border cursor-pointer ${
                img === image ? 'border-orange-500' : ''
              }`}
              onClick={() => setImage(img)}
              loading="lazy"
            />
          ))}
        </div>
        <img
          src={image}
          alt="main"
          className="flex-1 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Details */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold">{productData.name}</h1>
        <p className="text-lg text-gray-600">R{productData.price}</p>
        <p className="mt-2 text-gray-700">{productData.description}</p>

        {/* Sizes */}
        <div className="flex flex-col gap-3 mt-6">
          <p className="font-medium">Select Size</p>
          <div className="flex gap-2 flex-wrap">
            {productData.sizes.map((item, index) => (
              <button
                onClick={() => setSize(item)}
                className={`border py-2 px-4 text-sm rounded-md ${
                  item === size
                    ? 'border-orange-500 bg-orange-100'
                    : 'bg-gray-100'
                }`}
                key={index}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={() => {
            if (!size) {
              alert('Please select a size before adding to cart.');
              return;
            }
            addToCart(productData._id, size);
          }}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
