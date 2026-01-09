import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import { getFaqById, updateFaq } from "../../api/home";

/* -------- INITIAL FORM -------- */
const initialFaqData = {
  question: "",
  answer: "",
};

export default function EditFaq() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialFaqData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* -------- FETCH FAQ -------- */
  useEffect(() => {

    const fetchFaq = async () => {

      try {

        setLoading(true);
        const data = await getFaqById(id);

        setForm({
          question: data.question,
          answer: data.answer,
        });

      } catch {

        toast.error("Failed to load FAQ");
        navigate("/faqs");

      } finally {

        setLoading(false);

      }

    };

    fetchFaq();
    
  }, [id, navigate]);

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

    if (!form.question || !form.answer) {

      toast.error("All fields are required");
      return;

    }

    try {

      setSubmitting(true);

      await updateFaq(id, form);
      toast.success("FAQ updated successfully");
      navigate("/faqs");

    } catch {

      toast.error("Failed to update FAQ");

    } finally {

      setSubmitting(false);

    }

  };

  if (loading) {

    return <div className="p-6 text-gray-500">Loading FAQ...</div>;

  }


  return (
    <>
      <PageBreadcrumb pageTitle="Edit FAQ" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6">

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
            {submitting ? "Updating..." : "Update FAQ"}
          </Button>
          
        </div>
      </div>
    </>
  );
}
