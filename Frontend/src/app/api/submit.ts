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
        let response;
        
        // Handle text encryption
        if (values.text) {
            const payload = {
                text: values.text,
                algorithm: values.algorithm,
                mode: values.mode || "CBC",
            };
            response = await fetch("http://127.0.0.1:8000/encrypt-text", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
        }
        // Handle file encryption
        else if (values.file && values.file.length > 0) {
            const formData = new FormData();
            formData.append("file", values.file[0]);
            formData.append("algorithm", values.algorithm);
            formData.append("mode", values.mode || "CBC");
            
            response = await fetch("http://127.0.0.1:8000/encrypt-file", {
                method: 'POST',
                body: formData,
            });
        }
        else {
            return {
                status: 'error',
                code: 400,
                message: 'Either text or file is required',
            };
        }

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
        
        return {
            status: 'success',
            message: 'Encryption completed successfully',
            code: response.status,
            key: data.key,
            cipher: data.cipher
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
            algorithm: values.algorithm,
            mode: values.mode || "CBC",
        };
        const response = await fetch("http://127.0.0.1:8000/decrypt-text", {
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
        
        return {
            status: 'success',
            message: 'Decryption completed successfully',
            code: response.status,
            text: data["plain-text"]
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