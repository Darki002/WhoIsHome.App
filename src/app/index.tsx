import WihText from "@/components/WihText";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <WihText style={{ fontSize: 12 }}>Hello World!</WihText>
    </View >
  );
}
