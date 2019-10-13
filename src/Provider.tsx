import * as React from "react";
import { InstanceIdentifier } from "./StatefulTabs.type";
import { statefulTabsReducer, DEFAULT_STATE } from "./statefulTabsReducer";
import { StatefulTabsContext, StatefulTabsContextType } from "./StatefulTabsContext";
import { useDeepMemo } from "./utils";

type Props = {
    children: React.ReactNode;
};

export const Provider = <T extends {}>(props: Props) => {
    const { children } = props;
    const [state, dispatch] = React.useReducer(statefulTabsReducer, DEFAULT_STATE);

    // Update action can be called with no changes, so we need to avoid re-rendering
    // when the rootReducer returns a clone of the same state.
    const deepState = useDeepMemo(state);

    const create = React.useCallback(
        (id: InstanceIdentifier, render, properties: Partial<T> = {}) => {
            dispatch({ type: "CREATE", id, render, properties });
        },
        [dispatch]
    );

    const hide = React.useCallback(
        (id: InstanceIdentifier) => {
            dispatch({ type: "HIDE", id });
        },
        [dispatch]
    );

    const show = React.useCallback(
        (id: InstanceIdentifier) => {
            dispatch({ type: "SHOW", id });
        },
        [dispatch]
    );

    const destroy = React.useCallback(
        (id: InstanceIdentifier) => {
            dispatch({ type: "DESTROY", id });
        },
        [dispatch]
    );

    const update = React.useCallback(
        (id: InstanceIdentifier, properties: Partial<T>) => {
            dispatch({ type: "UPDATE", id, properties });
        },
        [dispatch]
    );

    const contextValue: StatefulTabsContextType = React.useMemo(
        () => ({
            ...deepState,
            create,
            destroy,
            hide,
            show,
            update,
        }),
        [deepState, create, destroy, hide, show, update]
    );

    return (
        <StatefulTabsContext.Provider value={contextValue}>{children}</StatefulTabsContext.Provider>
    );
};
