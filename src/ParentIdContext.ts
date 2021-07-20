import { createContext, useContext } from "react";
import { ScopeIdentifier } from "./StatefulTabs.type";

export const ParentIdContext = createContext<ScopeIdentifier>(null);

export const useParentId = (): ScopeIdentifier => useContext(ParentIdContext);
