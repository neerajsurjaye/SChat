import { generateUrl } from "./url";

export async function sendPostRequest(url: string, body: any) {
    let response = await fetch(generateUrl(url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    console.log(response);

    return await response.json();
}
