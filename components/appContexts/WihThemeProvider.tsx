import {createContext, type PropsWithChildren, useContext} from "react";
import {Colors, ColorsType} from "@/constants/Colors";
import {useColorScheme} from "react-native";

const WihThemeContext = createContext<ColorsType>(Colors.light);

export function WihThemeProvider({children}: PropsWithChildren) {
    const colorScheme = useColorScheme();

    const colors = colorScheme
        ? Colors[colorScheme]
        : Colors.light;

    return (
        <WihThemeContext.Provider value={colors}>
            {children}
        </WihThemeContext.Provider>
    )
}

export function useWihTheme() {
    return useContext(WihThemeContext);
}