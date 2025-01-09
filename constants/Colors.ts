import {createTheme} from '@rneui/themed';

const light = {
    text: "#11181C",
    border: "#454545",
    icon: "#687076",
}

const dark = {
    text: "#ECEDEE",
    border: "#b5b5b5",
    icon: "#9BA1A6",
}

export const theme = createTheme({
    lightColors: {
        primary: "#9055A2",
        secondary: "#D499B9",
        error: 'red',
        background: "#fff",
    },
    darkColors:{
        primary: "#9055A2",
        secondary: "#D499B9",
        error: 'red',
        background: "#151718",
    },
    components: {
        
    }
});
