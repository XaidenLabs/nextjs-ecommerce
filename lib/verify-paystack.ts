import axios from "axios";

/**
 * Client-side helper to verify a Paystack transaction reference
 * by calling the verify API route.
 */
export async function verifyPaystackReference(reference: string): Promise<boolean> {
    try {
        const response = await axios.get(`/api/verify-payment?reference=${reference}`);
        return response.data.verified === true;
    } catch {
        return false;
    }
}
