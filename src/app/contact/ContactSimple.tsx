import ContactForm from "./ContactForm";

export default function ContactSimple() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-[10vw]">
      {/* Copy from page.tsx */}
      <div className="mx-auto mt-28 w-full max-w-5xl">
        <h1
          className="mb-8 text-6xl font-black leading-tight"
          style={{ transform: "rotate(-3deg)" }}
        >
          Right here!
        </h1>
        <div className="-mt-8 mb-4 text-3xl font-medium text-black">
          Request a Project
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
