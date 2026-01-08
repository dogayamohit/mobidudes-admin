import { useState } from "react";
import Modal from "./Modal";

const FormModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-800">
          Form in Modal
        </h3>
      </div>

      {/* Body */}
      <div className="border-t border-gray-100 p-6">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white shadow hover:bg-blue-600"
        >
          Open Modal
        </button>

        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          width="max-w-[584px]"
        >
          <form>
            <h4 className="mb-6 text-lg font-medium text-gray-800">
              Personal Information
            </h4>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Mike"
                  className="h-11 w-full text-sm rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Rose"
                  className="h-11 w-full text-sm rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="random@example.com"
                  className="h-11 w-full text-sm rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  className="h-11 w-full text-sm rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-gray-700">
                  Bio
                </label>
                <input
                  type="text"
                  placeholder="Software Dev"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex w-full items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
              >
                Close
              </button>

              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default FormModal;
