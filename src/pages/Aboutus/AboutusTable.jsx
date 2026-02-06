import { useEffect, useState, useMemo } from "react";
import { getAboutList } from "../../api/aboutUs";
import { getImageUrl } from "../../utils/getImageUrl";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Modal } from "../../components/ui/fullScreenModal/Modal";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { CiEdit } from "react-icons/ci";


/* ---------------- SORT ICONS ---------------- */
const icons = {
    asc: "▲",
    desc: "▼",
};

const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};


export default function AboutusTable() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [deleteRow, setDeleteRow] = useState(null);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await getAboutList();

                const mappedData = res.map((item, index) => {
                    const images = item.image
                        ? item.image.split(",").map((img) => getImageUrl(img.trim()))
                        : [];

                    return {
                        id: item.id,
                        // sno: index + 1,
                        title: item.title,
                        description: stripHtml(item.description),
                        client: item.clients,
                        initiatives: item.initiatives,
                        trophies: item.trophies,
                        image: images[0], // show first image in table
                        allImages: images,
                        allVideos: item.video
                            ? item.video.split(",").map((vid) => vid.trim())
                            : [],
                    };
                });

                setData(mappedData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAbout();
    }, []);


    /* ---------------- FILTER ---------------- */
    const filteredData = useMemo(() => {
        return data.filter(
            (item) =>
                // item.sno.toString().includes(search) ||
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase()) ||
                item.client.toLowerCase().includes(search.toLowerCase()) ||
                item.initiatives.toLowerCase().includes(search.toLowerCase()) ||
                item.trophies.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, data]);

    /* ---------------- SORT ---------------- */
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        const sorted = [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (typeof aVal === "string") {
                return aVal.localeCompare(bVal);
            }
            return aVal - bVal;
        });

        return sortConfig.direction === "asc" ? sorted : sorted.reverse();
    }, [filteredData, sortConfig]);

    /* ---------------- PAGINATION ---------------- */
    const start = (currentPage - 1) * perPage;
    const paginatedData = sortedData.slice(start, start + perPage);
    const totalPages = Math.ceil(sortedData.length / perPage);

    /* ---------------- SORT HANDLER ---------------- */
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

    /* ---------------- DELETE ---------------- */
    const handleDelete = () => {
        setData((prev) => prev.filter((item) => item.id !== deleteRow.id));
        setDeleteRow(null);
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }


    return (
        <>
            <PageBreadcrumb pageTitle="About Us" />

            <div
                className="
                    rounded-2xl border border-gray-200 bg-white shadow-sm
                    p-4 sm:p-6 md:p-6 lg:p-4
                    w-full mx-auto
                    max-w-[calc(100vw-var(--sidebar-space))]
                    transition-all duration-300
                "
            >

                {/* Controls */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                    {/* Rows per page select */}
                    <select
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full sm:w-auto"
                    >
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option>
                    </select>

                    {/* Search input */}
                    <div className="w-full sm:max-w-[260px]">
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full"
                        />
                    </div>

                </div>


                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    { key: "sno", label: "S.No" },
                                    { key: "image", label: "Image" },
                                    { key: "title", label: "Title" },
                                    { key: "description", label: "Description" },
                                    { key: "client", label: "Client" },
                                    { key: "initiatives", label: "Initiatives" },
                                    { key: "trophies", label: "Trophies" },
                                    { key: "actions", label: "Action" }
                                ].map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer"
                                        onClick={() =>
                                            col.key !== "image" &&
                                            col.key !== "actions" &&
                                            handleSort(col.key)
                                        }
                                    >
                                        {col.label}
                                        {sortConfig.key === col.key && (
                                            <span className="ml-1 text-xs">
                                                {icons[sortConfig.direction]}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="border border-gray-200">
                            {paginatedData.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={index % 2 === 0 ? "bg-white border border-gray-200" : "bg-gray-50/40 border border-gray-200"}
                                >
                                    {/* Dynamic S.No */}
                                    <td className="px-4 py-4 font-medium">
                                        {(currentPage - 1) * perPage + index + 1}
                                    </td>

                                    <td className="px-4 py-4">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                        />
                                    </td>

                                    <td className="px-4 py-4">{item.title}</td>
                                    <td className="px-4 py-4 max-w-[300px]">{item.description}</td>
                                    <td className="px-4 py-4">{item.client}</td>
                                    <td className="px-4 py-4">{item.initiatives}</td>
                                    <td className="px-4 py-4">{item.trophies}</td>
                                    <td className="px-4 py-4">
                                        <Button
                                            size="sm"
                                            variant="edit"
                                            startIcon={<CiEdit size={18} />}
                                            onClick={() =>
                                                navigate(`/about-us/edit/${item.id}`, { state: item })
                                            }
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
