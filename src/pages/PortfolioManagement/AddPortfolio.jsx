import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

import { addPortfolio, getPortfolioCategories } from "../../api/portfolio";
import { toast } from "react-toastify";


export default function AddPortfolio() {

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    website_url: "",
    android_url: "",
    ios_url: "",
    technologies: "",
    description: "",
    image: [],
  });

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {

    fetchCategories();

  }, []);

  const fetchCategories = async () => {
    try {

      const res = await getPortfolioCategories();
      setCategories(res);

    } catch (err) {

      console.error(err);
      toast.error("Failed to fetch categories");

    }
  };

  useEffect(() => {

    if (isMobileApp) {

      setFormData((prev) => ({
        ...prev,
        website_url: "",
      }));

    }

  }, [formData.category_id]);


  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (field, value) => {

    setFormData((prev) => ({ ...prev, [field]: value }));

  };

  /* ---------------- IMAGE CHANGE ---------------- */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setFormData((prev) => ({
      ...prev,
      image: [...prev.image, ...files], // ✅ append
    }));

    setPreview((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = ""; // ✅ allow re-select same image
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));

    setPreview((prev) => prev.filter((_, i) => i !== index));
  };



  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image" && value !== null && value !== "") {
          payload.append(key, value);
        }
      });

      // 👇 SAME key "image" multiple times
      formData.image.forEach((file) => {
        payload.append("image", file);
      });

      await addPortfolio(payload);
      toast.success("Portfolio added successfully");
      navigate("/portfolios");
    } catch (err) {
      toast.error("Failed to add portfolio");
    }
  };


  const selectedCategory = categories.find(
    (cat) => String(cat.id) === String(formData.category_id)
  );

  const isMobileApp = selectedCategory?.name?.toLowerCase().includes("mobile");


  return (
    <>

      <PageBreadCrumb pageTitle="Add Portfolio" />

      <div
        className="
                    rounded-2xl border border-gray-200 bg-white shadow-sm
                    p-4 sm:p-6 md:p-6 lg:p-4
                    w-full mx-auto
                    max-w-[calc(100vw-var(--sidebar-space))]
                    transition-all duration-300
                "
      >
        <ComponentCard title="Portfolio Details">

          <div className="grid grid-cols-12 gap-4">

            {/* Title */}
            <div className="col-span-6">

              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

            </div>


            {/* Category */}
            <div className="col-span-6">

              <label className="block mb-1 font-medium">Category</label>
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


            {/* Website URL */}
            {!isMobileApp && (
              <div className="col-span-6">

                <label className="block mb-1 font-medium">Website URL</label>
                <input
                  type="text"
                  value={formData.website_url}
                  onChange={(e) => handleChange("website_url", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />

              </div>
            )}


            {/* Android URL */}
            {isMobileApp && (
              <div className="col-span-6">
                <label className="block mb-1 font-medium">Android URL</label>
                <input
                  type="text"
                  value={formData.android_url}
                  onChange={(e) => handleChange("android_url", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}


            {/* IOS URL */}
            {isMobileApp && (
              <div className="col-span-6">

                <label className="block mb-1 font-medium">IOS URL</label>
                <input
                  type="text"
                  value={formData.ios_url}
                  onChange={(e) => handleChange("ios_url", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />

              </div>
            )}

            {/* Technologies */}
            <div className="col-span-6">

              <label className="block mb-1 font-medium">Technologies</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => handleChange("technologies", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

            </div>

          </div>


          {/* Image */}
          <div className="mt-5">

            <label className="block mb-1 font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />




            <div className="flex gap-3 mt-3 flex-wrap">
              {preview.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    className="w-40 h-28 object-cover rounded border"
                  />

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>


          </div>


          {/* Description */}
          <div className="mt-5">

            <label className="block mb-1 font-medium">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border rounded p-3"
            />

          </div>

          {/* Save */}
          <div className="mt-6">

            <Button onClick={handleSubmit}>Save</Button>

          </div>

        </ComponentCard>
      </div>

    </>
  );
}
