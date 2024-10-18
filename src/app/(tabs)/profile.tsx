import WihText from "@/components/WihText";
import WihView from "@/components/WihView";

const Profile = () => {
    return (
        <WihView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <WihText>Hello Profile!</WihText>
        </WihView >
    );
}

export default Profile;