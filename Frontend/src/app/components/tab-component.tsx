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
    <div className="w-full pl-12 sm:pl-32">
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
            <div className="w-full">
              <DecryptComponent />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
