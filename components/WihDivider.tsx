import WihView from "@/components/WihView";
import {StyleSheet} from "react-native";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

const WihDivider = () => {
    const theme = useWihTheme();
    return  <WihView style={[styles.divider, {backgroundColor: theme.divider}]} />
}

const styles = StyleSheet.create({
    divider: {
        height: 1,
        width: "80%",
        marginVertical: 20,
    }
})

export default WihDivider;