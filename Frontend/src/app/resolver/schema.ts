import z from "zod";

export const algorithmEnums = z.enum([
  "AES", "DES", "DES3", "CAST-128", "ChaCha20",
]);

export const modeEnums = z.enum([
  "ECB", "CBC", "CFB", "OFB", "CTR", "EAX", "GCM", "CCM", "SIV", "OCB", "ChaCha20_Poly1305"
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
    mode: modeEnums
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
  mode: modeEnums
})
.refine(
    (data) => data.cipher?.trim() || data.file?.length,
    "Either text or file input is required."
  )