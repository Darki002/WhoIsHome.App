import {Theme} from "@react-navigation/native";

const primary = "#9055A2";
const secondary = "#D499B9";

const light = {
    text: "#11181C",
    background: "#fff",
    border: "#454545",
    icon: "#687076",
}

const dark = {
    text: "#ECEDEE",
    background: "#151718",
    border: "#b5b5b5",
    icon: "#9BA1A6",
}

export const LightTheme: Theme = {
    dark: false,
    colors: {
        primary: primary,
        background: light.background,
        card: light.background,
        text: light.text,
        border: light.border,
        notification: light.background
    }
}

export const DarkTheme: Theme = {
    dark: true,
    colors: {
        primary: primary,
        background: dark.background,
        card: dark.background,
        text: dark.text,
        border: dark.border,
        notification: dark.background
    }
}

export const Colors = {
    light: {
        ...LightTheme.colors,
        secondary: secondary,
        tint: primary,
        icon: light.icon,
        tabIconDefault: light.icon,
        tabIconSelected: primary,
    },
    dark: {
        ...DarkTheme.colors,
        secondary: secondary,
        tint: primary,
        icon: dark.icon,
        tabIconDefault: dark.icon,
        tabIconSelected: primary,
    },
};
