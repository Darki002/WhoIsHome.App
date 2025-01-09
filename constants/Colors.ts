const primary = "#9055A2";
const secondary = "#D499B9";

const light = {
    text: "#11181C",
    background: "#fff",
    border: "#454545",
    icon: "#687076",
    buttonBackground: primary,
    buttonText: "#fff",
    buttonBorder: "#874b96",
    link: primary,
    linkHover: secondary,
    disabledText: "#B3B3B3",
    disabledBackground: "#F5F5F5",
    overlay: "rgba(0, 0, 0, 0.2)",
    shadow: "rgba(0, 0, 0, 0.1)",
    error: "#FF4D4F",
    warning: "#FAAD14",
    success: "#52C41A",
    info: "#1890FF",
    cardBackground: "#FAFAFA",
    cardBorder: "#E8E8E8",
};

const dark = {
    text: "#ECEDEE",
    background: "#151718",
    border: "#b5b5b5",
    icon: "#9BA1A6",
    buttonBackground: primary,
    buttonText: "#fff",
    buttonBorder: "#7a498a",
    link: secondary,
    linkHover: primary,
    disabledText: "#686868",
    disabledBackground: "#2A2A2A",
    overlay: "rgba(255, 255, 255, 0.2)",
    shadow: "rgba(0, 0, 0, 0.4)",
    error: "#FF6F61",
    warning: "#FFC069",
    success: "#73D13D",
    info: "#40A9FF",
    cardBackground: "#1F1F1F",
    cardBorder: "#333333",
};


export const Colors = {
    light: {
        ...light,
        primary: primary,
        secondary: secondary,
        tint: primary,
        tabIconSelected: primary,
    },
    dark: {
        ...dark,
        primary: primary,
        secondary: secondary,
        tint: primary,
        tabIconSelected: primary,
    },
};

export type ColorsType = typeof Colors.light;
