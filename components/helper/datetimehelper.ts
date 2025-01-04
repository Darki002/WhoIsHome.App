export const formatDate = (date: Date) => date.toISOString().split("T")[0];
export const formatTime = (date: Date) => date.toISOString().split("T")[1].substring(0, 8);