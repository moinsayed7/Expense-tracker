export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-stone-50 flex flex-col items-center justify-center h-screen">
      <div className="bg-white border border-slate-200 shadow-xl flex flex-col items-center px-7 py-10 rounded-2xl w-70">
        {children}
      </div>
    </div>
  );
}
