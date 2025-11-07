export default function CardSkeleton() {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow p-6">
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-4/6"></div>
    </div>
  );
}
