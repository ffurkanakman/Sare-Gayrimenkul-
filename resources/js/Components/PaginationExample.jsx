import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';

/**
 * Example component demonstrating how to use the Pagination component
 *
 * This is a reference implementation showing how to:
 * 1. Set up state for pagination
 * 2. Slice the data array to show only current page items
 * 3. Implement the paginate function
 * 4. Render the Pagination component with proper props
 */
const PaginationExample = ({ items = [] }) => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Reset to page 1 when items change
    useEffect(() => {
        setCurrentPage(1);
    }, [items]);

    // Get current items for this page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            {/* Your content rendering current items */}
            <div className="table-responsive">
                <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                        <tr className="fw-bold text-muted">
                            <th className="min-w-50px">ID</th>
                            <th className="min-w-120px">Name</th>
                            {/* Add more table headers as needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                {/* Add more table cells as needed */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination component */}
            <Pagination
                data={items}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                paginate={paginate}
                itemName="items"
                showInfo={true}
            />
        </div>
    );
};

export default PaginationExample;

/**
 * IMPLEMENTATION GUIDE
 *
 * To use the Pagination component in your own component:
 *
 * 1. Import the Pagination component:
 *    import Pagination from '../Components/Pagination';
 *
 * 2. Set up state for pagination:
 *    const [currentPage, setCurrentPage] = useState(1);
 *    const [itemsPerPage] = useState(10); // or any number you prefer
 *
 * 3. Calculate the items to display on the current page:
 *    const indexOfLastItem = currentPage * itemsPerPage;
 *    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 *    const currentItems = yourDataArray.slice(indexOfFirstItem, indexOfLastItem);
 *
 * 4. Create a paginate function:
 *    const paginate = (pageNumber) => setCurrentPage(pageNumber);
 *
 * 5. Render your content using currentItems
 *
 * 6. Add the Pagination component:
 *    <Pagination
 *      data={yourDataArray}
 *      currentPage={currentPage}
 *      itemsPerPage={itemsPerPage}
 *      paginate={paginate}
 *      itemName="your items name"
 *    />
 */
