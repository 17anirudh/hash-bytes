import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function LearnComponent() {
    return (
        <>
            <Tabs defaultValue="algorithm" className="w-full max-w-[83.3333%] px-8 sm:px-20">
                <TabsList>
                    <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
                    <TabsTrigger value="modes">Modes</TabsTrigger>
                </TabsList>
                <TabsContent value="algorithm" className="flex flex-col sm:flex-row sm:gap-8 w-full sm:flex-wrap">
                    <Card className="sm:w-[500px]" id="AES">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Advanced Encryption Standard (AES)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://media.geeksforgeeks.org/wp-content/uploads/20250808153239565880/aes.webp"}
                                    alt="AES Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        Advanced Encryption Standard (AES) is a symmetric block cipher developed by NIST in 2001. It encrypts data in fixed-size blocks using key sizes of 128, 192, or 256 bits. AES is efficient, secure, and widely used in applications like VPNs, HTTPS, and file encryption.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Type</span>
                                        <span> </span>
                                        Block Cipher
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Key Sizes:</span>
                                        <span> </span>
                                        128/192/256 bits
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Strong security, fast performance, widely supported.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Complex implementation, vulnerable if weak key management.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in SSL/TLS, Wi-Fi (WPA2/WPA3), disk encryption, and secure communications.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="DES">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Data Encryption Standard (DES)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://media.geeksforgeeks.org/wp-content/uploads/20250416155622491215/DES-Encryption-Algorithm.webp"}
                                    alt="DES Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        Data Encryption Standard (DES) is a symmetric-key block cipher developed in the 1970s by IBM and adopted by NIST. It uses a 56-bit key and operates on 64-bit data blocks. DES is now considered insecure due to its short key length.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Type</span>
                                        <span> </span>
                                        Block Cipher
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Key Sizes:</span>
                                        <span> </span>
                                        56 bits
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Simple and easy to implement.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Vulnerable to brute-force attacks; outdated for modern use.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Historically used in financial systems and early network encryption.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="DES3">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Triple Data Encryption Standard (3DES)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://media.geeksforgeeks.org/wp-content/uploads/20240209164655/Screenshot-2024-02-09-164420.png"}
                                    alt="Triple DES Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        Triple DES (3DES) is an enhancement of DES that applies the DES algorithm three times to each data block using either two or three keys. It increases security compared to DES but is slower.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Type</span>
                                        <span> </span>
                                        Block Cipher
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Key Sizes:</span>
                                        <span> </span>
                                        112 or 168 bits
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        More secure than DES, easy migration for systems using DES.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Slower performance, now considered weak compared to AES.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in legacy systems, smart cards, and older banking systems.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="CAST-128">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">CAST-128 (CAST5)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://academickids.com/encyclopedia/images/thumb/a/a1/250px-CAST-128-large.png"}
                                    alt="CAST-128 Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        CAST-128, also known as CAST5, is a symmetric block cipher using a 64-bit block size and variable key sizes from 40 to 128 bits. It is known for its speed and security.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Type</span>
                                        <span> </span>
                                        Block Cipher
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Key Sizes:</span>
                                        <span> </span>
                                        40–128 bits
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Flexible key size, strong against differential cryptanalysis.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Limited to 64-bit block size, replaced by AES in modern systems.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in PGP encryption and network security applications.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="ChaCha20">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">ChaCha20</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://tse3.mm.bing.net/th/id/OIP.ZDqyogi0Hp-WJidOKs5ZcAAAAA?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"}
                                    alt="ChaCha20 Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        ChaCha20 is a modern stream cipher designed by Daniel J. Bernstein. It improves upon Salsa20 with better diffusion and security. It operates efficiently on both hardware and software, making it popular in TLS and mobile encryption.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Type</span>
                                        <span> </span>
                                        Stream Cipher
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Key Sizes:</span>
                                        <span> </span>
                                        256 bits
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        High performance, resistant to timing attacks, secure.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Requires nonce reuse protection; not suitable for all legacy systems.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in TLS 1.3, SSH, Google’s QUIC protocol, and VPNs.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="modes" className="flex flex-col sm:flex-row sm:gap-8 w-full sm:flex-wrap">
                    <Card className="sm:w-[500px]" id="ECB">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Electronic Code Book (ECB)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://media.geeksforgeeks.org/wp-content/uploads/20240423201652/Untitled.png"}
                                    alt="ECB Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        ECB is the simplest mode of operation for block ciphers. Each plaintext block is encrypted separately using the same key. Identical plaintext blocks produce identical ciphertexts, making patterns visible.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Simple and fast.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Insecure for large or repetitive data; reveals patterns.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used for encrypting small amounts of random data or keys.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="CBC">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Cipher Block Chaining (CBC)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://media.geeksforgeeks.org/wp-content/uploads/20241216150551381074/2-1024.webp"}
                                    alt="CBC Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        CBC mode chains each block of ciphertext with the previous one using XOR, providing better security. It requires an initialization vector (IV) for the first block.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        More secure than ECB, hides plaintext patterns.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Errors propagate; requires IV; slower in parallel processing.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in TLS, SSH, and file encryption.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="CFB">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Cipher Feedback (CFB)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://media.geeksforgeeks.org/wp-content/uploads/20241216150651593911/3.webp"}
                                    alt="CFB Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        CFB mode turns a block cipher into a self-synchronizing stream cipher. It encrypts smaller segments of plaintext and uses the previous ciphertext block for the next step.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Can process data in small chunks; self-synchronizing.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Error propagation; slower than CTR.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in secure data streams and partial data encryption.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="OFB">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Output Feedback (OFB)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://media.geeksforgeeks.org/wp-content/uploads/20241216150800473849/4.webp"}
                                    alt="OFB Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        OFB converts a block cipher into a synchronous stream cipher. It generates keystream blocks independent of plaintext and XORs them with the data.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        No error propagation; good for noisy channels.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Requires careful IV management; not parallelizable.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in satellite and wireless communications.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="CTR">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Counter (CTR)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://media.geeksforgeeks.org/wp-content/uploads/20241216150852607053/5.webp"}
                                    alt="CTR Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        CTR mode turns a block cipher into a stream cipher by encrypting successive counter values and XORing them with plaintext. It allows parallel encryption and decryption.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Fast, parallelizable, no error propagation.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Nonce reuse can compromise security.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in VPNs, disk encryption, and TLS.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="EAX">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">EAX Mode</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://image1.slideserve.com/3423790/the-eax-mode-of-operation-l.jpg"}
                                    alt="EAX Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                       EAX is an authenticated encryption mode that provides both confidentiality and integrity using CTR mode for encryption and CMAC for authentication.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Provides both encryption and authentication.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Slightly slower due to additional authentication step.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in secure file and message encryption.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="GCM">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Galois/Counter Mode (GCM)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://image.slideserve.com/237117/gcm-mode-overview-l.jpg"}
                                    alt="GCM Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        GCM is an authenticated encryption mode combining CTR for encryption and Galois field multiplication for authentication. It is efficient and widely used.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        High performance, authenticated, parallelizable.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Nonce reuse can break security.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in HTTPS, IPsec, and TLS 1.3.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="CCM">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Counter with CBC-MAC (CCM)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://media.geeksforgeeks.org/wp-content/uploads/counter-mode.png"}
                                    alt="CCM Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        CCM mode combines CTR mode for encryption and CBC-MAC for authentication, providing both confidentiality and integrity.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Authenticated encryption, proven security
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Sequential; slower than GCM.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in Wi-Fi (WPA2), Bluetooth, and IoT devices.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="SIV">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Synthetic IV (SIV)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://image1.slideserve.com/1744464/siv-encrypt-siv-decrypt-l.jpg"}
                                    alt="SIV Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        SIV mode prevents nonce misuse by generating a synthetic IV based on the plaintext and key. Even if a nonce is reused, it maintains security.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Nonce misuse-resistant; authenticated encryption.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Higher computational cost.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in high-security protocols where nonce reuse risk exists.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="OCB">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">Offset Codebook Mode (OCB)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://tse4.mm.bing.net/th/id/OIP.iCtDuvtdzDYw0mXgW274BQHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"}
                                    alt="OCB Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        OCB mode provides authenticated encryption in a single pass, combining confidentiality and authenticity efficiently.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        Fast, single-pass authenticated encryption.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Patent restrictions (historically limited usage).
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in performance-critical cryptographic systems.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="sm:w-[500px]" id="ChaCha20-Poly1305 AEAD">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">ChaCha20-Poly1305 AEAD</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <ul className="gap-11">
                                <li className="mt-6">
                                    <Image 
                                    src={"https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/ChaCha20-Poly1305_Encryption.svg/825px-ChaCha20-Poly1305_Encryption.svg.png"}
                                    alt="ChaCha20-Poly1305 AEAD Visual Representation"
                                    width={1200}
                                    height={800}/>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Description:</span>
                                        <span> </span>
                                        ChaCha20-Poly1305 is an authenticated encryption algorithm that combines the ChaCha20 cipher with the Poly1305 authenticator. It provides both confidentiality and integrity.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Advantages</span>
                                        <span> </span>
                                        High speed, secure, resistant to side-channel attacks.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Disadvantages</span>
                                        <span> </span>
                                        Nonce reuse compromises authentication.
                                    </p>
                                </li>
                                <li className="mt-6">
                                    <p>
                                        <span className="underline">Applications</span>
                                        <span> </span>
                                        Used in TLS 1.3, SSH, and Google Chrome's HTTPS encryption.
                                    </p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    )
}