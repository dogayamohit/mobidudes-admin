import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CKTextEditor from "../../components/editor/CKTextEditor";
import Button from "../../components/ui/button/Button";
import { editService, getServiceCategories } from "../../api/service";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const getImageUrl = (path) =>
  `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${path}`;


const extractPath = (url) => {
  if (!url) return "";
  const base = import.meta.env.VITE_API_BASE_URL_FOR_IMAGES;
  return url.replace(base + "/", "");
};


export default function EditService() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  /* ---------- CATEGORY ---------- */
  const [categories, setCategories] = useState([]);

  /* ---------- FORM STATE ---------- */
  const [formData, setFormData] = useState({
    category_id: "",
    short_description: "",
    description: "",
    existingImages: [], // old images
    newImages: [],      // newly uploaded
  });


  /* ---------- LOAD CATEGORY ---------- */
  useEffect(() => {
    getServiceCategories().then(setCategories);
  }, []);

  /* ---------- LOAD SERVICE FROM ROUTE STATE ---------- */
  useEffect(() => {
    if (!state || categories.length === 0) return;

    const existingImages = state.image
      ? state.image.split(",").map((img) => ({
        preview: getImageUrl(img),
        path: img, // save backend path
      }))
      : [];

    setFormData({
      category_id: String(state.category_id),
      short_description: state.shortDescription,
      description: state.description || "",
      existingImages,
      newImages: [],
    });
  }, [state, categories]);




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



  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
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

      // Existing images (paths only)
      const existingPaths = formData.existingImages.map(img => img.path);
      payload.append("existing_images", existingPaths.join(","));

      // New images (files)
      formData.newImages.forEach(img => {
        payload.append("image", img.file); // ✅ MUST be "image" to match Multer
      });

      await editService(id, payload);

      toast.success("Service updated successfully");
      navigate("/services");
    } catch (error) {
      console.error("Update failed:", error?.response?.data || error);
      toast.error("Update failed");
    }
  };


  return (
    <>
      <PageBreadCrumb pageTitle="Edit Service" />

      <ComponentCard title="Service Details">
        <div className="flex gap-4">
          {/* CATEGORY */}
          <div className="mb-5 w-1/2">
            <label className="block mb-1 font-medium">
              Select Category
            </label>
            <select
              value={formData.category_id} // default from state
              onChange={(e) => handleChange("category_id", e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>


          </div>

          {/* SHORT DESCRIPTION */}
          <div className="mb-5 w-1/2">
            <label className="block mb-1 font-medium">
              Short Description
            </label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) =>
                handleChange(
                  "short_description",
                  e.target.value
                )
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* IMAGES */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">
            Service Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex gap-3 mt-4 flex-wrap">
            {formData.existingImages.map((img, index) => (
              <div key={index} className="relative w-32 h-24 border rounded">
                <img src={img.preview} className="w-full h-full object-cover rounded" />
                <button onClick={() => removeExistingImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1">
                  <MdClose size={14} />
                </button>
              </div>
            ))}

            {formData.newImages.map((img, index) => (
              <div key={index} className="relative w-32 h-24 border rounded">
                <img src={img.preview} className="w-full h-full object-cover rounded" />
                <button onClick={() => removeNewImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1">
                  <MdClose size={14} />
                </button>
              </div>
            ))}
          </div>


        </div>

        {/* DESCRIPTION */}
        <div className="mb-5">
          <label className="block mb-1 font-medium">
            Description
          </label>
          <CKTextEditor
            value={formData.description}
            onChange={(data) =>
              handleChange("description", data)
            }
          />
        </div>

        <Button onClick={handleSubmit}>Update Service</Button>
      </ComponentCard>
    </>
  );
}
