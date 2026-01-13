import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Modal } from "../../components/ui/fullScreenModal/Modal";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { IoIosEye } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { getReviews, deleteReview } from "../../api/home";
import { toast } from "react-toastify";

export default function ReviewTable() {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [deleteRow, setDeleteRow] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // ---------------- FETCH REVIEWS ----------------
    useEffect(() => {
        const fetchData = async () => {

            try {

                setLoading(true);
                const reviews = await getReviews();

                const mapped = reviews.map((r, index) => ({

                    sno: index + 1,
                    id: r.id,
                    name: r.name,
                    designation: r.designation,
                    image: r.image.startsWith("http")
                        ? r.image
                        : `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${r.image}`,
                    star: r.star,
                    comment: r.content,

                }));

                setData(mapped);

            } catch (error) {

                console.error("Failed to fetch reviews:", error);
                toast.error("Failed to fetch reviews");

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, []);

    // ---------------- FILTER ----------------
    const filteredData = useMemo(() => {
        
        return data.filter(
            (item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.designation.toLowerCase().includes(search.toLowerCase())
        );

    }, [search, data]);


    // ---------------- SORT ----------------
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


    // ---------------- SORT HANDLER ----------------
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


    // ---------------- DELETE HANDLER ----------------
    const handleDelete = async () => {

        if (!deleteRow) return;

        try {

            await deleteReview(deleteRow.id); // POST delete

            setData((prev) => prev.filter((item) => item.id !== deleteRow.id));
            setDeleteRow(null);

            toast.success("Review deleted successfully");
        } catch (error) {

            console.error(error);
            toast.error("Failed to delete review");

        }
    };


    return (
        <>
            <PageBreadcrumb pageTitle="Reviews" />

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

                    <Input
                        type="text"
                        placeholder="Search ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="min-w-[260px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />

                </div>

                {/* Table */}
                {loading ? (
                    <p className="text-center p-4 text-gray-500">Loading reviews...</p>
                ) : (
                    <div className="relative overflow-x-auto rounded-xl border border-gray-200">

                        <table className="w-full text-sm">

                            <thead className="sticky top-0 z-10 bg-gray-50">

                                <tr>
                                    {[
                                        { key: "sno", label: "S.No" },
                                        { key: "image", label: "Image" },
                                        { key: "name", label: "Name" },
                                        { key: "star", label: "Rating" },
                                        { key: "comment", label: "Description" },
                                        { key: "designation", label: "Designation" },
                                        { key: "actions", label: "Action" },
                                    ].map((col) => (
                                        <th
                                            key={col.key}
                                            className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer select-none"
                                            onClick={() =>
                                                col.key !== "image" && col.key !== "actions" && handleSort(col.key)
                                            }
                                        >

                                            {col.label}
                                            {sortConfig.key === col.key && (
                                                <span>
                                                    {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                                                </span>
                                            )}
                                            
                                        </th>
                                    ))}
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {paginatedData.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={`transition hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                                            }`}
                                    >
                                        <td className="px-4 py-4 font-medium text-gray-800">{item.sno}</td>

                                        <td className="px-4 py-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </td>

                                        <td className="px-4 py-4 text-gray-800">{item.name}</td>

                                        <td className="px-4 py-4 text-yellow-500">
                                            {"★".repeat(item.star)}
                                            {"☆".repeat(5 - item.star)}
                                        </td>

                                        <td className="px-4 py-4 text-gray-600 max-w-xs">
                                            <p className="line-clamp-2">{item.comment}</p>
                                        </td>

                                        <td className="px-4 py-4 text-gray-600">{item.designation}</td>

                                        <td className="px-3 py-4 flex gap-2">

                                            <Button
                                                onClick={() => navigate(`/reviews/view/${item.id}`)}
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
                )}

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

            {/* Delete Modal */}
            <Modal
                isOpen={!!deleteRow}
                showCloseButton={false}
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
