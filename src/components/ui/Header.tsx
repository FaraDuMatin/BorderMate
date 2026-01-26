"use client";

export default function Header() {
  const basePath = process.env.NODE_ENV === "production" ? "/BorderMate" : "";
  
  return (
    <div className="text-center py-4 sm:py-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight flex items-center justify-center px-4">
        <img
          src={`${basePath}/logo.png`}
          alt="Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 drop-shadow-md"
        />
        <span className="bg-linear-to-r from-[#3e5151] to-[#decba4] bg-clip-text text-transparent">
          BorderMate
        </span>
      </h1>
    </div>
  );
}
