import { useState } from "react";
import Modal from "./Modal";

const DefaultModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-800">
          Default Modal
        </h3>
      </div>

      {/* Content */}
      <div className="border-t border-gray-100 p-6">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white shadow hover:bg-blue-600"
        >
          Open Modal
        </button>

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <h4 className="mb-7 text-title-sm font-semibold text-gray-800">
            Modal Heading
          </h4>

          <p className="text-sm leading-6 text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
            euismod est quis mauris lacinia pharetra.
          </p>

          <p className="mt-5 text-sm leading-6 text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <div className="mt-8 flex w-full items-center justify-end gap-3">
            <button
              onClick={() => setOpen(false)}
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Close
            </button>

            <button
              className="flex w-full justify-center rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 sm:w-auto"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DefaultModal;
