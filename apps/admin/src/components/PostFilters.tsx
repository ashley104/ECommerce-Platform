"use client";

export default function PostFilters({
  filters,
  setFilters,
  sort,
  setSort,
}: {
  filters: any;
  setFilters: any;
  sort: any;
  setSort: any;
}) {
  return (
    <div className="mb-6 pt-6 rounded-xl p-4 bg-white border border-gray-200">
      <form className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm" htmlFor="query">Filter by Content:</label>
            <input
              className="rounded-md px-3 py-2 bg-gray-100 text-sm focus:outline focus:ring-3 focus:ring-gray-300"
              placeholder="Search title or content..."
              value={filters.query}
              onChange={(e) =>
                setFilters((prev: any) => ({ ...prev, query: e.target.value }))
              }
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm" htmlFor="tags">Filter by Tag:</label>
            <input
              className="rounded-md px-3 py-2 bg-gray-100 text-sm focus:outline focus:ring-3 focus:ring-gray-300"
              placeholder="Tags"
              value={filters.tags}
              onChange={(e) =>
                setFilters((prev: any) => ({ ...prev, tags: e.target.value }))
              }
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm" htmlFor="date">Filter by Date Created:</label>
            <input
              type="date"
              className="rounded-md px-3 py-2 bg-gray-100 text-sm focus:outline focus:ring-3 focus:ring-gray-300"
              value={filters.date}
              onChange={(e) =>
                setFilters((prev: any) => ({ ...prev, date: e.target.value }))
              }
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm" htmlFor="visibility">Filter by Visibility:</label>
            <select
              className="rounded-md px-3 py-2 bg-gray-100 text-sm font-semibold"
              id="visibility"
              value={filters.visibility}
              onChange={(e) =>
                setFilters((prev: any) => ({ ...prev, visibility: e.target.value }))
              }
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 max-w-xs">
          <label className="font-semibold text-sm" htmlFor="sort">Sort By:</label>
          <select
            className="rounded-md px-3 py-2 bg-gray-100 text-sm font-semibold"
            id="sort"
            value={sort.field + "_" + sort.order}
            onChange={(e) => {
              const [field, order] = e.target.value.split("_");
              setSort({ field, order });
            }}
          >
            <option value="title_asc">Title Asc</option>
            <option value="title_desc">Title Desc</option>
            <option value="date_asc">Date Asc</option>
            <option value="date_desc">Date Desc</option>
          </select>
        </div>
      </form>
    </div>
  );
}