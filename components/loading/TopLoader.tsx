export default function TopLoader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <div className="h-1 w-full bg-gradient-to-r from-red-500 to-red-300 animate-loader-bar" />
    </div>
  );
}
