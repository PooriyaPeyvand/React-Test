import {FC, ReactNode} from "react";
import Styled from "styled-components";

const StyledMain = Styled.main`
    padding : 20px;
`;

const Main: FC<{children: ReactNode}> = ({children}) => <StyledMain>{children}</StyledMain>;

export default Main;
