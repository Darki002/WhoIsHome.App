import { WihAvatar } from "@/components/WihAvatar";
import WihText from "@/components/WihText";
import WihView from "@/components/WihView";

const Profile = () => {
    return (
        <WihView center>
            <WihAvatar name="Darki" />
            <WihText>Hello Profile!</WihText>
        </WihView >
    );
}

export default Profile;