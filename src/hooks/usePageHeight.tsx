import { useEffect, useState } from "react";

const usePageHeight = () => {
    const [height, setHeight] = useState<number>(1000);

    useEffect(() => {
        setHeight(window.innerHeight);
        const listener = (e: Event) => {
            setHeight((e.target as VisualViewport).height)
            document.documentElement.scrollTop = 0;
        }
        visualViewport?.addEventListener('resize', listener)
        return () => {
            visualViewport?.removeEventListener("resize", listener);
        }
    }, [])

    return [height]
}

export default usePageHeight