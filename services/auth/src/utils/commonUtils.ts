const errorResp = (
    message: string,
    data: object | string | null = null
): object => {
    return {
        success: false,
        message: message,
        data: data,
    };
};

const successResp = (
    message: string,
    data: object | string | null = null
): object => {
    return {
        success: true,
        message: message,
        data: data,
    };
};

export default { errorResp, successResp };
