import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import { addFaq } from "../../api/home";
import { createFaqSchema } from "../../validations/faq";

/* -------- INITIAL FORM -------- */
const initialFaqData = {
    question: "",
    answer: "",
};

export default function AddFaq() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialFaqData);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});


    /* -------- HANDLE CHANGE -------- */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* -------- SUBMIT -------- */
    const handleSubmit = async () => {
        const result = createFaqSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors = {};

            result.error.issues.forEach((err) => {
                const fieldName = err.path[0];
                fieldErrors[fieldName] = err.message;
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            setSubmitting(true);
            await addFaq(result.data);
            toast.success("FAQ added successfully");
            navigate("/faqs");
        } catch (error) {
            toast.error("Failed to add FAQ");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageBreadcrumb pageTitle="Add FAQ" />

            <div
                className="
                    rounded-2xl border border-gray-200 bg-white shadow-sm
                    p-4 sm:p-6 md:p-6 lg:p-4
                    w-full mx-auto
                    max-w-[calc(100vw-var(--sidebar-space))]
                    transition-all duration-300
                "
            >
                <div className="grid gap-6">
                    {/* Question */}
                    <div>
                        <Label>Question</Label>
                        <Input
                            name="question"
                            value={form.question}
                            onChange={handleChange}
                            placeholder="Enter FAQ question"
                        />
                        {errors.question && (
                            <p className="text-xs text-red-400 px-1 mt-2">{errors.question}</p>
                        )}
                    </div>

                    {/* Answer */}
                    <div>
                        <Label>Answer</Label>
                        <TextArea
                            value={form.answer}
                            onChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    answer: value,
                                }))
                            }
                            rows={5}
                            placeholder="Enter FAQ answer"
                        />
                        {errors.answer && (
                            <p className="text-xs text-red-400 px-1 mt-1">{errors.answer}</p>
                        )}
                    </div>

                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => navigate("/faq")}>
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Adding..." : "Add FAQ"}
                    </Button>
                </div>
            </div>
        </>
    );
}
