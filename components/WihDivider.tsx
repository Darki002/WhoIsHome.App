import WihView from "@/components/WihView";
import {StyleSheet} from "react-native";

const WihDivider = () => {
    return  <WihView style={styles.divider} />
}

const styles = StyleSheet.create({
    divider: {
        height: 1,
        width: "80%",
        backgroundColor: "#ddd",
        marginVertical: 20,
    }
})

export default WihDivider;