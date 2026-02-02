import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/fullScreenModal/Modal";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import Select from "../../components/form/Select";

import { getPortfolios, deletePortfolio, getPortfolioCategories } from "../../api/portfolio";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
/* ---------- MEDIA URL HELPER ---------- */
const getImageUrl = (img) => {
  if (!img) return "";

  const firstImage = img.split(",")[0]; // ✅ take only first image

  return firstImage.startsWith("http")
    ? firstImage
    : `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${firstImage}`;
};

const AllPortfolio = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deleteRow, setDeleteRow] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {

    fetchPortfolios();
    fetchCategories();

  }, []);

  const fetchPortfolios = async () => {
    try {

      setLoading(true);
      const res = await getPortfolios();
      setData(res);

    } catch (err) {

      console.error(err);
      toast.error("Failed to fetch portfolios");

    } finally {

      setLoading(false);

    }
  };

  const fetchCategories = async () => {
    try {

      const res = await getPortfolioCategories();
      setCategories(res);

    } catch (err) {

      console.error(err);

    }
  };

  /* ---------------- SELECT OPTIONS ---------------- */
  const categoryOptions = useMemo(() => [

    { label: "All", value: "All" },
    ...categories.map((cat) => ({
      label: cat.name,
      value: String(cat.id),
    })),

  ], [categories]);


  /* ---------------- FILTER LOGIC ---------------- */
  const filteredData = useMemo(() => {

    return data.filter((row) => {

      const matchesSearch =
        !search ||
        row.title?.toLowerCase().includes(search.toLowerCase()) ||
        row.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        row.category_id === Number(selectedCategory);

      return matchesSearch && matchesCategory;

    });

  }, [data, search, selectedCategory]);


  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    try {

      await deletePortfolio(deleteRow.id);
      setData((prev) => prev.filter((d) => d.id !== deleteRow.id));
      setDeleteRow(null);

      toast.success("Portfolio deleted successfully");

    } catch (err) {

      console.error(err);
      toast.error("Failed to delete portfolio");

    }
  };


  return (

    <div className="p-4">

      <PageBreadCrumb pageTitle="All Portfolio" />

      <div className="rounded-xl border border-gray-200 bg-white p-4">

        {/* Search + Filter + Add */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="max-w-[300px] w-full">

            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="flex gap-3">

            <Select
              options={categoryOptions}
              placeholder="Filter by Category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="max-w-[200px]"
            />

            <Button
              variant="primary"
              onClick={() =>
                navigate("/portfolios/add")
              }
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">S.No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">Img</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                filteredData.map((row, index) => (

                  <tr key={row.id} className="border-b  border-gray-200">
                    <td className="px-4 py-3">{index + 1}</td>

                    <td className="px-4 py-3">
                      {row.portfolio_category?.name}
                    </td>

                    <td className="px-4 py-3 max-w-[300px]">
                      <p className="font-medium">{row.title}</p>
                      <p className="text-xs text-gray-500">
                        {row.description}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <img
                        src={getImageUrl(row.image)}
                        className="h-20 w-20 object-cover rounded"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">

                        <Button
                          size="sm"
                          variant="edit"
                          startIcon={<CiEdit size={20} />}
                          onClick={() =>
                            navigate(
                              `/portfolios/edit/${row.id}`,
                              { state: row }
                            )
                          }
                        />

                        <Button
                          size="sm"
                          variant="delete"
                          startIcon={<MdDeleteOutline size={20} />}
                          onClick={() => setDeleteRow(row)}
                        />

                      </div>
                    </td>
                  </tr>

                ))}


              {!loading && filteredData.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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

            <h3 className="text-xl font-semibold mb-2 text-gray-800">Delete this Portfolio?</h3>
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
    </div>
  );
};

export default AllPortfolio;
