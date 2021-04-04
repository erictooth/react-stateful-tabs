import * as React from "react";
import { InstanceIdentifier, InstanceRender, InstanceProperties } from "./StatefulTabs.type";
import { useStatefulTabsContext } from "./useStatefulTabsContext";

type Props<T> = {
    id: InstanceIdentifier;
    render: InstanceRender<T>;

    // Initial properties to set on creation
    properties?: InstanceProperties<T>;
};

export const Controller = <T extends unknown>(props: Props<T>) => {
    const { id, render, properties = {} } = props;
    const { create, hide } = useStatefulTabsContext();

    const configRef = React.useRef({ render, properties });
    configRef.current = { render, properties };

    // We want to block painting until the activeInstance finishes changing
    // so we don't see an intermediate flash between a router-rendered page
    // and a statefultabs-rendered page.
    React.useLayoutEffect(() => {
        if (!id) {
            return;
        }

        create(id, configRef.current.render, configRef.current.properties);

        return () => {
            hide(id);
        };
    }, [id, create, hide]);

    return null;
};
