import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddCarModal from './AddCarModal';
import FilterModal from './FilterModal';
import { useAuth } from './Auth/AuthContext';
import EditCarModal from './EditCarModal';
import api from './Auth/axiosinstance';
import { toast } from 'react-toastify';

const HomePage = () => {
    const [cars, setCars] = useState([]);
    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const [isOpenEdit, setIsOpenEdit] = useState(false)
    const [filterApplied, setFilterAppleid] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const navigate = useNavigate();
    const { logout, setSelectedCar } = useAuth()

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await api.get('/cars/filter');
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const handleFilter = async (e, filters) => {
        e.preventDefault()
        const filteredParams = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );

        try {
            const response = await api.get('/cars/filter', {
                params: filteredParams,
            });
            console.log(response);
            setCars(response.data)
            //   onFilter(response.data);
            if (Object.keys(filteredParams).length !== 0) {
                setFilterAppleid(true)
            } else {
                setFilterAppleid(false)
            }
            onCloseFilter();
        } catch (error) {

            console.error(error.response.data.detail[0]['loc'][1]);
            let field = error.response.data.detail[0]['loc'][1]
            let er = error.response.data.detail[0]['msg']
            toast.error(`Error On Field [${field}], ${er} `)
        }

    };


    const handleSearch = () => {
        api.get('/cars/search/', {
            params: { 'keyword': searchInput }
        }).then((response) => {
            console.log(response.data);
            setCars(response.data)
        }).catch((error) => {
            console.error('Error searching cars:', error);
        })

    };

    const handleDelete = (car_id) => {
        console.log(car_id);
        api.delete(`/cars/${car_id}`).then((response) => {
            if (response.status === 200) {
                fetchCars()
                setSearchInput('')
            }
        })
    }


    const handleAddCarClick = () => {
        // navigate('/add-car');
        setIsOpenAdd(true)
    };

    const onCloseAdd = () => {
        setIsOpenAdd(false)
    }

    const handleFilterClick = () => {
        // navigate('/add-car');
        setIsOpenFilter(true)
    };

    const onCloseFilter = () => {
        setIsOpenFilter(false)
    }


    const handleEditClick = () => {
        // navigate('/add-car');
        setIsOpenFilter(true)
    };

    const onCloseEdit = () => {
        setIsOpenFilter(false)
    }

    // <AddCarModal isOpen={isOpenAdd} onClose={onCloseAdd} updateData={fetchCars} />
    // <FilterModal isOpen={isOpenFilter} onClose={onCloseFilter} onFilter={handleFilter} />
    // <EditCarModal isOpen={isOpenEdit} onClose={()=>setIsOpenEdit(false)} updateData={fetchCars} />

    return (

        <div className="container mx-auto p-8">
            <AddCarModal isOpen={isOpenAdd} onClose={onCloseAdd} updateData={fetchCars} />
            <FilterModal isOpen={isOpenFilter} onClose={onCloseFilter} onFilter={handleFilter} />
            <EditCarModal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)} updateData={fetchCars} />

            <h2 className="text-2xl font-bold mb-4">List of Cars</h2>
            <div className="flex justify-between mb-4">
                <button onClick={handleAddCarClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white" class="inline-block mr-2 mb-1">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2" />
                        <line x1="12" y1="6" x2="12" y2="18" stroke="white" stroke-width="2" />
                        <line x1="6" y1="12" x2="18" y2="12" stroke="white" stroke-width="2" />
                    </svg>
                    Add Car
                </button>
                <div className='flex flex-row gap-1'>
                    {!filterApplied ? <button onClick={handleFilterClick} className="bg-white hover:bg-blue-600 hover:text-white text-blue-500 border  border-blue-500 font-semibold py-1 px-2 rounded">
                        Filter
                    </button>
                        :
                        <button onClick={handleFilterClick} className="bg-blue-900 text-white border  border-blue-500 font-semibold py-1 px-2 rounded">
                            Filter Applied
                        </button>
                    }
                    <div className="flex">
                        <input type="text" onChange={(e) => setSearchInput(e.target.value)} placeholder="Search..." className="border border-gray-300 rounded-l px-4 py-2 outline-none" />
                        <button onClick={handleSearch} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-r">
                            Search
                        </button>
                    </div>

                    <button className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded" onClick={logout}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white" className="inline-block mr-2">
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M7 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18l-4-4H9a2 2 0 0 1-2-2V3zm10 6h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1z" />
                        </svg>
                        Logout
                    </button>

                </div>
            </div>
            <table className="min-w-full border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="text-left py-2 px-4 border border-gray-200">Make</th>
                        <th className="text-left py-2 px-4 border border-gray-200">Model</th>
                        <th className="text-left py-2 px-4 border border-gray-200">Engine Capacity</th>
                        <th className="text-left py-2 px-4 border border-gray-200">Power</th>
                        <th className="text-left py-2 px-4 border border-gray-200">Torque</th>
                        <th className="text-left py-2 px-4 border border-gray-200">Options</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car) => (
                        <tr key={car._id} className="border-b border-gray-200">
                            <td className="py-2 px-4 border border-gray-200">{car.make}</td>
                            <td className="py-2 px-4 border border-gray-200">{car.model}</td>
                            <td className="py-2 px-4 border border-gray-200">{car.engine_capacity}</td>
                            <td className="py-2 px-4 border border-gray-200">{car.power}</td>
                            <td className="py-2 px-4 border border-gray-200">{car.torque}</td>
                            <td className="py-2 px-4 border border-gray-200">

                                <button onClick={() => { setSelectedCar(car), setIsOpenEdit(true) }} className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded'>
                                    Edit
                                </button>
                                <button onClick={() => { handleDelete(car._id) }} className='ml-2 bg-red-800 hover:bg-red-900 text-white font-bold py-1 px-2 rounded'>
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

export default HomePage;
