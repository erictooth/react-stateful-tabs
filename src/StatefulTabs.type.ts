export type InstanceIdentifier = string;

export type ActiveInstance = InstanceIdentifier | null;

export type InstanceProperties<T> = T;

export type InstanceRender<T> = (props: InstanceRenderProps<T>) => React.ReactElement;

export type InstancePropertiesUpdater<T> =
    | InstanceProperties<T>
    | ((previousProperties: InstanceProperties<T>) => InstanceProperties<T>);

export type Instance<T> = {
    render: InstanceRender<T>;
    properties: InstanceProperties<T>;
};

export type InstanceRenderProps<T> = {
    destroy: () => void;
    properties: InstanceProperties<T>;
    update: (properties: InstancePropertiesUpdater<T>) => void;
    visible: boolean;
};
