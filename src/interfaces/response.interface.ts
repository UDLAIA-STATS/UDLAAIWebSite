export interface ResponsePaginationInterface {
    count: number;
    page: number;
    offset: number;
    pages: number;
    data: any[];
}

export interface ResponseDataInterface {
    success: boolean;
    message: string;
}

export interface SuccessResponseInterface extends ResponseDataInterface {
    data?: any;
}

export interface ErrorResponseInterface extends ResponseDataInterface {
    code?: number;
    status?: string;
}