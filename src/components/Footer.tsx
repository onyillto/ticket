import { Trophy } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
              <Trophy size={16} className="text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-black text-xs tracking-widest uppercase">FIFA World Cup 2026™</p>
              <p className="text-gray-400 text-xs">United States · Canada · Mexico</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs">
            © 2026 FIFA. This is a demo application. Not affiliated with FIFA.
          </p>
          <div className="flex gap-4 text-gray-400 text-xs">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
