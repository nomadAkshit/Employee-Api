export async function apiFetch(url, options = {}) {
    const headers = new Headers(options.headers || {});

    const isFormData = options.body instanceof FormData;

    if (
        options.body &&
        !isFormData &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    if (isFormData) {
        headers.delete("Content-Type");
    }

    return fetch(url, {
        ...options,
        headers,
        credentials: "include"
    });
}