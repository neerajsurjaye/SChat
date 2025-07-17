export function generateUrl(path: string): string {
    if (!import.meta.env.VITE_GATEWAY_BASE_URL) {
        throw new Error("VITE_GATEWAY_BASE_URL not defined");
    }
    return new URL(path, import.meta.env.VITE_GATEWAY_BASE_URL).toString();
}
