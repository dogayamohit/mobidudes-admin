import { useState } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { toast } from "react-toastify";

import { addReview } from "../../api/home";
import { useNavigate } from "react-router-dom";



export default function AddReviewStatic() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        star: "",
        content: "",
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

    const handleSubmit = async () => {
        const { name, designation, star, content, image } = formData;

        if (!name || !star || !content || !image) {
            toast.info("Required fields are missing");
            return;
        }

        const starNum = Number(star);
        if (starNum < 1 || starNum > 5) {
            toast.error("Rating must be between 1 and 5");
            return;
        }

        try {
            const fd = new FormData();
            fd.append("name", name);
            fd.append("designation", designation);
            fd.append("star", starNum);
            fd.append("content", content);
            fd.append("image", image);

            await addReview(fd);

            toast.success("Review added successfully");

            setFormData({
                name: "",
                designation: "",
                star: "",
                content: "",
                image: null,
                preview: "",
            });

            navigate("/reviews");

        } catch (err) {
            toast.error("Failed to add review");
        }
    };


    return (
        <>
            <PageBreadCrumb pageTitle="Add Review" />


            <div
                className="
                    rounded-2xl bg-white shadow-sm
                    w-full mx-auto
                    max-w-[calc(100vw-var(--sidebar-space))]
                    transition-all duration-300
                "
            >

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
                                className="w-full border border-gray-200 rounded px-3 py-2"
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
                                className="w-full border border-gray-200 rounded px-3 py-2"
                            />
                        </div>

                        {/* Rating */}
                        <div className="col-span-12 md:col-span-6">
                            <label className="block mb-1 font-medium">Rating (1–5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                step="1"
                                placeholder="Enter rating"
                                value={formData.star}
                                onChange={(e) => handleChange("star", e.target.value)}
                                className="w-full border border-gray-200 rounded px-3 py-2"
                            />
                        </div>

                        {/* Image */}
                        <div className="col-span-12 md:col-span-6">
                            <label className="block mb-1 font-medium">Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full border border-gray-200 rounded px-3 py-2"
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
                                value={formData.content}
                                onChange={(e) => handleChange("content", e.target.value)}
                                className="w-full border border-gray-200 rounded px-3 py-2"
                            />

                        </div>

                    </div>

                    <Button onClick={handleSubmit}>Save</Button>
                </ComponentCard>
            </div>
        </>
    );
}
