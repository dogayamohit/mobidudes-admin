import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { updateAbout } from "../../api/aboutUs";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CKTextEditor from "../../components/editor/CKTextEditor";
import Button from "../../components/ui/button/Button";
import { toast } from "react-toastify";

/* ---------- MEDIA URL HELPER ---------- */
const getMediaUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${url}`;
};


const extractPath = (url) => {
    if (!url) return "";
    if (!url.startsWith("http")) return url;
    const base = import.meta.env.VITE_API_BASE_URL_FOR_IMAGES;
    return url.replace(base + "/", "");
};


export default function AboutDashboardEdit() {
    const { state } = useLocation();
    const { id } = useParams();
    const [editorData, setEditorData] = useState("");
    const [editorKey, setEditorKey] = useState(0);
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        clients: "",
        initiatives: "",
        trophies: "",
        existingImages: [],
        existingVideos: [],
        newImages: [],
        newVideos: [],
    });


    /* ---------- PREFILL DATA ---------- */
    useEffect(() => {
        if (!state) return;

        setFormData({
            title: state.title || "",
            clients: state.client || "",
            initiatives: state.initiatives || "",
            trophies: state.trophies || "",

            // ✅ allImages is ALREADY an array of full URLs
            existingImages: state.allImages || [],

            // ✅ allVideos is array of paths → convert to URLs
            existingVideos: state.allVideos
                ? state.allVideos.map((vid) => vid.trim())
                : [],

            newImages: [],
            newVideos: [],
        });

        setEditorData(
            state.description?.startsWith("<")
                ? state.description
                : `<p>${state.description}</p>`
        );
    }, [state]);


    /* ---------- HANDLERS ---------- */
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // const handleImageChange = (e) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         newImages: Array.from(e.target.files),
    //     }));
    // };

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

    // const handleVideoChange = (e) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         newVideos: Array.from(e.target.files),
    //     }));
    // };

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);

        const mappedVideos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setFormData((prev) => ({
            ...prev,
            newVideos: [...prev.newVideos, ...mappedVideos],
        }));
    };


    const removeExistingImage = (index) => {

        setFormData(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, i) => i !== index),
        }));
    };


    const removeExistingVideo = (index) => {

        setFormData(prev => ({
            ...prev,
            existingVideos: prev.existingVideos.filter((_, i) => i !== index),
        }));
    };


    /* ---------------- REMOVE NEW IMAGE ---------------- */
    const removeNewImage = (index) => {
        URL.revokeObjectURL(formData.newImages[index].preview);

        setFormData((prev) => ({
            ...prev,
            newImages: prev.newImages.filter((_, i) => i !== index),
        }));
    };


    const removeNewVideo = (index) => {
        URL.revokeObjectURL(formData.newVideos[index].preview);

        setFormData((prev) => ({
            ...prev,
            newVideos: prev.newVideos.filter((_, i) => i !== index),
        }));
    };


    const handleSubmit = async () => {
        try {
            const payload = new FormData();

            payload.append("title", formData.title);
            payload.append("description", editorData);
            payload.append("clients", formData.clients);
            payload.append("initiatives", formData.initiatives);
            payload.append("trophies", formData.trophies);


            // ✅ Convert FULL URLs → paths
            const cleanImages = formData.existingImages.map(extractPath);
            const cleanVideos = formData.existingVideos.map(extractPath);


            payload.append("existing_images", cleanImages.join(","));
            payload.append("existing_videos", cleanVideos.join(","));


            formData.newImages.forEach((img) => {
                payload.append("image", img.file);
            });


            formData.newVideos.forEach((vid) => {
                payload.append("video", vid.file);
            });


            for (let pair of payload.entries()) {
                console.log(pair[0], pair[1]);
            }


            const res = await updateAbout(id, payload);

            toast.success("About Us updated successfully");
            navigate("/about-us");

        } catch (err) {
            console.error("UPDATE ERROR:", err?.response?.data || err);
            toast.error("Update failed");
        }
    };


    return (
        <>
            <PageBreadcrumb pageTitle="About Us Edit" />

            <ComponentCard title="Edit About Us">
                {/* Title */}
                <div className="mb-6">
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>


                {/* Description */}
                <div className="mb-6">
                    <label className="block mb-1 font-medium">Description</label>
                    <CKTextEditor
                        key={editorKey}
                        value={editorData}   // ✅ CORRECT
                        onChange={(data) => {
                            setEditorData(data);
                            handleChange("description", data);
                        }}
                    />
                </div>


                {/* Stats */}
                <div className="grid lg:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-1 font-medium">Client</label>
                        <input
                            type="text"
                            value={formData.clients}
                            onChange={(e) => handleChange("clients", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Initiatives</label>
                        <input
                            type="text"
                            value={formData.initiatives}
                            onChange={(e) => handleChange("initiatives", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Trophies</label>
                        <input
                            type="text"
                            value={formData.trophies}
                            onChange={(e) => handleChange("trophies", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>


                {/* Image & Video */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Images */}
                    <div>
                        <label className="block mb-1 font-medium">Images</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} />


                        <div className="flex gap-3 flex-wrap mt-3">
                            {formData.existingImages.map((img, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={getMediaUrl(img)}
                                        className="w-32 h-24 object-cover border rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}


                            {/* {formData.newImages.map((img, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={URL.createObjectURL(img)}   // 🔥 IMPORTANT
                                        className="w-32 h-24 object-cover rounded border"
                                    />
                                </div>
                            ))} */}


                            {formData.newImages.length > 0 && (
                                <div className="mb-4">
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
                        </div>
                    </div>


                    {/* Videos */}
                    <div>
                        <label className="block mb-1 font-medium">Videos</label>
                        <input type="file" accept="video/*" onChange={handleVideoChange} />

                        <div className="flex gap-3 flex-wrap mt-3">
                            {formData.existingVideos.map((vid, i) => (
                                <div key={i} className="relative">
                                    <video
                                        src={getMediaUrl(vid)}
                                        controls
                                        className="w-40 h-24 border rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingVideo(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            {formData.newVideos.map((vid, i) => (
                                <div key={i} className="relative">
                                    <video
                                        src={vid.preview}
                                        controls
                                        className="w-40 h-24 rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewVideo(i)}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}


                        </div>
                    </div>
                </div>


                {/* Submit */}
                <Button onClick={handleSubmit}>Submit</Button>
            </ComponentCard>
        </>
    );
}
