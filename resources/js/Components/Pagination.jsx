import React from 'react';

/**
 * Reusable pagination component
 *
 * @param {Object} props
 * @param {Array} props.data - The full data array to paginate
 * @param {number} props.currentPage - Current active page number (1-based)
 * @param {number} props.itemsPerPage - Number of items to display per page
 * @param {Function} props.paginate - Function to call when page changes, receives page number
 * @param {string} props.itemName - Name of the items being paginated (e.g., "users", "customers")
 * @param {boolean} props.showInfo - Whether to show the "Showing X to Y of Z entries" text (default: true)
 */
const Pagination = ({
    data = [],
    currentPage = 1,
    itemsPerPage = 15,
    paginate,
    itemName = 'entries',
    showInfo = true,
}) => {
    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Don't render pagination if there's no data or only one page
    if (!data || data.length === 0 || totalPages <= 1) {
        return null;
    }

    return (
        <div className='d-flex flex-stack flex-wrap pt-10'>
            <div className='fs-6 fw-bold text-gray-700'>
            {showInfo && (
                <>{data.length} {itemName} arasından {indexOfFirstItem + 1} ile {Math.min(indexOfLastItem, data.length)} arası veriler gösteriliyor. </>
            )}
            </div>
            <ul className='pagination'>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : 'previous'}`}>
                    <a
                        href='#'
                        className='page-link'
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) paginate(currentPage - 1);
                        }}
                    >
                        <i className='previous'></i>
                    </a>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <a
                            href='#'
                            className='page-link'
                            onClick={(e) => {
                                e.preventDefault();
                                paginate(index + 1);
                            }}
                        >
                            {index + 1}
                        </a>
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : 'next'}`}>
                    <a
                        href='#'
                        className='page-link'
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) paginate(currentPage + 1);
                        }}
                    >
                        <i className='next'></i>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
