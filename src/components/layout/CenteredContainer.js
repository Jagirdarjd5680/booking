export default function CenteredContainer({ children }) {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[420px] min-h-screen bg-background border-x border-gray-100 shadow-xl flex flex-col relative">
        {children}
      </div>
    </div>
  );
}
