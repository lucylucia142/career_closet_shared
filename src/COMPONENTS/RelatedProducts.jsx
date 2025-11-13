import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import Title from './Title';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      // Filter by category
      if (category) {
        productsCopy = productsCopy.filter((item) => item.category === category);
      }

      // Filter by subCategory
      if (subCategory) {
        productsCopy = productsCopy.filter((item) => item.subCategory === subCategory);
      }

      // Exclude duplicates and limit to 5
      setRelated(productsCopy.slice(0,4));
    }
  }, [products, category, subCategory]);

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={"PRODUCTS"} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6'>
        {related.length > 0 ? (
          related.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className='col-span-full text-center text-gray-500'>No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
