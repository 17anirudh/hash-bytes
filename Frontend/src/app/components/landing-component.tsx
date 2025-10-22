import DottedGlowBackground from "@/components/ui/dotted-glow-background";
import { GlobeDemo } from "./globe-component";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Landing() {
    return (
        <>
            <div>
                <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance text-amber-500 text-center mt-9">
                    HASH BYTES
                </h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6 text-2xl text-black dark:text-white text-center mt-7">
                    Data is the new oil of modern world, in this perfectly connected and evolving world data is being 
                    shared and processed at scale. Understanding the working of cryptography
                    and just basics of it
                    can make us use data securely and responsibly.
                </p>
                <GlobeDemo />
            </div>
            <DottedGlowBackground
            className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
            opacity={1}
            gap={10}
            radius={1.6}
            colorLightVar="--color-neutral-500"
            glowColorLightVar="--color-neutral-600"
            colorDarkVar="--color-neutral-500"
            glowColorDarkVar="--color-sky-800"
            backgroundOpacity={0}
            speedMin={0.3}
            speedMax={1.6}
            speedScale={1}
            />
        </>
    )
}