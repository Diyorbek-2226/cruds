import React, { useEffect, useState } from 'react';

const Add = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newProductTitle, setNewProductTitle] = useState(''); // New state for adding a product
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoryResponse = await fetch('https://dummyjson.com/products/category-list');
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        // Fetch products in "Smartphones" category
        const productResponse = await fetch('https://dummyjson.com/products/category/smartphones');
        const productData = await productResponse.json();
        setProducts(productData.products);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProductTitle,
          description: newProductDescription,
          price: Number(newProductPrice),
        }),
      });
      const data = await response.json();
      console.log('Added product:', data);
      setProducts([...products, data]); // Add new product to the list
      setNewProductTitle(''); // Clear input fields
      setNewProductDescription('');
      setNewProductPrice('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async id => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
        }),
      });
      const data = await response.json();
      console.log('Updated product:', data);
      setProducts(products.map(product => (product.id === id ? data : product)));
      setEditingProduct(null);
      setNewTitle('');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async id => {
    try {
      await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
      });
      console.log('Deleted product');
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateCategory = async id => {
    try {
      const response = await fetch(`https://dummyjson.com/products/category/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryTitle,
        }),
      });
      const data = await response.json();
      console.log('Updated category:', data);
      setCategories(categories.map(cat => (cat.id === id ? data : cat)));
      setEditingCategory(null);
      setNewCategoryTitle('');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async id => {
    try {
      await fetch(`https://dummyjson.com/products/category/${id}`, {
        method: 'DELETE',
      });
      console.log('Deleted category');
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Sort categories and products
  const sortedCategories = [...categories].sort((a, b) => {
    return sortAsc ? a.localeCompare(b) : b.localeCompare(a);
  });

  const sortedProducts = [...products].sort((a, b) => {
    return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
  });

  // Search and filter categories and products
  const filteredCategories = sortedCategories.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = sortedProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSortOrder = () => {
    setSortAsc(!sortAsc);
  };

  return (
    <div>
      <h1>Product Management</h1>

      <div>
        <input
          type="text"
          placeholder="Search categories and products..."
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px' }}
        />
        <button onClick={toggleSortOrder}>
          Sort {sortAsc ? 'Descending' : 'Ascending'}
        </button>
      </div>

      <h2>Add New Product</h2>
      <div>
        <input
          type="text"
          placeholder="Product Title"
          value={newProductTitle}
          onChange={e => setNewProductTitle(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Product Description"
          value={newProductDescription}
          onChange={e => setNewProductDescription(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px' }}
        />
        <input
          type="number"
          placeholder="Product Price"
          value={newProductPrice}
          onChange={e => setNewProductPrice(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px' }}
        />
        <button onClick={handleAddProduct} style={{ marginTop: '20px' }}>
          Add Product
        </button>
      </div>

      <h2>Categories</h2>
  
          {filteredCategories.map((cat, index) => (
            <p key={index}>
              
                {editingCategory === cat.id ? (
                  <input
                    type="text"
                    value={newCategoryTitle}
                    onChange={e => setNewCategoryTitle(e.target.value)}
                  />
                ) : (
                  cat
                )}
              </p>
  
          ))}
      

      <h2>Products</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                ) : (
                  product.title
                )}
              </td>
              <td>{product.price}</td>
              <td>
                {editingProduct === product.id ? (
                  <button onClick={() => handleUpdateProduct(product.id)}>Save</button>
                ) : (
                  <button onClick={() => setEditingProduct(product.id)}>Edit</button>
                )}
                <button onClick={() => handleDeleteProduct(product.id)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Add;
