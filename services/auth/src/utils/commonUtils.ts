import logger from "./logger.js";

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

const fetchGet = async (
    base: string,
    path: string,
    options: any = {}
): Promise<any> => {
    const url: URL = new URL(path, base);
    const resp = await fetch(url, {
        headers: {
            ...options.headers,
        },
    });
    const json = await resp.json();
    return {
        status: resp.status,
        json: json,
    };
};

const checkEnv = (env: { [key: string]: any }) => {
    let errorMsg = "";
    let isError = false;
    for (const key in env) {
        const value = env[key];

        if (!value) {
            isError = true;
            const error = `Value for env ${key} is not defined`;
            logger.error(error);
            errorMsg = errorMsg.concat(error);
        }
    }

    if (isError) {
        throw new Error(errorMsg);
    }
};

export default { errorResp, successResp, fetchGet, checkEnv };
