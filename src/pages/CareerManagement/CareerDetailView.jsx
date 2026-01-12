import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { MdDownload } from "react-icons/md";
import { downloadCareerResume } from "../../api/career";
import { toast } from "react-toastify";


export default function CareerPostView() {

  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {

    navigate("/career", { replace: true });
    return null;

  }

  const group = state;


  const handleDownloadResume = async () => {
    try {

      const res = await downloadCareerResume(group.id);

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${group.name}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      toast.error("Resume download failed");

    }
  };


  return (
    <>
      <PageBreadcrumb pageTitle="View Detail" />

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        <Section title="Candidate Information">

          <Grid>

            <Item label="Application ID" value={group.applid} />
            <Item label="Date" value={group.date} />
            <Item label="Name" value={group.name} />
            <Item label="Email" value={group.email} />
            <Item label="Mobile" value={group.mobile} />
            <Item label="Profile" value={group.profile} />
            <Item label="Experience" value={group.experience} />
            <Item label="Current Salary" value={group.currentSalary} />
            <Item label="Expected Salary" value={group.expectedSalary} />
            <Item label="Selected" value={group.select ? "Yes" : "No"} />

            <Item
              label="Resume"
              value={
                group.resume ? (
                  <button
                    onClick={handleDownloadResume}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <MdDownload size={18} />
                    Download
                  </button>
                ) : (
                  "—"
                )
              }
            />

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
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
    {children}
  </div>
);

const Item = ({ label, value }) => (
  <div>
    <p className="mb-1 text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);
