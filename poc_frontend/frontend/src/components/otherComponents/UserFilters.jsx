const UserFilters = ({
  search,
  setSearch,
  placeholder = "Search...",
  onSearchChange,
}) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          if (onSearchChange) {
            onSearchChange(e.target.value);
          } else {
            setSearch(e.target.value);
          }
        }}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

    </div>
  );
};

export default UserFilters;