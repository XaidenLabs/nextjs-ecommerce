// Paystack configuration
// NOTE: Read env vars lazily (inside functions) to avoid issues with
// module-level evaluation before Next.js has loaded .env.local

/**
 * Initialize a Paystack transaction
 */
export async function initializePaystackTransaction({
    email,
    amount,
    reference,
    callback_url,
    metadata,
}: {
    email: string;
    amount: number; // in kobo (100 kobo = ₦1)
    reference: string;
    callback_url: string;
    metadata?: Record<string, any>;
}) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
        throw new Error("PAYSTACK_SECRET_KEY is not set in env");
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            amount,
            reference,
            callback_url,
            metadata,
        }),
    });

    const data = await response.json();
    if (!data.status) {
        throw new Error(data.message || "Failed to initialize Paystack transaction");
    }
    return data.data; // { authorization_url, access_code, reference }
}

/**
 * Verify a Paystack transaction
 */
export async function verifyPaystackTransaction(reference: string) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
        throw new Error("PAYSTACK_SECRET_KEY is not set in env");
    }

    const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json",
            },
        }
    );

    const data = await response.json();
    return data;
}
