import React, { PropsWithChildren } from "react";
import ModeProvider from "@/context/mode";
import ThemeProvider from "@/context/theme";

export const Context: React.FC<PropsWithChildren<unknown>> = (props) => {
    const { children } = props;
    return <ModeProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </ModeProvider>
}
export default Context;
