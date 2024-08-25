class Pagination {
    constructor() {

    }

    async generatePagination(page, pageSize, totalRecords, baseUrl, req) {
        const nextPage = page + 1;
        const prevPage = page - 1 > 0 ? page - 1 : null;
        const totalPages = Math.ceil(totalRecords / pageSize);

        const queryParams = new URLSearchParams(req.query);
        queryParams.delete('page');
        queryParams.delete('pageSize');
        const queryString = queryParams.toString();

        const next = nextPage <= totalPages
            ? `${baseUrl}?page=${nextPage}&pageSize=${pageSize}${queryString ? `&${queryString}` : ''}`
            : null;
        const prev = prevPage
            ? `${baseUrl}?page=${prevPage}&pageSize=${pageSize}${queryString ? `&${queryString}` : ''}`
            : null;

        return { totalPages, next, prev };
    }

    async parsePagination(req) {
        const { page, pageSize } = req.query;
        const parsedPage = parseInt(page) || 1;
        const parsedPageSize = parseInt(pageSize) || 10;
        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;

        return { parsedPage, parsedPageSize, baseUrl };
    }
}

module.exports = Pagination;
