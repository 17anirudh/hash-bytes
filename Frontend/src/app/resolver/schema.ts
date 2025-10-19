import z from "zod";

export const algorithmEnums = z.enum([
  "AES",
  "DES",
  "Triple-DES",
  "CAST-128",
  "RC2",
  "ChaCha20",
  "XChaCha20",
  "SALSA20",
  "RC4",
]);

export const encryptSchema = z
  .object({
    text: z.string().optional(),
    file: z.any().optional()
          .refine(
            (val) => val == null || (val instanceof FileList && val.length > 0),
            "Invalid file input"
          ),
    algorithm: algorithmEnums,
  })
  .refine(
    (data) => data.text?.trim() || data.file?.length,
    "Either text or file input is required."
  )

export const decryptSchema = z.object({
  cipher: z.string().optional(),
  key: z.string(),
  file: z.any().optional()
        .refine(
          (val) => val == null || (val instanceof FileList && val.length > 0),
          "Invalid file input"
        ),
  algorithm: algorithmEnums,
})