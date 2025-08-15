import ContactForm from './ContactForm';

export default function ContactSimple() {
  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center justify-center px-[10vw]">      
      {/* Copy from page.tsx */}
      <div className="w-full max-w-5xl mx-auto mt-28">
        <h1 className="text-6xl font-black leading-tight mb-8" style={{ transform: "rotate(-3deg)" }}>Right here!</h1>
        <div className="text-3xl font-medium text-black -mt-8 mb-4">Request a Project</div>
      </div>
      <ContactForm />
    </div>
  );
}
