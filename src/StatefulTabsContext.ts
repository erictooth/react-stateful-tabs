import { createContext } from "react";
import { InstanceRender, InstanceIdentifier, InstanceProperties } from "./StatefulTabs.type";
import { State } from "./statefulTabsReducer";

export type StatefulTabsContextType = State<any> & {
    create: (
        id: InstanceIdentifier,
        render: InstanceRender<any>,
        properties: InstanceProperties<any>
    ) => void;
    hide: (id: InstanceIdentifier) => void;
    show: (id: InstanceIdentifier) => void;
    destroy: (id: InstanceIdentifier) => void;
    update: (id: InstanceIdentifier, properties: InstanceProperties<any>) => void;
    move: (prevId: InstanceIdentifier, newId: InstanceIdentifier) => void;
};

const DEFAULT_CONTEXT = null;

export const StatefulTabsContext = createContext<StatefulTabsContextType | null>(DEFAULT_CONTEXT);
