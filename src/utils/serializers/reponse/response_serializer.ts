export const successResponseSerializer = (response: any) => {
    return {
        mensaje: response.mensaje,
        data: response.data,
        status: response.status
    }
}

export const errorResponseSerializer = (response: any) => {
    return {
        error: response.error,
        data: response.data,
        status: response.status
    }
}

export const paginationResponseSerializer = (response: any) => {
    return {
        count: response.count,
        page: response.page,
        offset: response.offset,
        pages: response.pages,
        results: response.results
    }
}