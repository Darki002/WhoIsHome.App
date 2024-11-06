export type User = {
    id: number;
    userName: string;
    email: string;
}

export type WihEvent = {
    id: number;
    title: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    eventType: string;
}

export type Tokens = {
    jwtToken: string | null;
    refreshToken: string | null;
}