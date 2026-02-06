import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Modal } from "../../components/ui/fullScreenModal/Modal";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { getFaqs, deleteFaq } from "../../api/home";
import { toast } from "react-toastify";

export default function FaqTable() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [deleteRow, setDeleteRow] = useState(null);

  /* ---------- FETCH FAQS ---------- */
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const faqs = await getFaqs();
        setData(faqs);
      } catch (error) {
        toast.error("Failed to fetch FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  /* ---------- FILTER ---------- */
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  /* ---------- SORT ---------- */
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

  /* ---------- PAGINATION ---------- */
  const start = (currentPage - 1) * perPage;
  const paginatedData = sortedData.slice(start, start + perPage);
  const totalPages = Math.ceil(sortedData.length / perPage);

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

  /* ---------- DELETE ---------- */
  const handleDelete = async () => {
    try {
      await deleteFaq(deleteRow.id);
      setData((prev) => prev.filter((item) => item.id !== deleteRow.id));
      toast.success("FAQ deleted successfully");
    } catch {
      toast.error("Failed to delete FAQ");
    } finally {
      setDeleteRow(null);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="FAQ List" />

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
            className="w-full sm:w-auto rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
          </select>

          {/* Search + Add button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:min-w-[260px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />

            <Button
              variant="primary"
              onClick={() => navigate("/faqs/add")}
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
                  { key: "id", label: "ID" },
                  { key: "question", label: "Question" },
                  { key: "answer", label: "Answer" },
                  { key: "createdAt", label: "Created at" },
                  { key: "actions", label: "Action" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.key !== "actions" && handleSort(col.key)}
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border border-gray-200">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3 font-medium max-w-[250px]">
                    {item.question}
                  </td>
                  <td className="px-4 py-3 max-w-[400px] text-gray-600">
                    {item.answer}
                  </td>
                  <td className="px-4 py-3">{item.createdAt.split("T")[0]}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="edit"
                      onClick={() => navigate(`/faqs/edit/${item.id}`)}
                      startIcon={<CiEdit size={18} />}
                    />
                    <Button
                      size="sm"
                      variant="delete"
                      onClick={() => setDeleteRow(item)}
                      startIcon={<MdDeleteOutline size={18} />}
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
          <span className="text-sm font-medium">
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
        showCloseButton={false}
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

            <h3 className="text-xl font-semibold mb-2 text-gray-800">Delete this FAQ?</h3>
            <p className="text-gray-500 mb-6">
              {/* This action cannot be undone. <br />  */}
              Are you sure you want to delete.{" "}
              <br />
              {/* <span className="font-medium text-gray-700">{deleteRow?.question}</span> */}
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
