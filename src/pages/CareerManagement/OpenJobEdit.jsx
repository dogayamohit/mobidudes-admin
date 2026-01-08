import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { getCareerRoles, updateVacancy } from "../../api/career";
import { toast } from "react-toastify";

export default function OpenJobEdit() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    open_roles: "",
    role_id: "",
    experience: "",
  });

  /* ================= LOAD STATE DATA ================= */
  useEffect(() => {
  if (state && roles.length) {
    const matchedRole = roles.find(
      (r) => r.name === state.position || r.name === state.role
    );

    setFormData({
      open_roles: state.openings,
      role_id: matchedRole ? matchedRole.id : "",
      experience: state.experience,
    });
  }
}, [state, roles]);


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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= UPDATE ================= */
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

      await updateVacancy(id, payload);

      toast.success("Job updated successfully");
      navigate("/careers/open-jobs");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!state) return <div>Invalid access</div>;

  return (
    <>
      <PageBreadCrumb pageTitle="Edit Open Job" />

      <ComponentCard title="Open Job Details">
        <div className="flex gap-4">

          {/* Openings */}
          <div className="mb-5 w-1/3">
            <label className="block mb-1 font-medium">No of Openings</label>
            <input
              type="number"
              value={formData.open_roles}
              onChange={(e) => handleChange("open_roles", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Role */}
          <div className="mb-5 w-1/3">
            <label className="block mb-1 font-medium">Position</label>
            <select
              value={formData.role_id}
              onChange={(e) => handleChange("role_id", e.target.value)}
              className="w-full border rounded px-3 py-2"
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
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </ComponentCard>
    </>
  );
}
