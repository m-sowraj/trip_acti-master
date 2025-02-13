import React, { useRef, useState, useEffect } from "react";
import { X, Upload, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

const AddItemModal = ({ isOpen, onClose, onAddItem, editDish }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    // category: "",
    price: "",
    discount: "",
    available: true,
    images: [],
    location: "",
    included: "",
    duration: "",
    agerequirement: "",
    dresscode: "",
    accessibility: "",
    difficulty: "",
    timeSlot: "",
    whatsincluded: [""],
  });
  useEffect(() => {
    if (editDish) {
      console.log(editDish);
      setFormData({
        name: editDish.title,
        description: editDish.description,
        // category: editDish.category,
        price: editDish.price,
        discount: editDish.discount_percentage,
        available: true,
        images: [],
        location: editDish.location,
        included: editDish.whatsincluded,
        
          duration: editDish.additional_info.duration,
          agerequirement: editDish.additional_info.agerequirement,
          dresscode: editDish.additional_info.dresscode,
          accessibility: editDish.additional_info.accessibility,
          difficulty: editDish.additional_info.difficulty,
          timeSlot: editDish.slots[0],
          whatsincluded: editDish.whatsincluded.length ? editDish.whatsincluded : [""],
      });
      // const previewUrls = editDish.images.map((image) => {
      //   return image instanceof File || image instanceof Blob
      //     ? URL.createObjectURL(image)
      //     : image;
      // });
      // setPreviewUrls(previewUrls);
    } else {
      setFormData({
        name: "",
        description: "",
        // category: "",
        price: "",
        discount: "",
        available: true,
        images: [],
        location: "",
        included: "",
          duration: "",
          agerequirement: "",
          dresscode: "",
          accessibility: "",
          difficulty: "",
          timeSlot: "",
          whatsincluded: [""],
      });
      setPreviewUrls([]);
    }
  }, [editDish]);

  const fileInputRef = useRef(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 85;
    const remainingSlots = maxFiles - formData.images.length;
    const allowedFiles = files.slice(0, remainingSlots);

    const newPreviewUrls = allowedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...allowedFiles],
    }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        imageFiles.forEach((file) => dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;
        handleImageChange({ target: { files: dataTransfer.files } });
      }
    }
  };

  const handleClose = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setFormData((prev) => ({ ...prev, images: [] }));
    onClose();
  };

  const categories = [
    "Veg",
    "Non-Veg",
    "Bestseller",
    "Spicy",
    "No onion or garlic",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIncludedItemChange = (index, value) => {
    const newIncludedItems = [...formData.whatsincluded];
    newIncludedItems[index] = value;
    setFormData((prev) => ({
      ...prev,
      whatsincluded: newIncludedItems,
    }));
  };

  const addIncludedItem = () => {
    setFormData((prev) => ({
      ...prev,
      whatsincluded: [...prev.whatsincluded, ""],
    }));
  };

  const removeIncludedItem = (index) => {
    if (formData.whatsincluded.length > 1) {
      const newIncludedItems = formData.whatsincluded.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        whatsincluded: newIncludedItems,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();    
    console.log(formData)

    if (editDish) {
      // PUT request to update item in database
      console.log("Editent",editDish)

      fetch(`https://fourtrip-server.onrender.com/api/activity/${editDish._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_partner_rest')}`
          },
          body: JSON.stringify({
              title: formData.name,
              description: formData.description,
              whatsincluded: formData.whatsincluded,
              additional_info: {
                  duration: formData.duration,
                  agerequirement: formData.agerequirement,
                  dresscode: formData.dresscode,
                  accessibility: formData.accessibility,
                  difficulty: formData.difficulty
              },
              price: Number(formData.price),
              slots: [formData.timeSlot],
              discount_percentage: Number(formData.discount),
              images: ["image3.jpg"]
          }),
          })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log('Success:', data);
              onAddItem(data.data);
              handleClose();
              setFormData({
                name: "",
                description: "",
                // category: "",
                price: "",
                discount: "",
                available: true,
                images: [],
                location: "",
                included: "",
                duration: "",
                agerequirement: "",
                dresscode: "",
                accessibility: "",
                difficulty: "",
                timeSlot: "",
                whatsincluded: [""],
              });
            }else {
              console.log('Error:', data);
              toast.error('Error adding item',data.error);
            }
          })
          .catch((error) => console.error(error));
    }
    else {
      // POST request to add item to database
      fetch('https://fourtrip-server.onrender.com/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_partner_rest')}`
          },
          body: JSON.stringify({
              title: formData.name,
              description: formData.description,
              whatsincluded: formData.whatsincluded,
              additional_info: {
                  duration: formData.duration,
                  agerequirement: formData.agerequirement,
                  dresscode: formData.dresscode,
                  accessibility: formData.accessibility,
                  difficulty: formData.difficulty
              },
              price: Number(formData.price),
              slots: [formData.timeSlot],
              discount_percentage: Number(formData.discount),
              images: ["image3.jpg"]
          }),
          })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log('Success:', data);
              onAddItem(data.data);
              handleClose();
              setFormData({
                name: "",
                description: "",
                // category: "",
                price: "",
                discount: "",
                available: true,
                images: [],
                location: "",
                included: "",
                duration: "",
                agerequirement: "",
                dresscode: "",
                accessibility: "",
                difficulty: "",
                timeSlot: "",
                whatsincluded: [""],
              });
            }else {
              console.log('Error:', data);
              toast.error('Error adding item',data.error);
            }
          })
          .catch((error) => console.error(error));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {editDish ? "Edit Activity" : "Add New Activity"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                  {!editDish && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* What's Included Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">What's Included</h3>
                <div className="space-y-2">
                  {formData.whatsincluded.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleIncludedItemChange(index, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="Enter included item"
                      />
                      <button
                        type="button"
                        onClick={() => removeIncludedItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIncludedItem}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-1" />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dresscode
                    </label>
                    <input
                      name="dresscode"
                      type="text"
                      value={formData.dresscode}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age Requirements
                    </label>
                    <input
                      name="agerequirement"
                      type="text"
                      value={formData.agerequirement}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accessibility
                    </label>
                    <input
                      name="accessibility"
                      type="text"
                      value={formData.accessibility}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <input
                      name="difficulty"
                      type="text"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      name="duration"
                      type="text"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Pricing & Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Slot
                    </label>
                    <input
                      name="timeSlot"
                      type="text"
                      value={formData.timeSlot}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Images</h3>
                <div
                  className="mt-1 flex flex-col justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 hover:border-blue-500 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="mt-1 text-xs text-gray-500">({formData.images.length}/85)</p>
                  </div>
                </div>

                {previewUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t p-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {editDish ? "Update Activity" : "Add Activity"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
