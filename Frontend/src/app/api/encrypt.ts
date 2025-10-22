"use client";
import z from "zod";
import { encryptSchema } from "../resolver/schema";
import { toast } from "sonner";

type encryptResponse = {
    key?: string;
    cipher?: string | Blob;
    status: 'success' | 'error';
    code: number;
    message: string;
    input: 'text' | 'file' | null;
};
const compatible_map = {
    "AES":       ["ECB", "CBC", "CFB", "OFB", "CTR", "EAX", "GCM", "CCM", "SIV", "OCB"],
    "DES":       ["ECB", "CBC", "CFB", "OFB", "CTR"],          
    "DES3":      ["ECB", "CBC", "CFB", "OFB", "CTR"],        
    "CAST-128":  ["ECB", "CBC", "CFB", "OFB"],                      
    "ChaCha20":  ["ChaCha20_Poly1305"],                            
}

function isCipherModeSupported(algorithm: string, mode: string): boolean {
    const supportedModes = compatible_map[algorithm as keyof typeof compatible_map];
    if (!supportedModes) {
        return false; 
    }
    return supportedModes.includes(mode);
}

export async function encryption(values: z.infer<typeof encryptSchema>): Promise<encryptResponse> {
    const result = encryptSchema.safeParse(values);
    if (!result.success) {
        return {
            status: 'error',
            code: 400,
            message: result.error.message,
            input: null,
        };
    }

    const { algorithm, mode } = result.data;

    if (!isCipherModeSupported(algorithm, mode)) {
        const supportedModes = compatible_map[algorithm as keyof typeof compatible_map];
        return {
            status: 'error',
            code: 422,
            message: `Cipher mode "${mode}" is not supported for ${algorithm}. Supported modes: ${supportedModes?.join(', ') || 'None'}`,
            input: null,
        };
    }

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
        if (values.text) {
            const payload = {
                text: values.text,
                algorithm: values.algorithm,
                mode: values.mode,
            };
            const response = await fetch(`${BASE_URL}/encrypt-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status == 501) {
                    return {
                        status: 'error',
                        input: 'file',
                        code: response.status,
                        message: `${payload.algorithm} is not compatible with ${payload.mode}`,
                    };
                }
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
                cipher: data.cipher,
            };
        } else if (values.file && values.file.length > 0) {
            const formData = new FormData();
            formData.append("file", values.file[0]);
            formData.append("algorithm", values.algorithm);
            formData.append("mode", values.mode);

            const response = await fetch(`${BASE_URL}/encrypt-file`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 501) {
                    return {
                        status: 'error',
                        input: 'file',
                        code: response.status,
                        message: errorText,
                    };
                }
                return {
                    status: 'error',
                    input: 'file',
                    code: response.status,
                    message: errorText,
                };
            }

            const key = response.headers.get('key') || '';
            console.log(`Key: ${key}`);
            const blob = await response.blob();
            const filename = response.headers.get('filename') || 'encrypted_file.enc';

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return {
                status: 'success',
                input: 'file',
                message: 'Encryption completed successfully',
                code: response.status,
                key: key,
                cipher: blob,
            };
        } else {
            return {
                status: 'error',
                input: 'text',
                code: 400,
                message: 'Either text or file is required',
            };
        }
    } catch (error) {
        console.error('Catch error:', error);
        return {
            status: 'error',
            input: values.file ? 'file' : 'text',
            code: 501,
            message: `Failed to encrypt: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}