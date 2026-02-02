import React, { useState, useMemo, useEffect } from "react";
import { getServices, deleteService } from "../../api/service";

import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Modal } from "../../components/ui/fullScreenModal/Modal";
import Button from "../../components/ui/button/Button";
import { CiEdit } from "react-icons/ci";
import { IoIosEye } from "react-icons/io";
import { MdDeleteOutline, MdDescription } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import Input from "../../components/form/input/InputField";
import { toast } from "react-toastify";



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

const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};

export default function OpenjobTable() {
    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [deleteRow, setDeleteRow] = useState(null);

    const navigate = useNavigate();

    const getImageUrl = (path) => {
        if (!path) return "";
        return `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${path}`;
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await getServices();

                const mappedData = res.map((item, index) => {
                    const images = item.image ? item.image.split(",") : [];

                    return {
                        id: item.id,
                        sno: index + 1,

                        category_id: String(item.category_id),
                        category: item.service_category?.name || "—",

                        shortDescription: item.short_description,
                        description: item.description,
                        descriptionHTML: stripHtml(item.description),
                        image: item.image,
                        primaryImg: images[0]
                            ? getImageUrl(images[0])
                            : "",
                    };
                });


                setData(mappedData);

            } catch (error) {
                console.error("Service fetch failed", error);
                toast.error("Failed to fetch services");
            }
        };

        fetchServices();
    }, []);



    /* ---------------- FILTER ---------------- */
    const filteredData = useMemo(() => {
        return data.filter(
            (item) =>
                item.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
                item.description?.toLowerCase().includes(search.toLowerCase()) ||
                item.category?.toString().includes(search)

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
        if (!deleteRow?.id) return;

        try {
            await deleteService(deleteRow.id);

            setData((prev) =>
                prev.filter((item) => item.id !== deleteRow.id)
            );

            setDeleteRow(null);
            toast.success("Deleted successfully");

        } catch (error) {
            toast.error("Failed to delete service");
        }
    };


    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <>
            <PageBreadcrumb pageTitle="All Services" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6">

                {/* Controls */}
                <div className="mb-4 flex justify-between items-center">

                    <select
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option>
                    </select>

                    <div className="flex gap-3">

                        <Input
                            type="text"
                            placeholder="Search post..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="min-w-[260px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />

                        <Button
                            variant="primary"
                            onClick={() => navigate("/services/add")}

                            startIcon={<AiOutlinePlus />}
                        >
                            Add
                        </Button>

                    </div>

                </div>


                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-50">

                            <tr>
                                {[
                                    { key: "sno", label: "S.No" },
                                    { key: "category", label: "Category" },
                                    { key: "shortDescription", label: "Short Description" },
                                    { key: "description", label: "Description" },
                                    { key: "primaryImg", label: "Primary Image" },
                                    { key: "actions", label: "Action" }
                                ].map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer"
                                        onClick={() =>
                                            col.key !== "actions" && handleSort(col.key)
                                        }
                                    >
                                        {col.label}
                                        {sortConfig.key === col.key && (
                                            <span className="ml-1">
                                                {sortConfig.direction === "asc"
                                                    ? icons.sortAsc
                                                    : icons.sortDesc}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>

                        </thead>

                        <tbody className="">

                            {paginatedData.map((item) => (

                                <tr key={item.sno} className="hover:bg-gray-50 border border-gray-200">

                                    <td className="px-4 py-3">{item.sno}</td>
                                    <td className="px-4 py-3">{item.category}</td>
                                    <td className="px-4 py-3 font-medium">{item.shortDescription}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-[300px]">

                                        <div className="line-clamp-3 overflow-hidden break-words">
                                            {item.descriptionHTML}
                                        </div>

                                    </td>

                                    <td className="px-4 py-3">
                                        <img
                                            src={item.primaryImg}
                                            alt="Primary"
                                            className="w-25 h-15 object-cover rounded"
                                        />
                                    </td>

                                    <td className="px-4 py-3 flex gap-3">
                                        {/* <Button
                                            onClick={() => navigate(`/user/posts/view/${item.sno}`)}
                                            size="sm"
                                            variant="view"
                                            startIcon={<IoIosEye size={20} />}
                                        /> */}

                                        <Button
                                            size="sm"
                                            variant="edit"
                                            startIcon={<CiEdit size={18} />}
                                            onClick={() => navigate(`/services/edit/${item.id}`, {
                                                state: item
                                            }
                                            )}
                                        />
                                        <Button
                                            size="sm"
                                            variant="delete"
                                            startIcon={<MdDeleteOutline size={18} />}
                                            onClick={() => setDeleteRow(item)}
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

                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Delete this Service?</h3>
                        <p className="text-gray-500 mb-6">
                            {/* This action cannot be undone.  */}
                            Are you sure you want to delete.{" "}
                            {/* <span className="font-medium text-gray-700">{deleteRow?.name}</span>? */}
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
