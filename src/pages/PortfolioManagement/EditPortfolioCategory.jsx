import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { editPortfolioCategory } from "../../api/portfolio";
import { toast } from "react-toastify";

export default function EditPortfolioCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [formData, setFormData] = useState({ category: "" });

  /* ---------- PREFILL FROM STATE ---------- */
  useEffect(() => {
    if (location.state) {
      setFormData({ category: location.state.name });
    }
  }, [location.state]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.category) {
        toast.info("Category cannot be empty");
        return;
      }
      await editPortfolioCategory(id, { name: formData.category });
      toast.success("Category updated successfully");
      navigate("/portfolio-categories");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Edit Category" />
      <ComponentCard title="Category Details">
        <div className="mb-5">
          <label className="block mb-1 font-medium">Category Name</label>
          <input
            type="text"
            placeholder="Enter Category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <Button onClick={handleSubmit}>Save</Button>
      </ComponentCard>
    </>
  );
}
