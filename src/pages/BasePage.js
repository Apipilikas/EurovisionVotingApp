import { forwardRef, useImperativeHandle, useState } from "react"
import { useSession } from "../components/common/session/SessionProvider";

export const BasePage = forwardRef(({socketDependent = true, onPageLoaded, children}, ref) => {

    const [isLoading, setIsLoading] = useState(true);
    const {socketConnected} = useSession();

    const pageLoaded = () => {
        setIsLoading(false);
        onPageLoaded(ref);
    }

    useImperativeHandle(ref, () => ({
        pageLoaded
    }));

    return (
    <main ref={ref}>
        {
            !socketDependent || socketConnected ? (<>{children}</>) : null
        }
    </main>
    );
});