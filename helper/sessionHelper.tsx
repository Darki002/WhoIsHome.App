import {Tokens} from "@/constants/WihTypes/Auth";

export function isInvalidSession(session: Tokens | null) : boolean {
    return !session || !session.jwtToken || !session.refreshToken;
}