"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { decryptSchema } from "../resolver/schema";
import { algorithmEnums } from "../resolver/schema"

export default function DecryptComponent() {
  const form = useForm<z.infer<typeof decryptSchema>>({
    resolver: zodResolver(decryptSchema),
    defaultValues: {
      cipher: "",
      key: "",
      algorithm: "AES",
    },
  })

  function onSubmit(values: z.infer<typeof decryptSchema>) {
    toast(`${values.algorithm} change this function`);
  }

  return (
    <form id="form-encrypt" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        {/* TEXTAREA FIELD */}
        <Controller
          name="cipher"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="decrypt-text">Enter cipher</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="decrypt-text"
                  placeholder="Type your cipher..."
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length} characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Paste the cipher you want to decrypt
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* TEXT FIELD */}
        <Controller
          name="key"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="encrypt-text">Enter the key</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="key-for-decryption"
                  placeholder="Enter your key..."
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length} characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Enter/Paste the key provided after encryption
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* SELECT FIELD */}
        <Controller
          name="algorithm"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="encrypt-algorithm">
                Select decryption algorithm
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger id="encrypt-algorithm" className="w-[200px]">
                  <SelectValue placeholder="Choose algorithm" />
                </SelectTrigger>
                <SelectContent>
                  {algorithmEnums.options.map((algo) => (
                    <SelectItem key={algo} value={algo}>
                      {algo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Pick the same algorithm you used for encryption
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="mt-4">
        Decrypt
      </Button>
    </form>
  )
}
