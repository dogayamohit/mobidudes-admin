import React, { useState, useEffect } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CKTextEditor from "../../components/editor/CKTextEditor";
import Button from "../../components/ui/button/Button";
import { addBlog, getBlogCategories } from "../../api/blog";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddBlog() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    description: "",
    images: [], // { file, preview }
  });

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getBlogCategories();
        setCategories(data);
      } catch (err) {
        console.error("Category fetch failed", err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const mappedFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...mappedFiles],
    }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(formData.images[index].preview);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!formData.title || !formData.category_id || !formData.description) {
      toast.info("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category_id", formData.category_id);
      payload.append("description", formData.description);

      formData.images.forEach((img) => payload.append("image", img.file));

      const res = await addBlog(payload);

      if (res?.status) {
        toast.success("Blog added successfully");
        setFormData({
          title: "",
          category_id: "",
          description: "",
          images: [],
        });
        navigate("/blogs");
        
      } else {
        toast.error(res?.message || "Add blog failed");
      }
    } catch (error) {
      console.error("Add blog error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      formData.images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [formData.images]);

  return (
    <>
      <PageBreadCrumb pageTitle="Add Blog" />

      <ComponentCard title="Blog Details">
        {/* Category */}
        <div className="mb-4">
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

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="border w-full px-3 py-2 rounded"
            placeholder="Enter blog title"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Add Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Preview */}
        {formData.images.length > 0 && (
          <div className="mb-4 flex gap-3 flex-wrap">
            {formData.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.preview}
                  alt="preview"
                  className="w-32 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Description</label>
          <CKTextEditor
            value={formData.description}
            onChange={(data) => handleChange("description", data)}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Blog"}
        </Button>
      </ComponentCard>
    </>
  );
}
