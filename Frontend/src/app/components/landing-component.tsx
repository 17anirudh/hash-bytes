import DottedGlowBackground from "@/components/ui/dotted-glow-background";
import { GlobeDemo } from "./globe-component";

export default function Landing() {
    return (
        <div>
            <div>
                <h1 className="text-7xl text-amber-500 text-center mt-9">HASH BYTES</h1>
                <GlobeDemo />
                <p></p>
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
        </div>
    )
}