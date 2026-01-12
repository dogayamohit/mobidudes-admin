import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/fullScreenModal/Modal";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import {
  getPortfolioCategories,
  deletePortfolioCategory,
} from "../../api/portfolio";
import { toast } from "react-toastify";


export default function AllPortfoliocategory() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteRow, setDeleteRow] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  
  /* ---------- FETCH DATA ---------- */
  const fetchData = async () => {
    try {

      setLoading(true);
      const categories = await getPortfolioCategories();
      setData(categories.map((cat, index) => ({ ...cat, sno: index + 1 })));

    } catch (error) {

      toast.error("Failed to fetch categories");

    } finally {

      setLoading(false);

    }
  };
  

  useEffect(() => {

    fetchData();

  }, []);


  /* ---------- SEARCH FILTER ---------- */
  const filteredData = data.filter((row) => {

    if (!search) return true;
    return row.name.toLowerCase().includes(search.toLowerCase());

  });


  /* ---------- DELETE ---------- */
  const handleDelete = async () => {
    try {

      await deletePortfolioCategory(deleteRow.id);

      setData((prev) => prev.filter((d) => d.id !== deleteRow.id));
      setDeleteRow(null);

      toast.success("Category deleted successfully");

    } catch (error) {

      toast.error("Failed to delete category");

    }
  };


  return (

    <div className="p-4">

      <PageBreadCrumb pageTitle="All Portfolio Categories" />

      <div className="rounded-xl border border-gray-200 bg-white p-4">

        {/* Search + Add */}
        <div className="mb-4 flex items-center justify-between">
          <div className="max-w-[300px] w-full">

            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <Button
            variant="primary"
            onClick={() =>
              navigate("/portfolio-categories/add")
            }
          >
            Add
          </Button>

        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">S.No</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No categories found
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">{row.sno}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3 flex gap-2">

                    <Button
                      size="sm"
                      variant="edit"
                      onClick={() =>
                        navigate(
                          `/portfolio-categories/edit/${row.id}`,
                          { state: row }
                        )
                      }
                      startIcon={<CiEdit size={20} />}
                    />
                    <Button
                      size="sm"
                      variant="delete"
                      onClick={() => setDeleteRow(row)}
                      startIcon={<MdDeleteOutline size={20} />}
                    />

                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>
      </div>


      {/* Delete Modal */}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

            </div>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Delete this item?
            </h3>

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
