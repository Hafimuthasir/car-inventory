import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';
const EditCarModal = ({ isOpen, onClose, updateData}) => {
  const {selectedCar} = useAuth()
    const [formData, setFormData] = useState({
      make: '',
      model: '',
      engine_capacity: '',
      power: '',
      torque: ''
    });


    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Perform form submission
        await axios.put(`http://localhost:8000/api/cars/${selectedCar._id}`, formData).then((response)=>{
            if (response.status === 200){
                updateData()
                onClose();
            }
            setFormData({
                make: '',
                model: '',
                engine_capacity: '',
                power: '',
                torque: '',
              })
        });
        
      } catch (error) {
        console.error('Error adding car:', error);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    useEffect(() => {
      setFormData({
        make: selectedCar.make,
        model: selectedCar.model,
        engine_capacity: selectedCar.engine_capacity,
        power: selectedCar.power,
        torque: selectedCar.torque
      })
    }, [selectedCar])
    
  
    return (
      
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-900 opacity-75" onClick={() => onClose()}></div>
        {/* Modal */}
        <div className="bg-white p-8 rounded shadow-lg w-1/2 relative">
          {/* Close button */}
          <button onClick={() => onClose(false)} className="absolute top-0 right-0 m-4 text-gray-700 hover:text-gray-900">&times;</button>
          <h2 className="text-2xl font-bold mb-4">Add Car</h2>
          {/* Form */}
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="make">Make:</label>
            <input type="text" id="make" name="make" value={formData.make} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="model">Model:</label>
            <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="engine_capacity">Engine Capacity:</label>
            <input type="text" id="engine_capacity" name="engine_capacity" value={formData.engine_capacity} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="power">Power:</label>
            <input type="text" id="power" name="power" value={formData.power} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="torque">Torque:</label>
            <input type="text" id="torque" name="torque" value={formData.torque} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 focus:outline-none focus:shadow-outline"
            >
              Add Car
            </button>
          </form>
        </div>
      </div>

    );
  };

export default EditCarModal;
