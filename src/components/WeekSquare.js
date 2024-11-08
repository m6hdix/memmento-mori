export default function WeekSquare({ isPast, isFuture, date }) {
  return (
    <div
      className={`w-2 h-2 rounded-sm cursor-pointer transition-colors duration-200
        ${isPast ? "bg-gray-600" : "bg-gray-200"}
        hover:bg-gray-400`}
      title={date.toLocaleDateString()}
    />
  );
}
