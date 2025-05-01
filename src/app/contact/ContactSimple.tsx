import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

export default function ContactSimple() {
  return (
    <div className="w-full bg-white">
      <main className="w-full overflow-hidden px-4 flex flex-col items-center pt-20">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-2 text-center">Contact Me</h1>
          <p className="text-base text-gray-700 mb-4 text-center">
            This is the simple version of my contact page.<br />
            Animations and effects are disabled for your device.
          </p>
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex flex-col gap-1 items-center">
              <h2 className="text-2xl font-semibold">On Instagram!</h2>
              <p className="text-base">Simply DM me :D</p>
              <a 
                href="https://www.instagram.com/miizumelon/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#0095FF] hover:bg-[#007acc] text-white text-base font-semibold px-6 py-2 rounded-full transition-colors duration-300 mt-1"
              >
                Write Me
              </a>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-xl font-semibold">Social Media</h2>
              <div className="flex gap-4">
                <a href="https://x.com/heymiizu" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF] transition-colors duration-300">
                  <FaXTwitter className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/miizumelon/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF] transition-colors duration-300">
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a href="https://www.youtube.com/@Miizumelon" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF] transition-colors duration-300">
                  <FaYoutube className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-center mt-2">
              <h2 className="text-base font-semibold">Have a question or want to work together?</h2>
              <p className="text-base">Feel free to reach out via email or through social media.</p>
              <a
                href="mailto:your@email.com"
                className="mt-2 bg-[#0095FF] hover:bg-[#007acc] text-white text-base font-semibold px-6 py-2 rounded-full transition-colors duration-300 shadow"
              >
                Contact via Email
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
