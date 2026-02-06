import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { addServiceCategory } from "../../api/service";
import { toast } from "react-toastify";


export default function AddserviceCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    icon: null,
    preview: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        icon: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.icon) {
      toast.info("Category name and icon are required");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.title);
      payload.append("icon", formData.icon);

      await addServiceCategory(payload);

      toast.success("Service category added successfully");
      navigate("/service-categories");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Add Category" />


      <div
        className="
                    rounded-2xl border border-gray-200 bg-white shadow-sm
                    p-4 sm:p-6 md:p-6 lg:p-4
                    w-full mx-auto
                    max-w-[calc(100vw-var(--sidebar-space))]
                    transition-all duration-300
                "
      >

        <ComponentCard title="Service Category">
          <div className="grid grid-cols-12 gap-4 mb-5">

            <div className="col-span-12 md:col-span-6">
              <label className="block mb-1 font-medium">Category Name</label>
              <input
                type="text"
                placeholder="Enter Category"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="block mb-1 font-medium">Choose Icon</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded px-3 py-2"
              />

              {formData.preview && (
                <img
                  src={formData.preview}
                  alt="Preview"
                  className="mt-2 w-20 h-20 object-cover rounded border"
                />
              )}
            </div>
          </div>

          <Button onClick={handleSubmit}>Save</Button>
        </ComponentCard>

      </div>
    </>
  );
}

