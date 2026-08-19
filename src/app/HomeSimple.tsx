import Image from "next/image";
import Link from "next/link";

export default function HomeSimple() {
  return (
    <main className="relative flex w-full flex-col items-center overflow-hidden bg-white pt-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-4">
        <h1 className="mb-2 text-center text-4xl font-bold">
          {"Hey, I'm Miizu"}
        </h1>
        <p className="mb-6 text-center text-lg text-gray-700">
          Welcome! This is the simple version of my homepage.
          <br />
          Animations and effects are disabled for your device.
        </p>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {/* Animations Card */}
          <div className="flex flex-col overflow-hidden rounded-2xl bg-[#ffffff] shadow-lg">
            <div className="relative h-40 w-full">
              <Image
                src="/mac.png"
                alt="Animations"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="mb-1 text-lg font-bold">Animations</h3>
              <p className="mb-2 flex-1 text-sm text-gray-600">
                Animations made with After Effects, Premiere Pro and Photoshop
              </p>
              <Link
                href="/projects?category=after-effects"
                className="inline-block rounded-full bg-brand px-4 py-1 text-center text-xs text-white transition-colors hover:bg-brand-dark"
              >
                See
              </Link>
            </div>
          </div>
          {/* Commissions Card (renamed from Photography) */}
          <div className="flex flex-col overflow-hidden rounded-2xl bg-[#ffffff] shadow-lg">
            <div className="relative h-40 w-full">
              <Image
                src="/Commissions-card.png"
                alt="Commissions"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="mb-1 text-lg font-bold">Commissions</h3>
              <p className="mb-2 flex-1 text-sm text-gray-600">
                Commissioned projects
              </p>
              <Link
                href="/projects?category=commissions"
                className="inline-block rounded-full bg-[#0095FF] px-4 py-1 text-center text-xs text-white transition-colors hover:bg-[#0077CC]"
              >
                See
              </Link>
            </div>
          </div>
        </div>
        {/* See Everything Button */}
        <div className="mt-4 flex w-full justify-center">
          <Link
            href="/projects?category=everything"
            className="rounded-full bg-brand px-6 py-2 text-center text-base font-medium text-white shadow-lg transition-colors hover:bg-brand-dark hover:shadow-xl"
          >
            Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
