export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Get day, month, and year components
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();

  // Pad day and month with leading zeros if necessary
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Format the date as DD-MM-YYYY
  const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

  return formattedDate;
};

export function convertTimeToAMPM(dateString) {
  const date = new Date(dateString);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero if minutes < 10
  const timeString = hours + ":" + minutes + " " + ampm;
  return timeString;
}

// Example usage:
const createdAt = "2024-04-29T23:55:03.431Z";
const time = convertTimeToAMPM(createdAt);
console.log(time); // Output: "11:55 PM"
