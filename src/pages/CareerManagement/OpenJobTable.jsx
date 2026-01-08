import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Modal } from "../../components/ui/fullScreenModal/Modal";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { getVacancies, toggleVacancyStatus, deleteVacancy } from "../../api/career";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";

export default function OpenJobTable() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [deleteRow, setDeleteRow] = useState(null);

    const navigate = useNavigate();

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const res = await getVacancies();

                const mapped = res.map((item, index) => ({
                    id: item.id,
                    sno: index + 1,
                    postingDate: item.createdAt.split("T")[0],
                    openings: item.open_roles,
                    position: item.job_name,
                    experience: item.experience,
                    status: item.is_active ? "Open" : "Closed",
                    is_active: item.is_active,
                }));

                setData(mapped);
            } catch (error) {
                console.error("Vacancy fetch failed", error);
            }
        };

        fetchVacancies();
    }, []);

    /* ================= FILTER ================= */
    const filteredData = useMemo(() => {
        const keyword = search.toLowerCase();
        return data.filter(
            (item) =>
                item.position.toLowerCase().includes(keyword) ||
                item.experience.toLowerCase().includes(keyword) ||
                item.status.toLowerCase().includes(keyword)
        );
    }, [search, data]);

    /* ================= SORT ================= */
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        const sorted = [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            return typeof aVal === "string"
                ? aVal.localeCompare(bVal)
                : aVal - bVal;
        });
        return sortConfig.direction === "asc" ? sorted : sorted.reverse();
    }, [filteredData, sortConfig]);

    /* ================= PAGINATION ================= */
    const start = (currentPage - 1) * perPage;
    const paginatedData = sortedData.slice(start, start + perPage);
    const totalPages = Math.ceil(sortedData.length / perPage);

    /* ================= TOGGLE STATUS ================= */
    const handleToggleStatus = async (row) => {
        try {
            await toggleVacancyStatus(row.id, !row.is_active);

            setData((prev) =>
                prev.map((item) =>
                    item.id === row.id
                        ? {
                            ...item,
                            is_active: !item.is_active,
                            status: !item.is_active ? "Open" : "Closed",
                        }
                        : item
                )
            );
        } catch (error) {
            toast.error("Status update failed");
        }
    };


    const handleDelete = async () => {
        try {
            await deleteVacancy(deleteRow.id);
            setData((prev) => prev.filter((item) => item.id !== deleteRow.id));
            setDeleteRow(null);
            toast.success("Deleted successfully");
        } catch (error) {
            toast.error("Delete failed");
        }
    };


    return (
        <>
            <PageBreadcrumb pageTitle=" Data Table" />

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
                        <div>
                            <Input
                                type="text"
                                placeholder="Search ..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="min-w-[260px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
                            />

                        </div>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/careers/open-jobs/add")}
                            startIcon={<AiOutlinePlus />}
                        >
                            Add
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="relative overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-gray-50">
                            <tr>
                                {[

                                    { key: "sno", label: "S.No" },
                                    { key: "postingDate", label: "Date of Posting" },
                                    { key: "openings", label: "No. of Openings" },
                                    { key: "position", label: "Position" },
                                    { key: "experience", label: "Experience" },
                                    { key: "status", label: "Status" },
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
                                    <td className="px-4 py-4 text-gray-600">
                                        {item.sno}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {item.postingDate}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {item.openings}
                                    </td>

                                    <td className="px-4 py-4 text-gray-800">
                                        {item.position}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {item.experience}
                                    </td>

                                    {/* Status */}

                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(item)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
    ${item.status === "Open" ? "bg-green-600" : "bg-red-500"}`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform
      ${item.status === "Open" ? "translate-x-5" : "translate-x-1"}`}
                                            />
                                        </button>

                                    </td>


                                    <td className="px-3 py-4 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="edit"
                                            onClick={() =>
                                                navigate(`/careers/open-jobs/edit/${item.id}`, {
                                                    state: item
                                                })
                                            }
                                            startIcon={<CiEdit size={20} />}
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
                            <span className="font-medium text-gray-700">{deleteRow?.position}
                            </span>?
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
