import { LockKeyhole as Encrypt, LockKeyholeOpen as Decrypt} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import EncryptComponent from "./encrypt-component";
import DecryptComponent from "./decrypt-component";

export function TabsComponent() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="encrypt">
        <TabsList>
          <TabsTrigger value="encrypt"> <Encrypt/> Encrypt</TabsTrigger>
          <TabsTrigger value="decrypt"><Decrypt />Decrypt</TabsTrigger>
        </TabsList>
        <TabsContent value="encrypt">
          <div>
            <EncryptComponent />
          </div>
        </TabsContent>
        <TabsContent value="decrypt">
            <DecryptComponent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
