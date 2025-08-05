import { type ReactNode } from "react";
import styled from "@emotion/styled";

export const Sidebar = ({ children }: { children: ReactNode }) => {
  return <Aside>{children}</Aside>;
};

const Aside = styled.aside`
  width: 100%;
  height: 100%;
  border-right: 2px solid;
  border-color: #242424;
  padding-top: 3px;
`;

export default Sidebar;
