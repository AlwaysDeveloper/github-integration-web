import httpClient from "../services/http-client.service";


export async function handelLogin(setLoading: any, setError: any) {
    setLoading(true);
    setError(null);
    try {
        const response: string = await httpClient.get('/api/auth');
        window.location.href = response;
        setLoading(false);
    } catch (error: any) {
        setLoading(false);
        setError(error.message);
    }
}