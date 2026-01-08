import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { getReviewById } from "../../api/home";

export default function ReviewView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                setLoading(true);
                const data = await getReviewById(id);

                if (!data) {
                    navigate("/home/reviewtable", { replace: true });
                    return;
                }

                // Map API fields to table-friendly keys
                setReview({
                    sno: data.id, // optional, you can number it
                    name: data.name,
                    designation: data.designation,
                    image: data.image.startsWith("http")
                        ? data.image
                        : `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${data.image}`,
                    star: data.star,
                    comment: data.content,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                });
            } catch (error) {
                console.error(error);
                navigate("/home/reviewtable", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [id, navigate]);

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (!review) return <div className="p-6 text-center">Review not found</div>;

    // Fields to render dynamically
    const fields = [
        // { label: "S.No", key: "sno" },
        { label: "Name", key: "name" },
        { label: "Designation", key: "designation" },
        { label: "Rating", key: "star" },
        { label: "Description", key: "comment" },
        { label: "Profile Image", key: "image", isImage: true }
    ];

    return (
        <>
            <PageBreadcrumb pageTitle="Review Detail" />

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <Section title="Information">
                    <Grid>
                        {fields.map((field) => (
                            <Item
                                key={field.key}
                                label={field.label}
                                value={
                                    field.isImage ? (
                                        <img
                                            src={review[field.key]}
                                            alt={review.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : field.key === "star" ? (
                                        <div className="text-yellow-500 text-lg">
                                            {"★".repeat(review[field.key]) + "☆".repeat(5 - review[field.key])}
                                        </div>
                                    ) : (
                                        review[field.key]
                                    )
                                }
                            />
                        ))}
                    </Grid>
                </Section>
            </div>
        </>
    );
}

/* ===================== REUSABLE UI ===================== */
const Section = ({ title, children }) => (
    <div className="mb-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800">{title}</h4>
        {children}
    </div>
);

const Grid = ({ children }) => (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:gap-x-32">
        {children}
    </div>
);

const Item = ({ label, value }) => (
    <div>
        <p className="mb-1 text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value || "-"}</p>
    </div>
);
