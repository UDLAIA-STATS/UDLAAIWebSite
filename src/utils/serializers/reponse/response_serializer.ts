export const successResponseSerializer = (response: any) => {
  return {
    mensaje: response.mensaje,
    data: response.data,
    status: response.status,
  };
};

export const errorResponseSerializer = (response: any) => {
  return {
    error: response.error,
    data: response.data,
    status: response.status,
  };
};

export const paginationResponseSerializer = (response: any) => {
  return {
    count: response.count as number,
    page: response.page as number,
    offset: response.offset as number,
    pages: response.pages as number,
    results: response.results,
  };
};
