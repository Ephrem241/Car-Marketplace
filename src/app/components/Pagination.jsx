import { Button } from "flowbite-react";
import React from "react";

export default function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  if (totalItems === 0) return null;

  return (
    <section className="container mx-auto flex justify-center items-center my-8">
      <Button
        color="gray"
        className="mr-2"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </Button>

      {totalPages > 0 && (
        <span className="mx-2">
          Page {page} of {totalPages}
        </span>
      )}

      <Button
        color="gray"
        className="ml-2"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </Button>
    </section>
  );
}
