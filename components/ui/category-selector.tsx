"use client";

import { Category } from "@/sanity.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CategorySelectorProps {
  categories: Category[];
}

export function CategorySelectorComponent({ categories }: CategorySelectorProps) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const [value, setValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredCategories = categories.filter((category) =>
    category.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="dropdown mx-4">
      <button
        className="col-12 col-md-6 col-xl-3 btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        id="categoryDropdown"
      >
        {value
          ? categories.find((category) => category._id === value)?.title
          : "Filter by category"}
      </button>

      <ul
        className="dropdown-menu col-12 col-md-6 col-xl-3 py-2"
        aria-labelledby="categoryDropdown"
        // style={{ minWidth: "250px", maxHeight: "300px", overflowY: "auto" }}
      >
        <li className="mb-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const selectedCategory = filteredCategories[0];
                if (selectedCategory?.slug?.current) {
                  setValue(selectedCategory._id);
                  router.push(`/categories/${selectedCategory.slug.current}`);
                }
              }
            }}
          />
        </li>
        <li><hr className="dropdown-divider" /></li>

        {filteredCategories.length === 0 ? (
          <li className="dropdown-item text-muted">No matching categories</li>
        ) : (
          filteredCategories.map((category) => (
            <li key={category._id}>
              <button
                className={`dropdown-item ${
                  category._id === value ? "active" : ""
                }`}
                onClick={() => {
                  const newValue = value === category._id ? "" : category._id;
                  setValue(newValue);
                  router.push(`/categories/${category.slug?.current}`);
                }}
              >
                {category.title}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
