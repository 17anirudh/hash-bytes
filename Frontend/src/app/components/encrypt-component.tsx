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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { algorithmEnums } from "../resolver/schema";
import { modeEnums } from "../resolver/schema"
import { encryptSchema } from "../resolver/schema";
import { encryption } from "../api/submit";
import { toast } from "sonner"

export default function EncryptComponent() {
  const form = useForm<z.infer<typeof encryptSchema>>({
    resolver: zodResolver(encryptSchema),
    defaultValues: {
      text: "",
      algorithm: "AES",
      mode: "ECB",
      file: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof encryptSchema>) {
    const res = await encryption(values);
    if(res.status == "error") {
      toast(`${res.code}: ${res.message}`);
    }
    else {
      toast("Successfull");
    }
  }

  return (
    <form
      id="form-encrypt"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
      encType="multipart/form-data"
    >
      <FieldGroup>
        {/* TEXT INPUT AREA */}
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
                    {field.value?.length || 0}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Type or paste text you want to encrypt.
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* FILE INPUT FIELD */}
        <Controller
          name="file"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="encrypt-file">
                Upload a file (optional)
              </FieldLabel>
              <Input
                id="encrypt-file"
                type="file"
                onChange={(e) => field.onChange(e.target.files)}
                className="w-full"
              />
              <FieldDescription>
                You can upload a file instead of entering text.
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* ALGORITHM SELECT */}
        <Controller
          name="algorithm"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="encrypt-algorithm">
                Select encryption algorithm
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
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
                Pick the algorithm for encryption.
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

          {/* CIPHER MODE SELECT */}
          <Controller
          name="mode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="encrypt-mode">
                Select cipher mode
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="encrypt-mode" className="w-[200px]">
                  <SelectValue placeholder="Choose a cipher mode" />
                </SelectTrigger>
                <SelectContent>
                  {modeEnums.options.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Pick the cipher mode for encryption.
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
