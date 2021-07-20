import * as React from "react";
import { useStatefulTabsContext } from "./useStatefulTabsContext";
import { InstanceIdentifier, Instance, ScopeIdentifier } from "./StatefulTabs.type";
import { useMemoizedMap } from "./useMemoizedMap";
import { ParentIdContext, useParentId } from "./ParentIdContext";

const byParentInstance =
    (parentId: ScopeIdentifier) =>
    ([, instance]: [InstanceIdentifier, Instance<any>]): boolean => {
        return parentId === instance.parentId;
    };

const View = React.memo(() => {
    const { activeInstance, activeScopedInstances, instances, destroy, update, move } =
        useStatefulTabsContext();

    const parentId = useParentId();
    const activeId = parentId ? activeScopedInstances[parentId] : activeInstance;

    const instanceProps = useMemoizedMap(
        (id) => ({
            destroy: () => {
                destroy(id);
            },
            update: (properties) => {
                update(id, properties);
            },
            move: (newId: InstanceIdentifier) => {
                move(id, newId);
            },
        }),
        Object.keys(instances)
    );

    const getInstanceProps = (id: InstanceIdentifier) => {
        return {
            tabKey: instances[id].key,
            visible: activeId === id,
            properties: instances[id].properties,
            ...instanceProps[id],
        };
    };

    return (
        <ParentIdContext.Provider value={parentId || activeInstance}>
            {Object.entries(instances)
                .filter(byParentInstance(parentId))
                .map(([id, instance]) =>
                    React.cloneElement(instance.render(getInstanceProps(id)), {
                        key: instances[id].key,
                    })
                )}
        </ParentIdContext.Provider>
    );
});

View.displayName = "StatefulTabs.View";

export { View };
