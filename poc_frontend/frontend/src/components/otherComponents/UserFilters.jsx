const UserFilters = ({
  search,
  setSearch,
  sortBy,
  setSortBy,
  order,
  setOrder,
  sortOptions = [],
  placeholder = "Search...",
  onSearchChange, 
}) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      
      {/* Search */}
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          if (onSearchChange) {
            onSearchChange(e.target.value); // custom logic
          } else {
            setSearch(e.target.value);
          }
        }}
        className="border px-3 py-2 rounded"
      />

      {/* Sort By */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border px-2 py-2 rounded"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Order */}
      <select
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        className="border px-2 py-2 rounded"
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>

    </div>
  );
};

export default UserFilters;