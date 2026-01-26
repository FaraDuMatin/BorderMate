import Image from "next/image";

export default function Header() {
  return (
    <div className="text-center py-8">
      <h1 className="text-5xl font-extrabold tracking-tight flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="mr-4 drop-shadow-md"
        />
        <span className="bg-linear-to-r from-[#3e5151] to-[#decba4] bg-clip-text text-transparent">
          BorderMate
        </span>
      </h1>
    </div>
  );
}
