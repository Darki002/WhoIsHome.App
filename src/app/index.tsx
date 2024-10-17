import WihText from "@/components/WihText";
import WihView from "@/components/WihView";

export default function Index() {
  return (
    <WihView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <WihText>Hello World!</WihText>
    </WihView >
  );
}
