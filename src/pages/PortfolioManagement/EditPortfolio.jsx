import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

import {
  updatePortfolio,
  getPortfolioCategories,
} from "../../api/portfolio";
import { toast } from "react-toastify";

/* IMAGE URL HELPER */
const getImageUrl = (img) =>
  img?.startsWith("http")
    ? img
    : `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${img}`;


export default function EditPortfolio() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState([]); // array
  const [existingImages, setExistingImages] = useState([]); // from backend

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    website_url: "",
    android_url: "",
    ios_url: "",
    technologies: "",
    description: "",
    image: [], // new images (File[])
  });



  /* ---------------- SET INITIAL DATA ---------------- */
  const location = useLocation();

  // useEffect(() => {

  //   if (location.state) {

  //     setFormData({
  //       title: location.state.title || "",
  //       category_id: location.state.category_id || "",
  //       website_url: location.state.website_url || "",
  //       android_url: location.state.android_url || "",
  //       ios_url: location.state.ios_url || "",
  //       technologies: location.state.technologies || "",
  //       description: location.state.description || "",
  //       image: null, // IMPORTANT
  //     });

  //     setPreview(
  //       location.state.image
  //         ? `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${location.state.image}`
  //         : null
  //     );

  //   }

  // }, [location.state]);

  useEffect(() => {
    if (location.state) {
      setFormData({
        title: location.state.title || "",
        category_id: location.state.category_id || "",
        website_url: location.state.website_url || "",
        android_url: location.state.android_url || "",
        ios_url: location.state.ios_url || "",
        technologies: location.state.technologies || "",
        description: location.state.description || "",
        image: [],
      });

      if (location.state.image) {
        const imgs = location.state.image.split(",");

        setExistingImages(imgs);
        setPreview(imgs.map((img) => getImageUrl(img)));
      }
    }
  }, [location.state]);



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

    }
  };


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
      image: [...prev.image, ...files],
    }));

    setPreview((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = "";
  };


  const handleRemoveImage = (index) => {
    // if index belongs to existing images
    if (index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingImages.length;
      setFormData((prev) => ({
        ...prev,
        image: prev.image.filter((_, i) => i !== newIndex),
      }));
    }

    setPreview((prev) => prev.filter((_, i) => i !== index));
  };



  /* ---------------- SUBMIT ---------------- */
  // const handleSubmit = async () => {
  //   try {

  //     const payload = new FormData();

  //     payload.append("title", formData.title);
  //     payload.append("category_id", formData.category_id);
  //     payload.append("website_url", formData.website_url);
  //     payload.append("android_url", formData.android_url);
  //     payload.append("ios_url", formData.ios_url);
  //     payload.append("technologies", formData.technologies);
  //     payload.append("description", formData.description);

  //     // ⭐ only append if new image selected
  //     if (formData.image instanceof File) {
  //       payload.append("image", formData.image);
  //     }

  //     await updatePortfolio(id, payload);

  //     toast.success("Portfolio updated successfully");
  //     navigate("/portfolios");

  //   } catch (err) {

  //     toast.error(err.message);

  //   }
  // };

  const handleSubmit = async () => {
    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image" && value !== "" && value !== null) {
          payload.append(key, value);
        }
      });

      // existing images (comma-separated)
      if (existingImages.length) {
        payload.append("existing_images", existingImages.join(","));
      }

      // new images
      formData.image.forEach((file) => {
        payload.append("image", file);
      });

      await updatePortfolio(id, payload);
      toast.success("Portfolio updated successfully");
      navigate("/portfolios");
    } catch (err) {
      toast.error("Update failed");
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

  const selectedCategory = categories.find(
    (cat) => String(cat.id) === String(formData.category_id)
  );

  const isMobileApp = selectedCategory?.name?.toLowerCase().includes("mobile");


  return (
    <>

      <PageBreadCrumb pageTitle="Edit Portfolio" />

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
                onChange={(e) =>
                  handleChange("category_id", Number(e.target.value))
                }
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
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
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

            <Button onClick={handleSubmit}>Update</Button>

          </div>

        </ComponentCard>

      </div>
    </>
  );
}
