<div align="center">
  <img src='https://github.com/erictooth/react-stateful-tabs/raw/master/media/react-stateful-tabs.png' width="50%" alt='React Stateful Tabs' />
</div>

<h3 align="center">Preserve the internal state of a component when it’s hidden</h3>

<p align="center">
  <a href="https://github.com/erictooth/react-stateful-tabs/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License">
  </a>
  <a href="https://www.npmjs.com/package/react-stateful-tabs">
    <img src="https://img.shields.io/npm/v/react-stateful-tabs.svg">
  </a>
  <img src="https://img.shields.io/badge/coverage-81%25-green.svg" alt="Coverage">
  <a href="https://prettier.io">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="Code Style: Prettier">
  </a>
  <img src="https://flat.badgen.net/bundlephobia/minzip/react-stateful-tabs@latest">
</p>

## Overview
This component helps to preserve the internal state of a tab (or page) when it’s hidden, removing the need to hoist state to the parent or a central store to save it while switching tabs.

## Usage

### Simple Usage

```jsx
const tabs = {
  GENERAL: ({ visible }) => (visible ? <h1>General Tab</h1> : null),
  ACTIVITIES: ({ visible }) => (visible ? <h1>Activites Tab</h1> : null)
};

function SomeComponent() {
  const [currentTab, setCurrentTab] = React.useState("GENERAL");

  return (
    <StatefulTabs>
      {() => (
        <div>
          <button onClick={() => setCurrentTab("GENERAL")}>General</button>
          <button onClick={() => setCurrentTab("ACTIVITIES")}>
            Activities
          </button>
          <StatefulTabs.Controller
            id={currentTab}
            render={tabProps => React.createElement(tabs[currentTab], tabProps)}
          />
          <StatefulTabs.View />
        </div>
      )}
    </StatefulTabs>
  );
}
```

#### `<StatefulTabs.Controller>`

##### `id` prop: `string | number` indicates the currently selected tab. Whenever it changes, it will create a new tab (if that `id` has not yet been opened), or show the existing instance with that id.

##### `render` prop: `(tabProps: {visible: boolean, properties: Object, destroy: () => void, update: (newProperties: Object) => void}) => React.Element` function that returns the component associated with the currently selected `id`

#### `<StatefulTabs.View />`
Placed anywhere within `<StatefulTabs>` to render the currently selected tab.

### Usage With React Router

To derive the tab id from the current route URL, you can wrap `StatefulTabs.Controller` with the below component:

```jsx
const ReactRouterTabController = ({ render, properties }) => routerProps => (
  <StatefulTabs.Controller
    id={routerProps.match.url}
    render={() => render(routerProps)}
  />
);
```

And then render it in a React Router `Route`:

```jsx
<Router>
    <Route
      path="/:projectId"
      render={ReactRouterTabController({
        render: routerProps => <ProjectView projectId={routerProps.match.params.projectId} />
      })}
    />
</Router>
```

### Usage With Reach Router

To derive the tab id from the current route URL, you can wrap `StatefulTabs.Controller` with the below component:

```jsx
const ReachRouterTabController = ({ render, properties, ...routerProps }) => (
  <StatefulTabs.Controller
    id={routerProps.uri}
    properties={properties}
    render={React.useCallback((tabProps) => render({ ...tabProps, ...routerProps }), [render, routerProps])}
  />
);
```

And then render it inside of a Reach Router `Router`:

```jsx
<Router>
  <ReachRouterTabController
    path="/:projectId"
    render={routerProps => (
      <ProjectView projectId={routerProps.projectId} />
    )}
  />
</Router>
```
