"use client";
import z from "zod";
import { encryptSchema } from "../resolver/schema";

type encryptResponse = {
    key?: string;
    cipher?: string | Blob;
    status: 'success' | 'error';
    code: number;
    message: string;
    input: 'text' | 'file';
};

export async function encryption(values: z.infer<typeof encryptSchema>): Promise<encryptResponse> {
    const result = encryptSchema.safeParse(values);
    if (!result.success) {
        return {
            status: 'error',
            code: 400,
            message: result.error.message,
            input: values.file ? 'file' : 'text',
        };
    }

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
        if (values.text) {
            // Text encryption
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
                cipher: data.cipher,
            };
        } else if (values.file && values.file.length > 0) {
            // File encryption
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
                console.error('Error response:', errorText);
                return {
                    status: 'error',
                    input: 'file',
                    code: response.status,
                    message: errorText,
                };
            }

            const key = response.headers.get('X-Encryption-Key') || '';
            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            console.log('Content-Disposition header:', contentDisposition); // Debug log
            const filenameMatch = contentDisposition?.match(/filename="([^"]+)"/);
            const filename = filenameMatch ? filenameMatch[1] : 'encrypted_file.enc';

            // Trigger file download
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
                cipher: blob, // Return blob as cipher
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