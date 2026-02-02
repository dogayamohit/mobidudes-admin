import { useState } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { toast } from "react-toastify";

export default function AddReviewStatic() {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    star: "",
    comment: "",
    image: null,
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
        image: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = () => {
    const { name, designation, star, comment, image } = formData;

    if (!name || !designation || !star || !comment || !image) {
      toast.info("All fields are required");
      return;
    }

    // 🔹 STATIC ACTION
    console.log("Review Data:", {
      name,
      designation,
      star,
      comment,
      image,
    });

    toast.success("Review added (static)");

    // optional: reset form
    setFormData({
      name: "",
      designation: "",
      star: "",
      comment: "",
      image: null,
      preview: "",
    });
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Add Review" />

      <ComponentCard title="Review Details">
        <div className="grid grid-cols-12 gap-4 mb-5">

          {/* Name */}
          <div className="col-span-12 md:col-span-6">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Designation */}
          <div className="col-span-12 md:col-span-6">
            <label className="block mb-1 font-medium">Designation</label>
            <input
              type="text"
              placeholder="Enter designation"
              value={formData.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Rating */}
          <div className="col-span-12 md:col-span-6">
            <label className="block mb-1 font-medium">Rating (1–5)</label>
            <input
              type="number"
              min="1"
              max="5"
              placeholder="Enter rating"
              value={formData.star}
              onChange={(e) => handleChange("star", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Image */}
          <div className="col-span-12 md:col-span-6">
            <label className="block mb-1 font-medium">Profile Image</label>
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

          {/* Comment */}
          <div className="col-span-12">
            <label className="block mb-1 font-medium">Review Comment</label>
            <textarea
              rows="4"
              placeholder="Write review..."
              value={formData.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

        </div>

        <Button onClick={handleSubmit}>Save</Button>
      </ComponentCard>
    </>
  );
}
    