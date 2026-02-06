import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { updateServiceCategory } from "../../api/service";
import { toast } from "react-toastify";


export default function EditserviceCategory() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        icon: null,
        preview: "",
    });

    useEffect(() => {
        if (location.state) {
            setFormData({
                title: location.state.title || "",
                icon: null,
                preview: location.state.icon || "", // ✅ string now
            });
        }
    }, [location.state]);


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
        if (!formData.title) {
            toast.info("Category name is required");
            return;
        }

        try {
            const payload = new FormData();
            payload.append("name", formData.title);

            if (formData.icon) {
                payload.append("icon", formData.icon);
            }

            for (let pair of payload.entries()) {
                console.log(pair[0], pair[1]);
            }



            await updateServiceCategory(id, payload);

            toast.success("Category updated successfully");
            navigate("/service-categories");
        } catch (error) {
            toast.error("Update failed");
        }
    };

    return (
        <>
            <PageBreadCrumb pageTitle="Edit Category" />

            <div
                className="
                    rounded-2xl border border-gray-200 bg-white shadow-sm
                    p-4 sm:p-6 md:p-6 lg:p-4
                    w-full mx-auto
                    max-w-[calc(100vw-var(--sidebar-space))]
                    transition-all duration-300
                "
            >


                <ComponentCard title="Category Details">
                    <div className="grid grid-cols-12 gap-4 mb-5">

                        <div className="col-span-12 md:col-span-6">
                            <label className="block mb-1 font-medium">Edit Category</label>
                            <input
                                type="text"
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

                    <Button onClick={handleSubmit}>Update</Button>
                </ComponentCard>

            </div>
        </>
    );
}
