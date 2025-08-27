function ResponseHandler(
    status: number,
    message: string,
    data?: object | null,
    success?: boolean
) {
    return {
        status,
        message,
        data,
        success,
    };
}

export default ResponseHandler;
