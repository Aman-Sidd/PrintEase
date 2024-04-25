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
