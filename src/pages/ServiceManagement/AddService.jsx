import React, { useState, useEffect } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CKTextEditor from "../../components/editor/CKTextEditor";
import Button from "../../components/ui/button/Button";
import { MdClose } from "react-icons/md";
import { addService, getServiceCategories } from "../../api/service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddService() {
    const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    short_description: "",
    description: "",
    newImages: [], // files for upload
  });

  /* ---------- LOAD SERVICE CATEGORIES ---------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getServiceCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  /* ---------- HANDLERS ---------- */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const mappedFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...mappedFiles],
    }));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(formData.newImages[index].preview);
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("category_id", formData.category_id);
      payload.append("short_description", formData.short_description);
      payload.append("description", formData.description);

      // Append all new images
      formData.newImages.forEach((img) => payload.append("image", img.file));

      const res = await addService(payload);
      if (res?.status) {
        toast.success("Service added successfully");
        navigate("/services");
      } else {
        toast.error(res?.message || "Failed to add service");
      }
    } catch (err) {
      console.error("Add service error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Add Service" />

      <ComponentCard title="Service Details">
        {/* CATEGORY */}
        <div className="mb-5 w-1/2">
          <label className="block mb-1 font-medium">Select Category</label>
          <select
            value={formData.category_id}
            onChange={(e) => handleChange("category_id", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* SHORT DESCRIPTION */}
        <div className="mb-5">
          <label className="block mb-1 font-medium">Short Description</label>
          <input
            type="text"
            value={formData.short_description}
            onChange={(e) => handleChange("short_description", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter short description"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Service Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded px-3 py-2"
          />

          {formData.newImages.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {formData.newImages.map((img, index) => (
                <div key={index} className="relative w-32 h-24 border rounded">
                  <img
                    src={img.preview}
                    alt="preview"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <MdClose size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CKEDITOR */}
        <div className="mb-5">
          <label className="block mb-1 font-medium">Description</label>
          <CKTextEditor
            data={formData.description} // HTML content
            onChange={(data) => handleChange("description", data)}
          />
        </div>

        {/* SUBMIT */}
        <Button onClick={handleSubmit}>Save Service</Button>
      </ComponentCard>
    </>
  );
}
