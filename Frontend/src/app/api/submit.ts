"use server";
import z from "zod";
import { encryptSchema } from "../resolver/schema";
import { decryptSchema } from "../resolver/schema";

type encryptResponse = {
    key?: string,
    cipher?: string
    status: 'success' | 'error';
    code: number,
    message: string,
    input: 'text' | 'file',
};

type decryptResponse = {
    status: 'success' | 'error';
    code: number,
    message: string,
    text?: string,
    input: 'text' | 'file',
};

export async function encryption(values: z.infer<typeof encryptSchema>): Promise<encryptResponse> {
    const result = encryptSchema.safeParse(values);
    if(!result.success) {
        return {
            status: 'error',
            code: 400,
            message: result.error.message,
            input: 'text'
        };
    }
    
    try {   
        let response;
        if (values.text) {
            const payload = {
                text: values.text,
                algorithm: values.algorithm,
                mode: values.mode,
            };
            response = await fetch("http://127.0.0.1:8000/encrypt-text", {
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
                    input: 'text',
                    code: response.status,
                    message: errorText,
                };
            }
            const data = await response.json();            
            return {
                status: 'success',
                input: 'text',
                message: 'Encryption completed successfully',
                code: response.status,
                key: data.key,
                cipher: data.cipher
            };
        }
        else if (values.file && values.file.length > 0) {
            const formData = new FormData();
            formData.append("file", values.file[0]);
            formData.append("algorithm", values.algorithm);
            formData.append("mode", values.mode);
            
            response = await fetch("http://127.0.0.1:8000/encrypt-file", {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                return {
                    status: 'error',
                    input: 'file',
                    code: response.status,
                    message: errorText,
                };
            }
            const data = await response.json();
            console.log('Response data:', data);
            
            return {
                status: 'success',
                input: 'file',
                message: 'Encryption completed successfully',
                code: response.status,
                key: data.key,
                cipher: data.cipher
            };
        }
        else {
            return {
                status: 'error',
                input: 'text',
                code: 400,
                message: 'Either text or file is required',
            };
        }
    } 
    catch (error) {
        console.error('Catch error:', error);
        return {
            status: 'error',
            input: 'text',
            code: 501,
            message: "Failed to submit your message",
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