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

export const encryptSchema = z.object({
  text: z.string().min(1, "At least one letter is necessary for encryption"),
  algorithm: algorithmEnums,
});

export const decryptSchema = z.object({
  cipher: z.string(),
  key: z.string(),
  algorithm: algorithmEnums,
})