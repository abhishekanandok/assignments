import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <div className="relative w-full overflow-hidden px-8 pt-20 pb-0 bg-transparent">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm sm:flex-row md:px-8 relative z-10">
        <div>
          <div className="mr-0 mb-4 md:mr-4 md:flex">
            <Link className="relative z-20 mr-4 flex items-center gap-2 px-2 py-1 text-sm font-normal" href="/" style={{ color: 'var(--text-heading)' }}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                AIEval<span className="text-primary">.</span>
              </span>
            </Link>
          </div>
          <div className="mt-2 ml-2 text-slate-500 font-medium">© copyright AIEval 2026. All rights reserved.</div>
        </div>

        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 md:mt-0 lg:grid-cols-4">
          
          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold transition-colors text-slate-900 dark:text-white">Platform</p>
            <ul className="list-none space-y-4 transition-colors text-slate-500 dark:text-slate-400 font-medium">
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/features/ai-evaluation">AI Evaluation</Link>
              </li>
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/features/plagiarism">Plagiarism Check</Link>
              </li>
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/features/analytics">Analytics</Link>
              </li>
            </ul>
          </div>

           <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold transition-colors text-slate-900 dark:text-white">Socials</p>
            <ul className="list-none space-y-4 transition-colors text-slate-500 dark:text-slate-400 font-medium">

              <li className="list-none">
                <a className="hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
              </li>
              <li className="list-none">
                <a className="hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </li>
              <li className="list-none">
                <a className="hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold transition-colors text-slate-900 dark:text-white">Legal</p>
            <ul className="list-none space-y-4 transition-colors text-slate-500 dark:text-slate-400 font-medium">
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/terms-of-service">Terms & Conditions</Link>
              </li>
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/cookie-policy">Cookie Policy</Link>
              </li>
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/help">Help Center</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold transition-colors text-slate-900 dark:text-white">Company</p>
            <ul className="list-none space-y-4 transition-colors text-slate-500 dark:text-slate-400 font-medium">
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/contact">Contact Us</Link>
              </li>
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/about">About Us</Link>
              </li>
              
              <li className="list-none">
                <Link className="hover:text-primary transition-colors" href="/careers">Careers</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mt-20 pointer-events-none select-none relative z-0">
        <p className="text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] font-black uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent">
          AIEVAL
        </p>
      </div>
    </div>
  );
}
