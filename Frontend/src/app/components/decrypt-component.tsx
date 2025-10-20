"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { algorithmEnums } from "../resolver/schema";
import { modeEnums } from "../resolver/schema";
import { decryptSchema } from "../resolver/schema";
import { decryption } from "../api/decrypt";
import { toast } from "sonner";
import { useState } from "react";

export default function DecryptComponent() {
  const [output, setOutput] = useState<boolean>(false);
  const [outputData, setOutputData] = useState<any>();
  const form = useForm<z.infer<typeof decryptSchema>>({
    resolver: zodResolver(decryptSchema),
    defaultValues: {
      cipher: "",
      key: "",
      algorithm: "AES",
      mode: "ECB",
      file: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof decryptSchema>) {
    const res = await decryption(values);
    if(res.status == "error") {
      toast(`${res.code}: ${res.message}`);
    }
    else {
      setOutput(true);
      setOutputData(res);
      toast("Successful");
    }
  }

  return (
    <>
      <Card>
      <CardHeader>
        <CardTitle>Decrypt Form</CardTitle>
        <CardDescription>Submit the cipher or encrypted file for decryption</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-decrypt"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
          >
          <FieldGroup>
            {/* CIPHER TEXT INPUT AREA */}
            <Controller
              name="cipher"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="decrypt-cipher">Enter cipher text (optional)</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="decrypt-cipher"
                      placeholder="Paste your cipher text..."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.value ?? "").length} characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Paste the cipher text you want to decrypt.
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
                  <FieldLabel htmlFor="decrypt-file">
                    Upload encrypted file (optional)
                  </FieldLabel>
                  <Input
                    id="decrypt-file"
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                    className="w-full"
                  />
                  <FieldDescription>
                    You can upload an encrypted file instead of entering cipher text.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* KEY INPUT */}
            <Controller
              name="key"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="decrypt-key">Enter the key</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="decrypt-key"
                      placeholder="Enter your key (hex)..."
                      rows={3}
                      className="resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length} characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Enter the key provided after encryption.
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
                  <FieldLabel htmlFor="decrypt-algorithm">
                    Select decryption algorithm
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="decrypt-algorithm" className="w-[200px]">
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
                    Pick the same algorithm used for encryption.
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
                  <FieldLabel htmlFor="decrypt-mode">
                    Select cipher mode
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="decrypt-mode" className="w-[200px]">
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
                    Pick the same cipher mode used for encryption.
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
      </CardContent>
    </Card>
    {output && 
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Results after decryption</CardDescription>
        </CardHeader>
        <CardContent>
          {outputData.input === 'text' && <h2>Plain Text: {outputData.plain}</h2>}
          {outputData.input === 'file' && <p>Decrypted file has been downloaded.</p>}
        </CardContent>
      </Card>
    }
    </>
  )
}