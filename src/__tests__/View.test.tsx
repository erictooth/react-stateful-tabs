import React, { useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { Controller, Provider, View, useStatefulTabsContext } from "../index";

const HookState = ({ children }) => children(useStatefulTabsContext());

const createTestExample = (Tab: React.FC<any>, id = "1", getState = (state) => null) => (
    <Provider>
        <Controller id={id} render={(props) => <Tab {...props} />} />
        <View />
        <HookState>{getState}</HookState>
    </Provider>
);

it("allows the rendered component to destroy itself", () => {
    const BUTTON_LABEL = "Destroy me";
    const Tab = (props) => {
        return <button onClick={props.destroy}>{BUTTON_LABEL}</button>;
    };

    const { getByText } = render(createTestExample(Tab));

    const destroyButton = getByText(BUTTON_LABEL);

    fireEvent.click(destroyButton);

    expect(destroyButton).not.toBeInTheDocument();
});

it("updates the activeInstance's id if it was moved", () => {
    const INITIAL_ID = "1234";
    const TARGET_ID = "5678";
    const BUTTON_LABEL = "Move me";
    const Tab = (props) => {
        return <button onClick={() => props.move(TARGET_ID)}>{BUTTON_LABEL}</button>;
    };

    const onState = jest.fn((state: any) => null);

    const { getByText } = render(createTestExample(Tab, INITIAL_ID, onState));
    const moveButton = getByText(BUTTON_LABEL);

    expect(onState).toHaveBeenCalledTimes(2);
    expect(onState.mock.calls[1][0].activeInstance).toBe(INITIAL_ID);

    fireEvent.click(moveButton);

    expect(onState).toHaveBeenCalledTimes(3);
    expect(onState.mock.calls[2][0].activeInstance).toBe(TARGET_ID);
});
