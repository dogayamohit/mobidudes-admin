import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { editBlogCategory } from "../../api/blog";
import { toast } from "react-toastify";

export default function EditBlogsCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);

  /* Prefill from navigation state */
  useEffect(() => {
    if (location.state?.name) {
      setFormData({ name: location.state.name });
    } else {
      // Safety fallback
      navigate("/blog-categories");
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.info("Category name is required");
      return;
    }

    try {

      setLoading(true);
      
      await editBlogCategory(id, { name: formData.name });
      
      toast.success("Category updated successfully");
      navigate("/blog-categories");

    } catch (error) {

      toast.error("Failed to update category");
      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Edit Category" />

      <ComponentCard title="Category Details">
        <div className="mb-5">
          <label className="block mb-1 font-medium">Edit Category</label>
          <input
            type="text"
            placeholder="Enter Category"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Save Category"}
        </Button>
      </ComponentCard>
    </>
  );
}
