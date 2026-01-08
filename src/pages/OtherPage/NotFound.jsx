import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import Error from "/images/error/404.svg"
export default function NotFound() {
  return (
    <>
      <div className="relative z-10 flex h-[85vh] flex-col items-center justify-center overflow-hidden p-6">
        <GridShape />

        <div className="mx-auto w-full max-w-[472px] text-center">
          <h1 className="mb-8 text-4xl font-bold text-gray-800 xl:text-5xl">
            ERROR
          </h1>

          <img
            src={Error}
            alt="404"
            className="mx-auto"
          />

          <p className="mt-10 mb-6 text-base text-gray-700 sm:text-lg">
            We can’t seem to find the page you are looking for!
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-800"
          >
            Back to Home Page
          </Link>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} - mobidudes
        </p>
      </div>
    </>
  );
}
