import { configure } from "@storybook/react";

const req = require.context("../stories", true, /index.tsx$/);

function loadStories() {
    req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
