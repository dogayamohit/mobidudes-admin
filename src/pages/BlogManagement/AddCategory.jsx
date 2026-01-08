import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { addBlogCategory } from "../../api/blog";
import { toast } from "react-toastify";

export default function AddCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      await addBlogCategory({ name: formData.name });
      toast.success("Category added successfully");
      navigate("/blog-categories");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Add Blog Category" />

      <ComponentCard title="Blog Category">
        <div className="mb-5">
          <label className="block mb-1 font-medium">Add Blog Category</label>
          <input
            type="text"
            placeholder="Enter Category"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Category"}
        </Button>
      </ComponentCard>
    </>
  );
}
