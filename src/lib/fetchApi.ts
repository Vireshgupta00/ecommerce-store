type Headers = { [key: string]: string };

interface FetchOptions {
    method?: string;
    headers?: Headers;
    body?: any;
}

interface ApiInstanceOptions {
    baseURL: string;
    headers?: Headers;
}

export function createApiInstance(options: ApiInstanceOptions) {
    return async <T = any>(endpoint: string, fetchOptions: FetchOptions = {}): Promise<T> => {
        const { baseURL, headers: defaultHeaders } = options;
        const { method = "GET", headers = {}, body } = fetchOptions;

        let finalBody = body;
        if (!(body instanceof FormData)) {
            finalBody = JSON.stringify(body);
        }

        const response = await fetch(`${baseURL}${endpoint}`, {
            method,
            headers: { ...defaultHeaders, ...headers },
            body: finalBody,
        });

        if (!response.ok) {
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMsg = errorData.message;
                }
            } catch (err) {
                //ignore
            }
            throw new Error(errorMsg);
        }

        return response.json() as Promise<T>;
    };
}

export const fetchApi = createApiInstance({
    baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/`,  
    //headers: { "X-API-Key": "key" },
});