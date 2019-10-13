import * as React from "react";
import { storiesOf } from "@storybook/react";

import { Provider, Controller, View } from "../src/index";

const stories = storiesOf("StatefulTabs", module);

stories.add("default", () => {
    return (
        <Provider>
            <View></View>
        </Provider>
    );
});
