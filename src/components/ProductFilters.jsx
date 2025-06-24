import { FiFilter } from "react-icons/fi";

export default function ProductFilters({ filters, setFilters }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <FiFilter className="text-gray-400 mr-2" />
        <select
          className="block pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="tech">Tech</option>
          <option value="eco">Eco-Friendly</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Price:</span>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange[1]}
          onChange={(e) =>
            setFilters({ ...filters, priceRange: [0, e.target.value] })
          }
          className="w-24"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </span>
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={filters.ecoFriendly}
          onChange={(e) =>
            setFilters({ ...filters, ecoFriendly: e.target.checked })
          }
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-800"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Eco-Friendly
        </span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={filters.highTech}
          onChange={(e) =>
            setFilters({ ...filters, highTech: e.target.checked })
          }
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-800"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          High-Tech
        </span>
      </label>
    </div>
  );
}
