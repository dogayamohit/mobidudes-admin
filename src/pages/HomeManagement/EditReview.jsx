import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { toast } from "react-toastify";

import { getReviewById, updateReview } from "../../api/home";

export default function EditReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    star: "",
    content: "",
    image: null,
    preview: "",
  });

  // 🔹 fetch review
  useEffect(() => {
    fetchReview();
  }, [id]);

  const BASE_URL = "http://192.168.1.5:7002";

  const fetchReview = async () => {
    try {
      const data = await getReviewById(id);

      setFormData({
        name: data.name || "",
        designation: data.designation || "",
        star: data.star || "",
        content: data.content || "",
        image: null,
        preview: data.image ? `${BASE_URL}/${data.image}` : "",
      });

    } catch (err) {
      toast.error("Failed to load review");
    } finally {
      setLoading(false);
    }
  };


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

  // 🔹 update submit
  const handleSubmit = async () => {
    const { name, designation, star, content, image } = formData;

    if (!name || !star || !content) {
      toast.info("Required fields missing");
      return;
    }

    const starNum = Number(star);

    if (isNaN(starNum) || starNum < 1 || starNum > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("designation", designation);
      fd.append("star", starNum);
      fd.append("content", content);

      if (image) {
        fd.append("image", image);
      }

      await updateReview(id, fd);

      toast.success("Review updated successfully");

      navigate("/reviews");

    } catch (err) {
      toast.error("Update failed");
    }
  };


  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <PageBreadCrumb pageTitle="Edit Review" />

      <div className="rounded-2xl bg-white shadow-sm w-full mx-auto max-w-[calc(100vw-var(--sidebar-space))] transition-all duration-300">

        <ComponentCard title="Edit Review Details">
          <div className="grid grid-cols-12 gap-4 mb-5">

            {/* Name */}
            <div className="col-span-12 md:col-span-6">
              <label className="block mb-1 font-medium">Name</label>
              <input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Designation */}
            <div className="col-span-12 md:col-span-6">
              <label className="block mb-1 font-medium">Designation</label>
              <input
                value={formData.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Rating */}
            <div className="col-span-12 md:col-span-6">
              <label className="block mb-1 font-medium">Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.star}
                onChange={(e) => handleChange("star", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Image */}
            <div className="col-span-12 md:col-span-6">
              <label className="block mb-1 font-medium">Profile Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange}
                className="w-full border rounded px-3 py-2"
              />

              {formData.preview && (
                <img
                  src={formData.preview}
                  className="mt-2 w-20 h-20 object-cover rounded border"
                />
              )}
            </div>

            {/* Content */}
            <div className="col-span-12">
              <label className="block mb-1 font-medium">Review Comment</label>
              <textarea
                rows="4"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

          </div>

          <Button onClick={handleSubmit}>
            Update Review
          </Button>

        </ComponentCard>
      </div>
    </>
  );
}
