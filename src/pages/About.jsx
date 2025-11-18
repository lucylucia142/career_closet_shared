import React, { useEffect, useState } from 'react';
// Assuming you have defined your API variable correctly elsewhere
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const About = () => {
  const [products, setProducts] = useState([]);

  // Mock Vision and Mission for demonstration
  // **NOTE: Replace these with your actual company's Vision and Mission.**
  const companyVision = "To be the leading innovator in providing sustainable, high-quality products that enrich the lives of our global community.";
  const companyMission = "Our mission is to design, source, and deliver exceptional products with integrity, focusing on ethical practices, customer satisfaction, and continuous improvement in every aspect of our operation.";


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Ensure the port is correct, though often it's best to let the proxy handle it in production
        const response = await fetch(`${API_BASE_URL}:3000/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='min-h-screen bg-white text-black'>
      {/* ABOUT US Header Section */}
      <header className='py-12 border-b border-gray-300'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-5xl font-extrabold tracking-tight uppercase text-gray-900'>
            About <span className='text-gray-600'>Us</span>
          </h1>
          <p className='mt-4 text-xl text-gray-600 max-w-2xl mx-auto'>
            Driven by purpose. Crafted with passion.
          </p>
        </div>
      </header>

      {/* Vision & Mission Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12'>
          
          {/* Vision Card */}
          <div className='p-8 border border-gray-300 rounded-lg shadow-lg bg-gray-50'>
            <h2 className='text-3xl font-bold mb-4 uppercase text-gray-900 border-b pb-2 border-gray-400'>
               Our Vision
            </h2>
            <p className='text-xl text-gray-700 leading-relaxed'>
              {companyVision}
            </p>
          </div>

          {/* Mission Card */}
          <div className='p-8 border border-gray-300 rounded-lg shadow-lg bg-gray-50'>
            <h2 className='text-3xl font-bold mb-4 uppercase text-gray-900 border-b pb-2 border-gray-400'>
               Our Mission
            </h2>
            <p className='text-xl text-gray-700 leading-relaxed'>
              {companyMission}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className='py-20 border-t border-gray-300 px-4 sm:px-6 lg:px-8 bg-white'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl font-extrabold text-center mb-12 uppercase text-gray-900'>
            Featured Collection
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {products.length > 0 ? (
              products.slice(10, 14).map((product) => (
                <div
                  key={product._id}
                  className='group border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-500 transition-all duration-300'
                >
                  <img
                    src={product.image || 'https://via.placeholder.com/400x300/F5F5F5/808080?text=Product+Image'}
                    alt={product.name}
                    // Aspect ratio for a clean look
                    className='w-full h-48 object-cover border-b border-gray-200'
                  />
                  <div className='p-4 text-center'>
                    <h3 className='font-semibold text-lg text-gray-900 group-hover:text-black transition-colors'>
                      {product.name}
                    </h3>
                    <p className='text-gray-600 text-sm mt-1'>
                      {product.category}
                    </p>
                    <p className='text-black font-bold text-xl mt-3'>
                      R{product.price}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center text-gray-500 col-span-full py-10'>
                Currently loading our featured products...
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;