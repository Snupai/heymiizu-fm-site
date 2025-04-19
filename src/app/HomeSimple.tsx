import Image from "next/image";
import Link from "next/link";

export default function HomeSimple() {
  return (
    <main className="relative w-full bg-white overflow-hidden flex flex-col items-center pt-32">
      <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2 text-center">{"Hey, I'm Miizu"}</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Welcome! This is the simple version of my homepage.<br />
          Animations and effects are disabled for your device.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Animations Card */}
          <div className="bg-[#ffffff] rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <div className="relative h-40 w-full">
              <Image
                src="/mac.png"
                alt="Animations"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-bold mb-1">Animations</h3>
              <p className="text-gray-600 mb-2 flex-1 text-sm">
                Animations made with After Effects, Premiere Pro and Photoshop
              </p>
              <Link 
                href="/projects?category=after-effects"
                className="inline-block bg-[#0095FF] text-white px-4 py-1 rounded-full text-xs hover:bg-[#0077CC] transition-colors text-center"
              >
                See
              </Link>
            </div>
          </div>
          {/* Photography Card */}
          <div className="bg-[#ffffff] rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <div className="relative h-40 w-full">
              <Image
                src="/fx3.png"
                alt="Photography"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-bold mb-1">Photography</h3>
              <p className="text-gray-600 mb-2 flex-1 text-sm">
                Photos I made
              </p>
              <Link 
                href="/projects?category=photography"
                className="inline-block bg-[#0095FF] text-white px-4 py-1 rounded-full text-xs hover:bg-[#0077CC] transition-colors text-center"
              >
                See
              </Link>
            </div>
          </div>
        </div>
        {/* See Everything Button */}
        <div className="flex justify-center mt-4 w-full">
          <Link 
            href="/projects?category=everything"
            className="bg-[#0095FF] text-white px-6 py-2 rounded-full text-base font-medium hover:bg-[#0077CC] transition-colors shadow-lg hover:shadow-xl text-center"
          >
            Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
