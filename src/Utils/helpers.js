// const formatDate = (dateString) => {
//   const options = { year: "numeric", month: "long", day: "numeric" };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// const formatTime = (dateString) => {
//   const options = { hour: "numeric", minute: "numeric", hour12: true };
//   return new Date(dateString).toLocaleTimeString(undefined, options);
// };

export const formatTimeForInput = (dateString) => {
  const date = new Date(dateString);
  const localTimeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return localTimeString; // Returns '16:30' for 4:30 PM in local time
};

export const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString); // Create the date object

  // Use the user's local timezone to extract year, month, and day.
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };
  return date.toLocaleDateString(undefined, options); // e.g., "October 18, 2024"
};
