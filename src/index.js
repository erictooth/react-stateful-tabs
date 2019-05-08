import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const instancesReducer = (state = {}, action) => {
    switch (action.type) {
        case "CREATE":
            if (state.hasOwnProperty(action.id)) {
                return state;
            }
            return {
                ...state,
                [action.id]: {
                    render: action.render,
                    properties: action.properties,
                },
            };
        case "DESTROY":
            if (!state.hasOwnProperty(action.id)) {
                return state;
            }

            const { [action.id]: removed, ...rest } = state;
            return rest;
        case "UPDATE":
            if (!state.hasOwnProperty(action.id)) {
                return state;
            }
            const instance = state[action.id];
            return {
                ...state,
                [action.id]: {
                    ...instance,
                    properties: {
                        ...instance.properties,
                        ...action.properties,
                    },
                },
            };

        default:
            return state;
    }
};

const activeInstanceReducer = (state = null, action) => {
    switch (action.type) {
        case "CREATE":
        case "SHOW":
            return action.id;
        case "DESTROY":
        case "HIDE":
            return null;
        default:
            return state;
    }
};

const statefulTabsReducer = (state = {}, action) => ({
    instances: instancesReducer(state.instances, action),
    activeInstance: activeInstanceReducer(state.activeInstance, action),
});

export const StatefulTabsContext = createContext(statefulTabsReducer(undefined, {}));

function usePersistentContext() {
    const [state, dispatch] = useReducer(statefulTabsReducer, statefulTabsReducer(undefined, {}));

    return useMemo(
        () => ({
            instances: state.instances,
            activeInstance: state.activeInstance,
            create: (id, render, properties = {}) => {
                dispatch({ type: "CREATE", id, render, properties });
            },
            hide: id => {
                dispatch({ type: "HIDE", id });
            },
            destroy: id => {
                dispatch({ type: "DESTROY", id });
            },
            update: (id, properties = {}) => {
                dispatch({ type: "UPDATE", id, properties });
            },
        }),
        [state, dispatch]
    );
}

function StatefulTabs({ children }) {
    const contextValue = usePersistentContext();

    return (
        <StatefulTabsContext.Provider value={contextValue}>
            {children(contextValue)}
        </StatefulTabsContext.Provider>
    );
}

StatefulTabs.Controller = React.memo(function StatefulTabsController({ id, render, properties }) {
    const { create, hide } = useContext(StatefulTabsContext);
    useEffect(
        () => {
            if (!id) {
                return;
            }

            create(id, render, properties);

            return () => {
                hide(id);
            };
        },
        [id]
    );

    return null;
});

StatefulTabs.View = function StatefulTabsView() {
    const { activeInstance, instances, ...contextMethods } = useContext(StatefulTabsContext);

    const getInstanceProps = id => {
        return {
            destroy: () => {
                contextMethods.destroy(id);
            },
            update: properties => {
                contextMethods.update(id, properties);
            },
            visible: id === activeInstance,
            properties: instances[id].properties,
        };
    };

    return Object.entries(instances).map(([id, instance]) =>
        React.cloneElement(instance.render(getInstanceProps(id)), { key: id })
    );
};

export default StatefulTabs;
