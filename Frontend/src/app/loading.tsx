import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <Button variant="outline" disabled size="sm">
            <Spinner />
            Please wait
        </Button>
    )
}