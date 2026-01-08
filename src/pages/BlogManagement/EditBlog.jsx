import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CKTextEditor from "../../components/editor/CKTextEditor";
import Button from "../../components/ui/button/Button";
import { updateBlog, removeBlogImage, getBlogCategories } from "../../api/blog";

export default function EditBlog() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    description: "",
    oldImages: [], // full paths from DB
    newImages: [], // { file, preview } for newly uploaded
  });

  /* ---------------- PREFILL BLOG DATA ---------------- */
  useEffect(() => {
    if (!location.state) {
      navigate("/blogs");
      return;
    }

    const blog = location.state;

    // Use full paths here
    const images = blog.image
      ? blog.image.split(",").map((img) => img.trim())
      : [];

    setFormData({
      title: blog.title,
      category_id: blog.category_id,
      description: blog.description,
      oldImages: images, // full path for proper deletion & preview
      newImages: [],
    });
  }, [location.state, navigate]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getBlogCategories();
        setCategories(data);
      } catch (err) {
        console.error("Category fetch failed", err);
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- HANDLERS ---------------- */
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

  /* ---------------- REMOVE OLD IMAGE ---------------- */
  const removeOldImage = async (imagePath) => {
    try {
      setDeletingImage(imagePath);

      // Send full path, not just filename
      const res = await removeBlogImage(id, imagePath);

      if (res?.status) {
        setFormData(prev => ({
          ...prev,
          oldImages: prev.oldImages.filter(img => img !== imagePath),
        }));
      } else {
        alert(res?.message || "Failed to remove image");
      }
    } catch (error) {
      console.error("Remove image error:", error?.response || error);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setDeletingImage(null);
    }
  };


  /* ---------------- REMOVE NEW IMAGE ---------------- */
  const removeNewImage = (index) => {
    URL.revokeObjectURL(formData.newImages[index].preview);
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category_id", formData.category_id);
      payload.append("description", formData.description);

      // Old images: send full path array so backend can validate
      payload.append("old_images", JSON.stringify(formData.oldImages));

      // New images
      formData.newImages.forEach((img) => {
        payload.append("image", img.file);
      });

      const res = await updateBlog(id, payload);



      if (res?.status) {
        toast.success("Blog updated successfully");
        navigate("/blogs");
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CLEANUP URL OBJECTS ---------------- */
  useEffect(() => {
    return () => {
      formData.newImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [formData.newImages]);

  return (
    <>
      <PageBreadCrumb pageTitle="Edit Blog" />
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
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
        </div>

        {/* Old Images */}
        {formData.oldImages.length > 0 && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">Existing Images</label>
            <div className="flex gap-3 flex-wrap">
              {formData.oldImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${img}`}
                    alt={img.split("/").pop()}
                    className="w-32 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    disabled={deletingImage === img}
                    onClick={() => removeOldImage(img)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Add New Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {formData.newImages.length > 0 && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">New Images Preview</label>
            <div className="flex gap-3 flex-wrap">
              {formData.newImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.preview}
                    alt="preview"
                    className="w-32 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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
          {loading ? "Updating..." : "Update Blog"}
        </Button>
      </ComponentCard>
    </>
  );
}
