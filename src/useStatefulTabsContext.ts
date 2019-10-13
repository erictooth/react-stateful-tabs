import { useContext } from "react";
import { StatefulTabsContext } from "./StatefulTabsContext";

export const useStatefulTabsContext = () => {
    const ctx = useContext(StatefulTabsContext);

    if (!ctx) {
        throw new Error("React Stateful Tabs cannot be used without a `<Provider>`.");
    }

    return ctx;
};
