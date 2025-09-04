import React from "react";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    const visiblePages = 5;
    const pageNumbers = [];

    // Function to calculate the range of visible page numbers
    const calculatePageRange = () => {
        if (totalPages <= visiblePages) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        const middle = Math.floor(visiblePages / 2);
        const start = Math.max(currentPage - middle, 1);
        const end = Math.min(currentPage + middle, totalPages);

        let pages = [];

        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push("...");
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push("...");
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const pageRange = calculatePageRange();

    return (
        <div className="pagination">
            <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                &lt;
            </button>
            {pageRange.map((page, index) => (
                <button
                    key={index}
                    onClick={() => {
                        if (page !== "...") {
                            handlePageChange(page);
                        }
                    }}
                    disabled={page === "..." || currentPage === page}
                    className={currentPage === page ? "active" : ""}
                >
                    {page}
                </button>
            ))}
            <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
