import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../COMPONENTS/Title';
import SearchBar from '../COMPONENTS/SearchBar';

const Collections = () => {
 
  

  const { products, loading, search, currency, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fallbackImage = 'https://via.placeholder.com/300x300?text=No+Image';

  const applyFilter = () => {
    let filtered = products.slice();

    if (showSearch && search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(filtered);
    setCurrentPage(1);
  };

  const sortProduct = () => {
    let sorted = [...filterProducts];
    switch (sortType) {
      case 'low-high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilterProducts(sorted);
    setCurrentPage(1);
  };

  useEffect(() => { applyFilter(); }, [products, category, subCategory, search, showSearch]);
  useEffect(() => { if (filterProducts.length) sortProduct(); }, [sortType]);
  useEffect(() => { if (products && products.length > 0) setFilterProducts(products); else setFilterProducts([]); }, [products]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev => prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]);
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]);
  };

  const totalItems = filterProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filterProducts.slice(startIndex, endIndex);

  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPage = page => setCurrentPage(page);

  return (
    <div className="my-12 px-4 sm:px-6 lg:px-8">
      <SearchBar />

      {/* Header */}
      <div className="text-center py-12">
        <Title text1="ALL" text2="COLLECTIONS" className="text-4xl sm:text-5xl" />
        <p className="w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto text-base sm:text-lg text-gray-600 mt-4 leading-relaxed">
          Explore our full range of products, curated for quality, style, and modern elegance.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-6">
        {/* Filters */}
        <div className="min-w-40">
          <p onClick={() => setShowFilter(!showFilter)} className="my-1 text-lg flex items-center cursor-pointer gap-1">
            FILTERS <span className={`sm:hidden inline-block transition-transform ${showFilter ? 'rotate-90' : ''}`}>▶</span>
          </p>

          {/* Category Filter */}
          <div className={`border border-gray-300 pl-3 py-2 mt-4 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className="mb-2 text-xs font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-1 text-xs font-light text-gray-700">
              {['Medicine', 'Construction', 'Hospitality'].map(cat => (
                <label key={cat} className="flex gap-1 items-center">
                  <input type="checkbox" className="w-2.5" value={cat} onChange={toggleCategory} />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* SubCategory Filter */}
          <div className={`border border-gray-300 pl-3 py-2 my-3 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className="mb-2 text-xs font-medium">TYPE</p>
            <div className="flex flex-col gap-1 text-xs font-light text-gray-700">
              {['Topwear', 'Bottomwear', 'Winterwear'].map(sub => (
                <label key={sub} className="flex gap-1 items-center">
                  <input type="checkbox" className="w-2.5" value={sub} onChange={toggleSubCategory} />
                  {sub}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1="ALL" text2="COLLECTIONS" className="text-3xl sm:text-4xl" />
            <select className="border-2 border-gray-300 text-sm px-2" onChange={e => setSortType(e.target.value)} value={sortType}>
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-pulse grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
                ))}
              </div>
              <p className="text-gray-500 mt-8">Loading our collection...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
                {currentProducts.length > 0 ? currentProducts.map(item => (
                  <Link to={`/product/${item._id}`} key={item._id} className="p-4 rounded-2xl shadow hover:shadow-lg transition block">
                    <img src={Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : fallbackImage} alt={item.name} className="w-full h-64 object-cover rounded-xl mb-3" />
                    <h3 className="text-sm font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{currency}{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                  </Link>
                )) : <p className="col-span-full text-center text-gray-500">No products match your filters.</p>}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <button onClick={goToPreviousPage} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}>Previous</button>
                  <div className="flex space-x-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button key={page} onClick={() => goToPage(page)} className={`px-3 py-1 rounded-lg text-sm font-medium transition ${currentPage === page ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{page}</button>
                      );
                    })}
                  </div>
                  <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
