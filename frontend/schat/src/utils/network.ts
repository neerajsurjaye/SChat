import { generateUrl } from "./url";

export async function sendPostRequest(url: string, body: any) {
    let response = await fetch(generateUrl(url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    return await response.json();
}

export async function sendGetRequest(
    url: string,
    options: { headers?: any } = {}
) {
    let response = await fetch(generateUrl(url), {
        headers: options?.headers,
    });
    return await response.json();
}
