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
import { encryptSchema } from "../resolver/schema";
import { encryption } from "../api/encrypt";
import { toast } from "sonner";
import { useState } from "react";

export default function EncryptComponent() {
  const [output, setOutput] = useState<boolean>(false);
  const [outputData, setOutputData] = useState<any>();
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
    setOutput(false);
    const res = await encryption(values);
    if(res.status == "error") {
      toast.error(`${res.code}: ${res.message}`);
    }
    else {
      setOutput(true);
      setOutputData(res);
      toast.success("Successfull");
    }
  }

  return (
    <>
      <Card>
      <CardHeader>
        <CardTitle>Encrypt Form</CardTitle>
        <CardDescription>Submit content in below input field for seamless encryption</CardDescription>
      </CardHeader>
      <CardContent>
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
                        {field.value?.length || 0} characters
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
      </CardContent>
    </Card>
    {output && 
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Results after encryption</CardDescription>
        </CardHeader>
        <CardContent>
          <h2>Key: {outputData.key}</h2> <br />
          {outputData.input === 'text' && <h2>Cipher: <br /> {outputData.cipher}</h2>} <br />
          {outputData.input === 'file' && <p>Encrypted file has been downloaded.</p>}
          <p>Decryption of this cipher only works perfectly if you enter used algorithm and mode for encryption</p>
        </CardContent>
      </Card>
    }
    </>
  )
}