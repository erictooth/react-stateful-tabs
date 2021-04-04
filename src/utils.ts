import { useRef } from "react";
import equals from "fast-deep-equal";

export const useDeepMemo = <T>(x: T): T => {
    const xRef = useRef(x);

    if (!equals(x, xRef.current)) {
        xRef.current = x;
    }

    return xRef.current;
};
