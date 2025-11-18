import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../COMPONENTS/RelatedProducts';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch product directly from MongoDB backend
  const fetchProductData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}:3000/products/${productId}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();

      setProductData(data);
      if (data.image && data.image.length > 0) {
        setImage(data.image);
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  if (loading) return <div className="text-center py-20">Loading product...</div>;
  if (!productData) return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="border-t-2 pt-10">
      {/* -------- Main Product Layout -------- */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-16">
        
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 md:flex-row">
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto justify-between md:w-[18%] lg:w-[15%] gap-3">
            {Array.isArray(productData.image) && productData.image.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setImage(img)}
                className="w-[24%] md:w-full flex-shrink-0 cursor-pointer rounded-md"
                alt={`Thumbnail ${i + 1}`}
              />
            ))}
          </div>

          <div className="w-full md:w-[82%] lg:w-[85%]">
            <img
              src={image}
              alt={productData.name}
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl lg:text-3xl">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            {'★'.repeat(4)}<span className="text-gray-300">★</span>
            <p className="pl-2 text-sm text-gray-600">(122 reviews)</p>
          </div>

          <p className="mt-4 text-2xl font-semibold">
            {currency}{productData.price}
          </p>

          <p className="mt-4 text-gray-600 text-sm lg:w-4/5">{productData.description}</p>

          <div className="flex flex-col gap-3 my-6">
            <p className="font-medium text-sm">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {Array.isArray(productData.sizes) && productData.sizes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSize(s)}
                  className={`border py-2 px-4 rounded-md text-sm ${
                    s === size ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              // if (!size) return alert('Please select a size first.');
              addToCart(productData._id);
            }}
            className="bg-black text-white px-8 py-3 text-sm uppercase hover:bg-gray-800"
          >
            Add to Cart
          </button>

          <hr className="mt-8 border-gray-300" />
          <div className="text-sm text-gray-500 mt-4 space-y-1">
            <p>100% Original product.</p>
            <p>Cash on delivery available.</p>
            <p>Easy return & exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* -------- Description & Reviews -------- */}
      <div className="mt-16">
        <div className="flex border-b border-gray-300">
          <button className="border border-gray-300 px-5 py-3 font-medium bg-white">
            Description
          </button>
          <button className="border border-gray-300 px-5 py-3">
            Reviews (122)
          </button>
        </div>
        <div className="border border-t-0 p-6 text-gray-600 text-sm">
          <p>{productData.description}</p>
          <p>More details can be added here later.</p>
        </div>
      </div>

      {/* -------- Related Products -------- */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
