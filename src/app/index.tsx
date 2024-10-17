import WihText from "@/components/WihText";
import WihView from "@/components/WihView";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <WihView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <WihText style={{ fontSize: 12 }}>Hello World!</WihText>
    </WihView >
  );
}
