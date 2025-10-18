"use server";
import z from "zod";
import { encryptSchema } from "../resolver/schema";
import { decryptSchema } from "../resolver/schema";

type encryptResponse = {
    status: 'success' | 'error';
    code: number,
    message: string;
    key?: string,
    cipher?: string
};

type decryptResponse = {
    status: 'success' | 'error';
    code?: number,
    message: string;
    text?: string
};

export async function encryption(values: z.infer<typeof encryptSchema>): Promise<encryptResponse> {
    const result = encryptSchema.safeParse(values);
    if(!result.success) {
        return {
            status: 'error',
            code: 400,
            message: result.error.message,
        };
    }
    
    try {        
        const payload = {
            text: values.text,
            algorithm: values.algorithm
        };
        const response = await fetch("http://127.0.0.1:8000/encrypt", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            return {
                status: 'error',
                code: response.status,
                message: errorText,
            };
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success === false) {
            return {
                status: 'error',
                message: data.message || 'Prediction failed',
                code: response.status
            }
        }
        
        return {
            status: 'success',
            message: 'Prediction completed successfully',
            code: response.status,
            key: data.key,
            cipher: data
        };
    } 
    catch (error) {
        console.error('Catch error:', error);
        return {
            status: 'error',
            code: 501,
            message: `Failed to submit your message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}

export async function decryption(values: z.infer<typeof decryptSchema>): Promise<decryptResponse> {
    const result = decryptSchema.safeParse(values);
    if(!result.success) {
        return {
            status: 'error',
            code: 400,
            message: result.error.message,
        };
    }
    
    try {        
        const payload = {
            cipher: values.cipher,
            key: values.key,
            algorithm: values.algorithm
        };
        const response = await fetch("http://127.0.0.1:8000/decrypt", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            return {
                status: 'error',
                code: response.status,
                message: errorText,
            };
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success === false) {
            return {
                status: 'error',
                message: data.message || 'Prediction failed',
                code: response.status
            }
        }
        
        return {
            status: 'success',
            message: 'Prediction completed successfully',
            code: response.status,
            text: data
        };
    } 
    catch (error) {
        console.error('Catch error:', error);
        return {
            status: 'error',
            code: 501,
            message: `Failed to submit your message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}