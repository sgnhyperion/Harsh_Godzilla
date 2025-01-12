const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg p-6 w-[400px]`}>
      <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-yellow-500 flex items-center justify-center">
            <span className="text-2xl">!</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center mb-4">
          Are you sure you want to delete this task?
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" id="noShow" className="rounded" />
          <label htmlFor="noShow" className="text-sm text-gray-600">Do not show again</label>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes, I'm sure
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;