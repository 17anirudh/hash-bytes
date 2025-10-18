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
import { encryptSchema } from "../resolver/schema"
import { algorithmEnums } from "../resolver/schema"

export default function EncryptComponent() {
  const form = useForm<z.infer<typeof encryptSchema>>({
    resolver: zodResolver(encryptSchema),
    defaultValues: {
      text: "",
      algorithm: "AES",
    },
  })

  function onSubmit(values: z.infer<typeof encryptSchema>) {
    toast(`${values.algorithm} change this function`);
  }

  return (
    <form id="form-encrypt" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        {/* TEXTAREA FIELD */}
        <Controller
          name="text"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="encrypt-text">Enter text</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="encrypt-text"
                  placeholder="Type your text..."
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
                Paste the text you want to encrypt
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
                Select encryption algorithm
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
                Pick the algorithm used for encryption
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="mt-4">
        Encrypt
      </Button>
    </form>
  )
}
