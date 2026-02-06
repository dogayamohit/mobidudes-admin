import React, { useEffect, useState } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { getCareerRoles, addVacancy } from "../../api/career";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddOpenjob() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    open_roles: "",
    role_id: "",
    experience: "",
  });

  /* ================= FETCH ROLES ================= */
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getCareerRoles();
        setRoles(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!formData.role_id || !formData.open_roles || !formData.experience) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        role_id: Number(formData.role_id),
        open_roles: Number(formData.open_roles),
        experience: formData.experience,
      };

      await addVacancy(payload);

      toast.success("Job added successfully");

      setFormData({
        open_roles: "",
        role_id: "",
        experience: "",
      });

      navigate("/careers/open-jobs");
    } catch (error) {
      toast.error("Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Add Open Job" />

      <div
        className="
                    rounded-2xl border border-gray-200 bg-white shadow-sm
                    p-4 sm:p-6 md:p-6 lg:p-4
                    w-full mx-auto
                    max-w-[calc(100vw-var(--sidebar-space))]
                    transition-all duration-300
                "
      >

        <ComponentCard title="Open Job Details">
          <div className="flex gap-4">

            {/* No of Openings */}
            <div className="mb-5 w-1/3">
              <label className="block mb-1 font-medium">No of Openings</label>
              <input
                type="number"
                placeholder="Enter openings"
                value={formData.open_roles}
                onChange={(e) => handleChange("open_roles", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Position (ROLE) */}
            <div className="mb-5 w-1/3">
              <label className="block mb-1 font-medium">Position</label>
              <select
                value={formData.role_id}
                onChange={(e) => handleChange("role_id", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select Position</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="mb-5 w-1/3">
              <label className="block mb-1 font-medium">Experience</label>
              <input
                type="text"
                placeholder="e.g. 2-4 Years"
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </ComponentCard>

      </div>
    </>
  );
}
