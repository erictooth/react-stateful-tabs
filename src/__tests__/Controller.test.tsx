import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { Controller, Provider } from "../index";

const SampleTab = () => <p>Hello World</p>;
const render_prop = () => <SampleTab />;

// it("should throw when used outside of a provider", () => {
//     expect(() => render(<Controller id="1" render={render_prop} />)).toThrowError();
// });

it("renders without throwing an error", () => {
    render(<Provider><Controller id="1" render={render_prop} /></Provider>)
});