const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex justify-center items-center gap-3 p-4">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="px-3 py-1 bg-gray-300 rounded"
      >
        Prev
      </button>

      <span className="text-sm">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        className="px-3 py-1 bg-gray-300 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;