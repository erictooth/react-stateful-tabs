/* eslint-disable */

import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import {
    InstanceRender,
    Provider,
    Controller,
    View,
    useStatefulTabsContext,
} from "react-stateful-tabs";

const ProjectsGeneral = ({ visible }: any) => {
    const [val] = useState(Math.random());
    if (!visible) {
        return null;
    }
    return <h2>General {val}</h2>;
};

const ProjectsUsers = ({ visible }: any) => {
    const [val] = useState(Math.random());
    if (!visible) {
        return null;
    }
    return <h2>Users {val}</h2>;
};

const projects_tabs: Record<"/projects/general" | "/projects/users", InstanceRender<any>> = {
    "/projects/general": (props) => <ProjectsGeneral {...props} />,
    "/projects/users": (props) => <ProjectsUsers {...props} />,
};

function ProjectsTabs({ visible }: { visible: boolean }) {
    const [projectTab, setProjectTab] = useState<keyof typeof projects_tabs>("/projects/general");
    return (
        <>
            <Controller id={projectTab} render={projects_tabs[projectTab]} />
            {visible && (
                <ul>
                    <li onClick={() => setProjectTab("/projects/general")}>General</li>
                    <li onClick={() => setProjectTab("/projects/users")}>Users</li>
                </ul>
            )}
            <View />
        </>
    );
}

const Home = ({ visible }: any) => {
    if (!visible) {
        return <></>;
    }
    return <h1>Home</h1>;
};

const Projects = ({ visible }: any) => {
    return (
        <>
            {visible && <h1>Projects</h1>}
            <ProjectsTabs visible={visible} />
        </>
    );
};

const tabs: Record<"/home" | "/projects", InstanceRender<any>> = {
    "/home": (props) => <Home {...props} />,
    "/projects": (props) => <Projects {...props} />,
};

function TabState() {
    return <pre>{JSON.stringify(useStatefulTabsContext(), null, 2)}</pre>;
}

function App() {
    const [tabId, setTabId] = useState<keyof typeof tabs>("/home");
    return (
        <Provider>
            <ul>
                <li onClick={() => setTabId("/home")}>Home</li>
                <li onClick={() => setTabId("/projects")}>Projects</li>
            </ul>
            <Controller id={tabId} render={tabs[tabId]} />
            <View />
            <TabState />
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
