export const formatTime = (dateString) => {
  const date = new Date(dateString);

  // Get hours, minutes, and seconds components
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Pad hours, minutes, and seconds with leading zeros if necessary
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Format the time as HH:MM:SS
  const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  return formattedTime;
};
