import * as React from "react";
import { useDeepMemo } from "./utils";

export function useMemoizedMap<T>(createCb: (key: string) => T, keys: string[]): Record<string, T> {
    const createCbRef = React.useRef(createCb);
    createCbRef.current = createCb;

    const savedKeys = useDeepMemo(keys);

    const prevState = React.useRef({});

    return React.useMemo(() => {
        const nextState = savedKeys.reduce((nextState, key) => {
            if (Object.prototype.hasOwnProperty.call(prevState.current, key)) {
                nextState[key] = prevState.current[key];
            } else {
                nextState[key] = createCbRef.current(key);
            }
            return nextState;
        }, {});

        prevState.current = nextState;

        return nextState;
    }, [savedKeys]);
}
