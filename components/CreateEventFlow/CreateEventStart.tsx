import {WihButton} from "@/components/WihButton";

const createEventStart = () => {
  return (
      <>
        <WihButton onPress={() => null} >One Time</WihButton>
        <WihButton onPress={() => null} >Repeated</WihButton>
      </>
  )
}