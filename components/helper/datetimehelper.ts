export const formatDate = (date: Date) => date.toISOString().split("T")[0];
export const formatTime = (date: Date) => date.toISOString().split("T")[1].substring(0, 8);

export const timeStringToDate = (timeString: string | Date) : Date => {

    if(timeString instanceof Date){
        return timeString;
    }

    const date = new Date();
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    date.setUTCHours(hours, minutes, seconds, 0);
    return date;
}