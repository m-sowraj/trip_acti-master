import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import AddItemModal from "./AdditemDish";
import { toast } from "react-toastify";

const DishManager = ({ dishes, setDishes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDish, setEditDish] = useState(null);

  const filters = [
    "Veg",
    "Non-Veg",
    "Bestseller",
    "Spicy",
    "No onion or garlic",
  ];

  // Filter dishes based on search query
  const filteredDishes = dishes.filter((dish) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      dish.title?.toLowerCase().includes(searchTerm) ||
      dish.description?.toLowerCase().includes(searchTerm) ||
      dish.price?.toString().includes(searchTerm)
    );
  });

  const handleAddItem = (newItem) => {
    setDishes([...dishes, newItem]);
  };

  const toggleAvailability = (id, isAvailable) => {
    setDishes(
      dishes.map((dish) =>
        dish._id === id ? { ...dish, status: !isAvailable } : dish
      )
    );
    toast.success("Dish availability status updated successfully");

    const token = localStorage.getItem("token_partner_acti");
    
    fetch(`https://fourtrip-server.onrender.com/api/activity/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: !isAvailable }),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
  };

  const handleEditDish = (id) => {
    const dishToEdit = dishes.find((dish) => dish._id === id);
    console.log(dishToEdit);
    setEditDish(dishToEdit);
    setIsModalOpen(true);
  };

  const handleSaveDish = (updatedDish) => {
    setDishes(
      dishes.map((dish) => (dish._id === updatedDish._id ? updatedDish : dish))
    );
    setEditDish(null);
  };

  const handleDeleteDish = (id) => {
    const token = localStorage.getItem("token_partner_acti");
    
    fetch(`https://fourtrip-server.onrender.com/api/activity/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ is_deleted: true }),
    })
      .then((response) => response.json())
      .then((data) => toast.success("Dish deleted successfully"))
      .catch((error) => console.error("Error:", error));

    setDishes(dishes.filter((dish) => dish._id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow w-full px-6 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center w-full max-w-md">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setEditDish(null);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Listing
            </button>
          </div>
        </div>

        {/* <div className="flex space-x-2">
          {filters.map((filter) => (
            <span
              key={filter}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {filter}
            </span>
          ))}
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white sticky top-0">
            <tr className="border-b">
              <th className="p-4 text-left">Sr no.</th>
              <th className="p-4 text-left">Name of the Activity</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Discount</th>
              <th className="p-4 text-left">Availability status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDishes.map((dish, index) => (
              dish.is_deleted ? null :
              <tr key={dish._id} className="border-b">
                <td className="p-4">{index+1}</td>
                <td className="p-4">{dish.title}</td>
                <td className="p-4">{dish.price}</td>
                <td className="p-4">{dish.discount_percentage}%</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
                        dish.status ? "bg-green-500" : "bg-gray-300"
                      }`}
                      onClick={() => toggleAvailability(dish._id,dish.status)}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          dish.status ? "translate-x-6" : ""
                        }`}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        handleDeleteDish(dish._id);
                        console.log(dish._id);
                      }}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditDish(dish._id)}
                      className="p-1 text-blue-500 hover:text-blue-600"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDishes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No activities found matching your search.
          </div>
        )}
      </div>

      {/* <div className="p-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">01 page of 21</span>
        <div className="flex items-center space-x-2">
          <button className="p-1"><ChevronLeft className="w-5 h-5" /></button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded">01</button>
          <button className="px-3 py-1">02</button>
          <button className="px-3 py-1">03</button>
          <button className="px-3 py-1">...</button>
          <button className="px-3 py-1">21</button>
          <button className="p-1"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div> */}

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditDish(null);
        }}
        onAddItem={editDish ? handleSaveDish : handleAddItem}
        editDish={editDish}
      />
    </div>
  );
};

export default DishManager;
