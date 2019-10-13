import * as React from "react";
import { useStatefulTabsContext } from "./useStatefulTabsContext";
import { InstanceIdentifier } from "./StatefulTabs.type";
import { useMemoizedMap } from "./useMemoizedMap";

export const View = React.memo(() => {
    const { activeInstance, instances, destroy, update } = useStatefulTabsContext();

    const instanceProps = useMemoizedMap(
        (id) => ({
            destroy: () => {
                destroy(id);
            },
            update: (properties) => {
                update(id, properties);
            },
        }),
        Object.keys(instances)
    );

    const getInstanceProps = (id: InstanceIdentifier) => {
        return {
            visible: id === activeInstance,
            properties: instances[id].properties,
            ...instanceProps[id],
        };
    };

    return (
        <>
            {Object.entries(instances).map(([id, instance]) =>
                React.cloneElement(instance.render(getInstanceProps(id)), { key: id })
            )}
        </>
    );
});
