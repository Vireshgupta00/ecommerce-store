export const getDuplicateMsg = (error: any) : string => {
    let msg = 'already exists!';
    if (error.keyValue) {
        const keys = Object.keys(error.keyValue);
        if (keys?.length) {
            const key = keys[0];
            const value = error.keyValue[key];
            msg = `with field ${key}=${value} already exists!`;
        }
    }
    return msg;
};