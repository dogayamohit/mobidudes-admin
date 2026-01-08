
import { useState, useMemo, useEffect } from "react";
import {
  getBlogCategories,
  deleteBlogCategory,
} from "../../api/blog";

import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/fullScreenModal/Modal";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import blog1 from "/images/blog/blog1.jpg"
import { toast } from "react-toastify";

const Blogcategory = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteRow, setDeleteRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await getBlogCategories();

        const mappedData = res.map((item, index) => ({
          id: item.id,
          sno: index + 1,
          name: item.name,
        }));

        setData(mappedData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  const filteredData = data.filter((row) => {
    if (!search) return true;
    return row.name.toLowerCase().includes(search.toLowerCase());
  });

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
      await deleteBlogCategory(deleteRow.id);
      setData((prev) => prev.filter((d) => d.id !== deleteRow.id));
      setDeleteRow(null);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="p-4">
      <PageBreadCrumb pageTitle="All Blogs" />

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        {/* Search + Add */}
        <div className="mb-4 flex items-center justify-between">
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
          </select>
          <div className="flex gap-3">
            <div className="max-w-[300px] w-full">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button
              variant="primary"
              onClick={() => navigate("/blog-categories/add")}
            >
              Add
            </Button>

          </div>

        </div>

        {loading && (
          <div className="py-6 text-center text-gray-500 font-medium">
            Loading categories...
          </div>
        )}


        <table className="min-w-full text-sm border-t">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">S.No  </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">Category</th>
              {/* <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">Title</th> */}
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row) => (

              <tr key={row.sno} className="border-b border-gray-200">
                <td className="px-4 py-3">{row.sno}</td>
                <td className="px-4 py-3">{row.name}</td>

                <td className="px-4 py-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="edit"
                    onClick={() =>
                      navigate(
                        `/blog-categories/edit/${row.id}`,
                        { state: row }   // 👈 PASS FULL ROW DATA
                      )
                    }
                    startIcon={<CiEdit size={20} />}
                  />


                  {/* Delete */}
                  <Button
                    size="sm"
                    variant="delete"
                    onClick={() => setDeleteRow(row)}
                    startIcon={<MdDeleteOutline size={20} />}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default Blogcategory;
