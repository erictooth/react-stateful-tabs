import {
    ActiveInstance,
    Instance,
    InstanceIdentifier,
    InstanceRender,
    InstanceProperties,
    InstancePropertiesUpdater,
} from "./StatefulTabs.type";

export type State<T> = {
    instances: Record<InstanceIdentifier, Instance<T>>;
    activeInstance: ActiveInstance;
};

export type Actions<T> =
    | {
          type: "CREATE";
          id: InstanceIdentifier;
          render: InstanceRender<T>;
          properties: InstanceProperties<T>;
      }
    | { type: "DESTROY"; id: InstanceIdentifier }
    | {
          type: "UPDATE";
          id: InstanceIdentifier;
          properties: InstancePropertiesUpdater<T>;
      }
    | { type: "HIDE"; id: InstanceIdentifier }
    | { type: "SHOW"; id: InstanceIdentifier }
    | { type: "MOVE"; prevId: InstanceIdentifier; newId: InstanceIdentifier };

export const DEFAULT_STATE: State<any> = {
    instances: {},
    activeInstance: null,
};

const instancesReducer = <T>(
    state: State<T>["instances"] = DEFAULT_STATE.instances,
    action: Actions<T>
): State<T>["instances"] => {
    switch (action.type) {
        case "CREATE":
            if (Object.prototype.hasOwnProperty.call(state, action.id)) {
                return state;
            }
            return {
                ...state,
                [action.id]: {
                    render: action.render,
                    properties: action.properties,
                },
            };
        case "DESTROY": {
            if (!Object.prototype.hasOwnProperty.call(state, action.id)) {
                return state;
            }

            const nextState = { ...state };
            delete nextState[action.id];

            return nextState;
        }
        case "UPDATE": {
            if (!Object.prototype.hasOwnProperty.call(state, action.id)) {
                return state;
            }
            const instance = state[action.id];

            const nextProperties = (() => {
                if (typeof action.properties === "function") {
                    // https://github.com/microsoft/TypeScript/issues/27422
                    const updater = action.properties as ((previousProperties: T) => T);
                    return updater(instance.properties);
                }

                return action.properties;
            })();

            if (!nextProperties || nextProperties === state[action.id].properties) {
                return state;
            }
            return {
                ...state,
                [action.id]: {
                    ...instance,
                    properties: {
                        ...instance.properties,
                        ...nextProperties,
                    },
                },
            };
        }
        case "MOVE": {
            if (!Object.prototype.hasOwnProperty.call(state, action.prevId)) {
                return state;
            }

            const properties = state[action.prevId];

            const nextState = { ...state };
            delete nextState[action.prevId];

            return {
                ...nextState,
                [action.newId]: properties,
            };
        }

        default:
            return state;
    }
};

const activeInstanceReducer = <T>(
    state: State<T>["activeInstance"] = DEFAULT_STATE.activeInstance,
    action: Actions<T>
): State<T>["activeInstance"] => {
    switch (action.type) {
        case "CREATE":
        case "SHOW":
            return action.id;
        case "DESTROY":
        case "HIDE":
            if (action.id === state) {
                return null;
            }
            return state;
        case "MOVE":
            if (action.prevId === state) {
                return null;
            }
            return state;
        default:
            return state;
    }
};

export const statefulTabsReducer = <T>(
    state: State<T> = DEFAULT_STATE,
    action: Actions<T>
): State<T> => ({
    instances: instancesReducer<T>(state.instances, action),
    activeInstance: activeInstanceReducer<T>(state.activeInstance, action),
});
