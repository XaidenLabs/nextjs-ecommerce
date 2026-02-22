/**
 * Initialize a Flutterwave Standard payment
 */
export async function initializeFlutterwavePayment({
    tx_ref,
    amount,
    currency = "NGN",
    redirect_url,
    customer,
    meta,
}: {
    tx_ref: string;
    amount: number;
    currency?: string;
    redirect_url: string;
    customer: { email: string; name?: string; phone_number?: string };
    meta?: Record<string, any>;
}) {
    const secretKey = process.env.FLW_SECRET_KEY;
    if (!secretKey) {
        throw new Error("FLW_SECRET_KEY is not set in env");
    }

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tx_ref,
            amount,
            currency,
            redirect_url,
            customer,
            meta,
            customizations: {
                title: "Bluepetals",
                logo: "",
            },
        }),
    });

    const data = await response.json();
    if (data.status !== "success") {
        throw new Error(data.message || "Failed to initialize Flutterwave payment");
    }
    return data.data; // { link }
}

/**
 * Verify a Flutterwave transaction by transaction ID
 */
export async function verifyFlutterwaveTransaction(transactionId: string) {
    const secretKey = process.env.FLW_SECRET_KEY;
    if (!secretKey) {
        throw new Error("FLW_SECRET_KEY is not set in env");
    }

    const response = await fetch(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
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

/**
 * Verify a Flutterwave transaction by tx_ref
 */
export async function verifyFlutterwaveByRef(txRef: string) {
    const secretKey = process.env.FLW_SECRET_KEY;
    if (!secretKey) {
        throw new Error("FLW_SECRET_KEY is not set in env");
    }

    const response = await fetch(
        `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`,
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
