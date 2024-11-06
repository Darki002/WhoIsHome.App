import { WihText } from "@/components/WihText";
import WihView from "@/components/WihView";
import useWihApiInterval from "@/hooks/useWihApiInterval";

const TIME = 5 * 60 * 1000;

type DailyOverview = {
    userId: number,
    isAtHome: boolean,
    dinnerTime: "string"
}

const Index = () => {
    const response = useWihApiInterval<DailyOverview>({
        time: TIME,
        method: "GET",
        endpoint: "DailyOverview"
    });

  return (
    <WihView center="full">
      <WihText>Hello Home!</WihText>
    </WihView >
  );
}

export default Index;
