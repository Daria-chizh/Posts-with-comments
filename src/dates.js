const formatDateElement = (dateElement) => String(dateElement).padStart(2, '0');

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const timePart = `${formatDateElement(date.getHours())}:${formatDateElement(date.getMinutes())}:${formatDateElement(date.getSeconds())}`;
  const shortYear = date.getFullYear().toString().substr(2, 2);
  const datePart = `${formatDateElement(date.getDate())}.${formatDateElement(date.getMonth() + 1)}.${shortYear}`;
  return `${timePart} ${datePart}`;
};

export default formatDate;
