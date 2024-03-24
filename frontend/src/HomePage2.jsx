import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const GroceryList = () => {
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        category: 'fruits',
        unit:'kgs'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [groceryItems, setGroceryItems] = useState({ results: [], next: null });


    const fetchGroceryItems = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/grocery-items/?page=${currentPage}`);
            setGroceryItems(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewItem({
            ...newItem,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8000/grocery-items/', newItem);
            fetchGroceryItems();
            setNewItem({
                name: '',
                description: '',
                price: '',
                category: 'fruits',
                stock: '',
                unit:'kgs'
            });
        } catch (error) {       
            if (error.response) {
      const fieldErrors = Object.entries(error.response.data).map(([fieldName, errors]) => {
        const formattedErrors = errors.join(', ');
        return `[${fieldName}]: ${formattedErrors}`;

    });
    toast.error(fieldErrors.join('\n') || 'Failed to add item. Please try again.')
              } else if (error.request) {
                setErrorMessage('No response received from the server. Please try again.');
              } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
              }

            console.error('Error adding new item :', error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        fetchGroceryItems();
    }, [currentPage]);

    return (
        <div className="max-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="container  mx-auto p-8 flex flex-col md:flex-row gap-5">
                <div className="bg-white p-6 rounded-md shadow-md flex-grow">
                    <h1 className="text-2xl mb-4 text-center font-bold">Add Grocery Item</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="flex flex-col">
                                <span className="mb-1">Name:</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={newItem.name}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="mb-1">Category:</span>
                                <select
                                    name="category"
                                    value={newItem.category}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded"
                                >
                                    <option value="fruits">Fruits</option>
                                    <option value="dairy">Dairy</option>
                                    <option value="meat">Meat</option>
                                    <option value="grains">Grains</option>
                                    <option value="canned_goods">Canned Goods</option>
                                    {/* Add more options as needed */}
                                </select>
                            </label>
                            <label className="flex flex-col">
                                <span className="mb-1">Description:</span>
                                <input
                                    type="text"
                                    name="description"
                                    value={newItem.description}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="mb-1">Price:</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={newItem.price}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded"
                                />
                            </label>

                            <span className="mt-4">Stock :</span>
                            <div className="flex flex-row mt-1 gap-2 space-between pr-2">
                                
                                <input
                                    type="number"
                                    name="stock"
                                    value={newItem.stock}
                                    onChange={handleInputChange}
                                    className=" w-[100%] border p-2 rounded"
                                />

                                <select
                                    name="unit"
                                    value={newItem.unit}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded"
                                >
                                    <option value="kgs">Kilograms</option>
                                    <option value="grams">Grams</option>
                                    <option value="liters">Liters</option>
                                    <option value="number">Number</option>
                                </select>

                            </div>
                        </div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Item</button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-md shadow-md h-[90vh] flex-grow">
                    <h2 className="text-2xl font-bold mb-4 text-center">Grocery List</h2>
                   

                    <div className="h-[520px] overflow-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="sticky top-0 text-xs text-white uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Product name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Stock
                                    </th>

                                </tr>
                            </thead>
                            <tbody >
                                {groceryItems.results.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`${index % 2 === 0 ? 'even:bg-gray-50 even:dark:bg-gray-800' : 'odd:bg-white odd:dark:bg-gray-900'
                                            } border-b dark:border-gray-700`}
                                    >
                                        <td className="px-6 py-4 font-medium text-black whitespace-nowrap ">
                                            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                        </td>
                                        <td className="px-6 py-4 text-black">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
                                        <td className="px-6 py-4 text-black">{`Rs. ${item.price}`}</td>
                                        <td className="px-6 py-4 text-black">{`
              ${item.stock} ${item.unit}`}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* </div> */}
                    </div>



                    {groceryItems.count > 12 &&
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`${currentPage !== 1 ? 'bg-blue-500':'bg-blue-200'} text-white px-3 py-1 rounded`}
                            >
                               {'<<Previous'}
                            </button>
                            <span className="text-md">Page {currentPage}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!groceryItems.next}
                                className={`${!groceryItems.next ? 'bg-blue-200':'bg-blue-500'} text-white px-3 py-1 rounded`}
                            >
                                {'Next>>'}
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default GroceryList;
