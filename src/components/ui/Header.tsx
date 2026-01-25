export default function Header() {
  return (
    <div className="text-center py-8">
      <h1 className="text-5xl font-extrabold tracking-tight flex items-center justify-center">
        <img
          src="/favicon.png"
          alt="Logo"
          className="w-12 h-12 mr-4 drop-shadow-md"
        />
        <span className="bg-linear-to-r from-[#3e5151] to-[#decba4] bg-clip-text text-transparent">
          BorderMate
        </span>
      </h1>
    </div>
  );
}
