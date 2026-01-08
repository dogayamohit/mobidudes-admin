import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Blank() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Blank Page" />

      <div className="min-h-[80vh] rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 text-theme-xl font-semibold text-gray-800 sm:text-2xl">
            Card Title Here
          </h3>

          <p className="text-sm text-gray-500 sm:text-base">
            Start putting content on grids or panels, you can also use different
            combinations of grids. Please check out the dashboard and other
            pages.
          </p>
        </div>
      </div>
    </div>
  );
}
