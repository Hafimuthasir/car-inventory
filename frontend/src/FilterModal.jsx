import React, { useState } from 'react';
import axios from 'axios';

const FilterModal = ({ isOpen, onClose, onFilter }) => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    min_engine_capacity: '',
    max_engine_capacity: '',
    min_power: '',
    max_power: '',
    min_torque: '',
    max_torque: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const clearAllFilters = (e) => {
    setFilters({
        make: '',
        model: '',
        min_engine_capacity: '',
        max_engine_capacity: '',
        min_power: '',
        max_power: '',
        min_torque: '',
        max_torque: '',
      })
      onFilter(e,{})
  }

//   const handleFilter = async (e) => {
//     e.preventDefault()
//     const filteredParams = Object.fromEntries(
//         Object.entries(filters).filter(([_, value]) => value !== '')
//       );
//     try {
//       const response = await axios.get('http://localhost:8000/api/cars/filter', {
//         params: filteredParams,
//       });
//       console.log(response.data);
//     //   onFilter(response.data);
//     //   onClose();
//     } catch (error) {
//       console.error('Error filtering cars:', error);
//     }
//   };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 opacity-75" onClick={() => onClose()}></div>
        <div className="bg-white p-8 rounded shadow-lg w-1/2 relative">
          <button onClick={() => onClose(false)} className="absolute top-0 right-0 m-4 text-gray-700 hover:text-gray-900">&times;</button>
          <h2 className="text-2xl font-bold mb-4">Filter Car</h2>
          <form onSubmit={(e)=>{onFilter(e,filters)}}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="make">Make:</label>
            
            <input type="text" id="make" name="make" value={filters.make} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          
          <label className="block mb-2" htmlFor="min_engine_capacity">Engine Capacity:</label>
          <div className="mb-4 flex flex-row gap-2">
            <input type="text" placeholder='Minimum' id="engine_capacity" name="min_engine_capacity" value={filters.min_engine_capacity} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
            <input type="text" placeholder='Maximum' id="engine_capacity" name="max_engine_capacity" value={filters.max_engine_capacity} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>

            <label className="block mb-2" htmlFor="power">Power:</label>
          <div className="mb-4 flex flex-row gap-2">
            <input type="text" placeholder='Minimum' id="power" name="min_power" value={filters.min_power} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
            <input type="text" placeholder='Maximum' id="power" name="max_power" value={filters.max_power} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
            <label className="block mb-2" htmlFor="torque">Torque:</label>
          <div className="mb-4 flex flex-row gap-2">
            <input type="text" placeholder='Minimum' id="torque" name="min_torque" value={filters.min_torque} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
            <input type="text" placeholder='Maximum' id="torque" name="max_torque" value={filters.max_torque} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 focus:outline-none focus:shadow-outline"
            >
              Apply Filter
            </button>
            
            <button
              onClick={(e)=>{clearAllFilters()}}
              className="ml-2 bg-red-800 text-white px-4 py-2 rounded shadow hover:bg-red-900 focus:outline-none focus:shadow-outline"
            >
              Clear All
            </button>
          </form>
        </div>
      </div>
  );
};

export default FilterModal;
