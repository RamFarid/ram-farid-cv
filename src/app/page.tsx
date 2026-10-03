import Image from "next/image";

// Placeholder until the [locale] home page is built.
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <Image
        src="/brand/ram-logo-on-dark.svg"
        alt="Ram Farid"
        width={160}
        height={162}
        priority
      />
    </main>
  );
}
