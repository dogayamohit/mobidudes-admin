import React, { useState, useMemo, useEffect } from "react";
import { getCareerList, toggleCareerStatus, downloadCareerResume, deleteCareer } from "../../api/career";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Modal } from "../../components/ui/fullScreenModal/Modal";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { IoIosEye } from "react-icons/io";
import { MdDeleteOutline, MdDownload } from "react-icons/md";
import { toast } from "react-toastify";


/* ---------------- ICONS ---------------- */
const icons = {
    sortAsc: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 inline-block ml-1">
            <path d="M5 10l5-5 5 5H5z" />
        </svg>
    ),
    sortDesc: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 inline-block ml-1">
            <path d="M5 10l5 5 5-5H5z" />
        </svg>
    ),
};

/* ---------------- COMPONENT ---------------- */
export default function CarrerTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [deleteRow, setDeleteRow] = useState(null);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchCareers = async () => {
            try {
                setLoading(true);
                const res = await getCareerList();

                const mappedData = res.map((item, index) => ({
                    id: item.id,

                    sno: index + 1,

                    applid: `APP-${String(item.id).padStart(3, "0")}`,

                    date: item.created_at?.split("T")[0],

                    name: item.name,
                    email: item.email,
                    mobile: item.phone,

                    // ✅ Vacancy / Job info
                    vacancyId: item.vacancy?.id || null,
                    vacancyName: item.vacancy?.job_name || "—",

                    profile: item.role || item.vacancy?.job_name || "—",

                    experience:
                        item.experience_type === "experienced"
                            ? `${item.total_experience_years || 0}Y ${item.total_experience_months || 0}M`
                            : "Fresher",

                    availableInDays: item.available_in_days ?? "—",

                    currentSalary: item.current_salary || "—",
                    expectedSalary: item.expected_salary || "—",

                    select: item.is_active,

                    resume: item.resume
                        ? `https://cloudwapptechnologies.com/mobidudes/api/${item.resume}`
                        : null,
                }));

                setData(mappedData);

            } catch (err) {
                toast.error("Failed to fetch career applications");
            } finally {
                setLoading(false);
            }
        };

        fetchCareers();
    }, []);


    /* ---------------- FILTER ---------------- */
    const filteredData = useMemo(() => {
        return data.filter(
            (item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.email.toString().includes(search)
        );
    }, [search, data]);


    /* ---------------- SORT ---------------- */
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        const sorted = [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key] ?? "";
            const bVal = b[sortConfig.key] ?? "";
            if (typeof aVal === "string") return aVal.localeCompare(bVal);
            return aVal - bVal;
        });
        return sortConfig.direction === "asc" ? sorted : sorted.reverse();
    }, [filteredData, sortConfig]);

    const start = (currentPage - 1) * perPage;
    const paginatedData = sortedData.slice(start, start + perPage);
    const totalPages = Math.ceil(sortedData.length / perPage);


    const handleDelete = async () => {
        try {
            await deleteCareer(deleteRow.id);

            setData((prev) =>
                prev.filter((item) => item.id !== deleteRow.id)
            );

            setDeleteRow(null);
            toast.success("Deleted successfully");
        } catch (error) {
            toast.error("Delete failed");
        }
    };


    const handleDownloadResume = async (row) => {
        try {
            const res = await downloadCareerResume(row.id);

            const blob = new Blob([res.data]);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `resume-${row.applid}.pdf`;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Resume download failed ❌");
        }
    };


    const handleSort = (key) => {
        if (sortConfig.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === "asc" ? "desc" : "asc",
            });
        } else {
            setSortConfig({ key, direction: "asc" });
        }
    };


    // toggel handler 
    const toggleSelect = async (row) => {
        const newStatus = !row.select;

        try {
            // 🔥 API call
            await toggleCareerStatus(row.id, newStatus);

            // ✅ Update UI only if API success
            setData((prev) =>
                prev.map((item) =>
                    item.id === row.id
                        ? { ...item, select: newStatus }
                        : item
                )
            );
        } catch (error) {
            alert("Failed to update status ❌");
            console.error(error);
        }
    };


    return (
        <>
            <PageBreadcrumb pageTitle="Data Table" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6">

                {/* Controls */}
                <div className="mb-4 flex items-center justify-between gap-3">
                    <select
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option>
                    </select>

                    <div className="flex items-center gap-3">
                        <Input
                            type="text"
                            placeholder="Search ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="min-w-[260px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />

                    </div>
                </div>


                {/* Loading */}
                {loading && (
                    <div className="text-center py-6 text-gray-500 font-medium">
                        Loading applications...
                    </div>
                )}

                {/* Table */}
                <div className="relative overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-gray-50">
                            <tr>
                                {[
                                    { key: "sno", label: "S.No" },
                                    { key: "applid", label: "Application ID" },
                                    { key: "date", label: "Date" },
                                    { key: "name", label: "Name" },
                                    { key: "email", label: "Email" },
                                    { key: "mobile", label: "Mobile" },
                                    { key: "profile", label: "Profile" },
                                    { key: "select", label: "Select" },
                                    { key: "resume", label: "Resume" },
                                    { key: "actions", label: "Action" },
                                ].map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer select-none"
                                        onClick={() => col.key !== "image" && col.key !== "actions" && handleSort(col.key)}
                                    >
                                        {col.label}
                                        {sortConfig.key === col.key && (
                                            <span>
                                                {sortConfig.direction === "asc" ? icons.sortAsc : icons.sortDesc}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {paginatedData.map((item, index) => (
                                <tr
                                    key={item.sno}
                                    className={`transition hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                                        }`}
                                >
                                    <td className="px-4 py-4 font-medium text-gray-800">
                                        {item.sno}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {item.applid}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {item.date}
                                    </td>

                                    <td className="px-4 py-4 text-gray-800">
                                        {item.name}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {item.email}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {item.mobile}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {item.profile}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">


                                        <button
                                            onClick={() => toggleSelect(item)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
  ${item.select ? "bg-blue-600" : "bg-gray-300"}`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
    ${item.select ? "translate-x-5" : "translate-x-1"}`}
                                            />
                                        </button>
                                    </td>


                                    <td className="px-4 py-4 text-center">
                                        {item.resume ? (
                                            <button
                                                onClick={() => handleDownloadResume(item)}
                                                className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 transition"
                                                title="Download Resume"
                                            >
                                                <MdDownload size={20} />
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-sm">—</span>
                                        )}
                                    </td>


                                    <td className="px-3 py-4 flex gap-2">
                                        <Button
                                            onClick={() =>
                                                navigate(`/careers/view/${item.id}`, {
                                                    state: item, // ✅ send full row
                                                })
                                            }
                                            size="sm"
                                            variant="view"
                                            startIcon={<IoIosEye size={20} />}
                                        />

                                        <Button
                                            onClick={() => setDeleteRow(item)}
                                            size="sm"
                                            variant="delete"
                                            startIcon={<MdDeleteOutline size={20} />}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Delete modal */}
            <Modal
                isOpen={!!deleteRow}
                onClose={() => setDeleteRow(null)}
                className="flex items-center justify-center max-w-[350px] m-4"
            >
                <div className="bg-gray-200 rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Delete this item?</h3>
                        <p className="text-gray-500 mb-6">
                            This action cannot be undone. Are you sure you want to delete{" "}
                            <span className="font-medium text-gray-700">{deleteRow?.name}</span>?
                        </p>

                        <div className="flex justify-center gap-4 w-full">
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteRow(null)}
                                className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
