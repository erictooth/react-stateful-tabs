# React Stateful Tabs &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/erictooth/react-stateful-tabs/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-stateful-tabs.svg?style=flat-square)](https://www.npmjs.com/package/react-stateful-tabs) ![test coverage](https://img.shields.io/badge/coverage-0%25-red.svg?style=flat-square) ![flow coverage](https://img.shields.io/badge/flow--coverage-0%25-red.svg?style=flat-square) ![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

## Usage

### Usage With Reach Router

To derive the tab id from the current route URL, you can wrap `StatefulTabs.Controller` with the below component:

```jsx
const ReachRouterTabController = ({ render, properties, ...routerProps }) => (
  <StatefulTabs.Controller
    id={routerProps.uri}
    properties={properties}
    render={React.useCallback(() => render(routerProps), [render, routerProps])}
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
