export const formatDate = (date: Date) => date.toISOString().split("T")[0];
export const formatTime = (date: Date) => date.toISOString().split("T")[1].substring(0, 8);

export const timeStringToDate = (timeString?: string | Date | null) : Date | undefined => {

    if(!timeString)
    {
        return undefined;
    }

    if(timeString instanceof Date){
        return timeString;
    }

    const date = new Date();
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    date.setUTCHours(hours, minutes, seconds, 0);
    return date;
}

export const dateStringToDate = (dateString?: string | Date | null) : Date | undefined => {

    if(!dateString)
    {
        return undefined;
    }

    if(dateString instanceof Date){
        return dateString;
    }
    return  new Date(dateString);
}

export const timeDisplayString = (time?: Date | string) => {
    if(!time) return undefined;

    return new Date(time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
};