"use client";
import z from "zod";
import { decryptSchema } from "../resolver/schema";

type decryptResponse = {
    plain?: string | Blob;
    status: 'success' | 'error';
    code: number;
    message: string;
    input: 'text' | 'file' | null;
};

export async function decryption(values: z.infer<typeof decryptSchema>): Promise<decryptResponse> {
    const result = decryptSchema.safeParse(values);
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
        if (values.cipher) {
            // Text decryption
            const payload = {
                cipher: values.cipher,
                key: values.key,
                algorithm: values.algorithm,
                mode: values.mode,
            };
            const response = await fetch(`${BASE_URL}/decrypt-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                return {
                    status: 'error',
                    input: null,
                    code: response.status,
                    message: "Please re-check your key, algorithm or cipher",
                };
            }

            const data = await response.json();
            return {
                status: 'success',
                input: 'text',
                message: 'Decryption completed successfully',
                code: response.status,
                plain: data["plain-text"],
            };
        } else if (values.file && values.file.length > 0) {
            // File decryption
            const formData = new FormData();
            formData.append("file", values.file[0]);
            formData.append("algorithm", values.algorithm);
            formData.append("key", values.key);
            formData.append("mode", values.mode);

            const response = await fetch(`${BASE_URL}/decrypt-file`, {
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

            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            console.log('Content-Disposition header:', contentDisposition); // Debug log
            const filenameMatch = contentDisposition?.match(/filename="([^"]+)"/);
            const filename = filenameMatch ? filenameMatch[1] : 'decrypted_file';

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
                message: 'Decryption completed successfully',
                code: response.status,
                plain: blob, // Return blob as plain
            };
        } else {
            return {
                status: 'error',
                input: 'text',
                code: 400,
                message: 'Either cipher text or file is required',
            };
        }
    } catch (error) {
        console.error('Catch error:', error);
        return {
            status: 'error',
            input: values.file ? 'file' : 'text',
            code: 501,
            message: `Failed to decrypt: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}