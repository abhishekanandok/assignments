'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, X, ChevronRight, BarChart2, BookOpen, GraduationCap, FileText, CheckSquare, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RollingText } from '@/components/ui/RollingText';
import { Bricolage_Grotesque } from 'next/font/google';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const headingFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800']
});

export const HeroSection = () => {
  const channels = ['PDFs', 'Images', 'Code Files', 'Handwritten Text', 'Essays'];
  const [showVideo, setShowVideo] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);
  const heroImageRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const headingSpans = headingRef.current?.querySelectorAll('span.gsap-reveal');
      if (headingSpans) {
        gsap.from(headingSpans, {
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2
        });
      }

      if (paragraphRef.current) {
        gsap.from(paragraphRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.8
        });
      }

      if (buttonsRef.current) {
        gsap.to(buttonsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          delay: 1.1
        });
        gsap.set(buttonsRef.current, { y: 20 });
      }

      if (heroImageRef.current) {
        gsap.from(heroImageRef.current, {
          y: 150,
          scale: 0.85,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 1.4
        });

        gsap.to(heroImageRef.current, {
          y: -10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2.6
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);
  
  return (
    <>
      <div ref={sectionRef} className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-20 mx-auto flex-col items-center justify-center pt-32 overflow-hidden px-4 md:px-8">
        
        {/* Abstract Gradient Background (Orange theme) */}
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center overflow-hidden">
           {/* Solid curved background */}
           <div className="absolute top-[40%] w-[250%] h-[200%] md:w-[180%] lg:w-[150%] rounded-[100%] bg-gradient-to-b from-orange-100/60 via-primary/10 to-primary/20 dark:from-primary/10 dark:via-primary/20 dark:to-primary/30 shadow-[inset_0_4px_40px_rgba(255,255,255,0.5)]"></div>
           {/* Concentric rings */}
           <div className="absolute top-[45%] w-[200%] h-[200%] md:w-[150%] lg:w-[120%] rounded-[100%] border border-white/60 dark:border-white/10"></div>
           <div className="absolute top-[50%] w-[160%] h-[200%] md:w-[120%] lg:w-[90%] rounded-[100%] border border-white/40 dark:border-white/5"></div>
        </div>

        <div className="text-balance relative z-20 mx-auto mb-4 max-w-6xl text-center">
          <h1 ref={headingRef} className={`${headingFont.className} overflow-hidden`}>
            <span className="block gsap-reveal text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-slate-800 dark:text-white">
              Grade Assignments
            </span>
            <span className="block gsap-reveal text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent py-1">
              at Light Speed,
            </span>
            <span className="block gsap-reveal text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-slate-800 dark:text-white">
              with Perfect Accuracy
            </span>
          </h1>
        </div>

        <p ref={paragraphRef} className="relative z-20 mx-auto mt-6 max-w-2xl px-4 text-center text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
          AIEval eliminates subjective bias, saves hundreds of hours, and triggers detailed feedback from your custom rubrics. Our unified engine natively understands{' '}
          <RollingText 
            items={channels} 
            interval={2500}
            className="font-bold text-primary"
          />
        </p>

        <div ref={buttonsRef} className="mb-12 mt-10 z-20 relative sm:mb-16 flex w-full flex-col items-center justify-center gap-4 px-4 sm:px-8 sm:flex-row md:mb-24" style={{ opacity: 0 }}>
          <Link href="/signup">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto hover:scale-[1.02] transition-transform shadow-[0_8px_20px_var(--primary-shadow,rgba(249,115,22,0.3))] rounded-full px-8 py-6 text-base font-semibold"
            >
              Start Grading Now
            </Button>
          </Link>
          <button
            onClick={() => setShowVideo(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold transition-all duration-300 hover:scale-[1.02] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm hover:shadow-md"
          >
            <Play className="w-4 h-4 text-primary" fill="currentColor" />
            Watch Demo
          </button>
        </div>

        {/* Dashboard Preview Recreated via Code */}
        <div className="w-full relative z-20 px-2 sm:px-6 -mt-8 md:-mt-16">
          <div ref={heroImageRef} className="mx-auto w-full max-w-[1050px] bg-white rounded-[24px] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden relative">
            
            <div className="flex w-full h-[580px]">
              
              {/* Sidebar */}
              <div className="hidden md:flex w-[240px] bg-white border-r border-slate-100 p-5 flex-col gap-2 relative z-10">
                 {/* Logo */}
                 <div className="flex items-center gap-2 mb-8 px-2 mt-2">
                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                     <BookOpen className="w-4 h-4 text-white" />
                   </div>
                   <span className="font-extrabold text-slate-800 tracking-tight text-lg">AIEval<span className="text-primary">.</span></span>
                 </div>
                 
                 {/* Menu Items */}
                 <div className="flex flex-col gap-1">
                   {[
                     { icon: BarChart2, label: 'Dashboard' },
                     { icon: UploadCloud, label: 'Uploads', active: true },
                     { icon: CheckSquare, label: 'Rubrics' },
                     { icon: FileText, label: 'Reports' },
                     { icon: GraduationCap, label: 'Students' },
                   ].map((item, idx) => (
                     <div key={idx} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${item.active ? 'bg-primary text-white shadow-md shadow-primary/25' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                       <div className="flex items-center gap-3">
                         <item.icon className={`w-[18px] h-[18px] ${item.active ? 'opacity-100' : 'opacity-70'}`} />
                         {item.label}
                       </div>
                       {item.dropdown && <ChevronRight className="w-3 h-3 opacity-40 rotate-90" />}
                     </div>
                   ))}
                 </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-[#F8FAFC] p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
                 
                 {/* Top Header */}
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div>
                     <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Recent Uploads</h2>
                     <p className="text-[13px] text-slate-400 font-medium mt-0.5">View and manage all evaluation batches</p>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="bg-white border border-slate-200 text-slate-600 text-[13px] font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                       Credits: <span className="text-slate-800">1,250</span>
                     </div>
                     <button className="bg-primary text-white text-[13px] font-bold px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                       <span className="text-lg leading-none mb-[2px]">+</span> New Batch
                     </button>
                   </div>
                 </div>

                 {/* Stats Cards */}
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   {[
                     { title: "Total Assessed", val: "142", iconBg: "bg-primary/10", iconColor: "text-primary", icon: <FileText className="w-4 h-4" /> },
                     { title: "Evaluating", val: "12", iconBg: "bg-blue-100", iconColor: "text-blue-500", icon: <UploadCloud className="w-4 h-4" /> },
                     { title: "Flagged (Plagiarism)", val: "3", iconBg: "bg-amber-100", iconColor: "text-amber-500", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg> },
                     { title: "Average Score", val: "84%", iconBg: "bg-emerald-100", iconColor: "text-emerald-500", icon: <BarChart2 className="w-4 h-4" /> },
                   ].map((stat, i) => (
                     <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                       <div className="text-[12px] font-semibold text-slate-500">{stat.title}</div>
                       <div className="flex justify-between items-end">
                         <div className="text-[28px] font-bold text-slate-800 leading-none">{stat.val}</div>
                         <div className={`w-[34px] h-[34px] rounded-full ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}>{stat.icon}</div>
                       </div>
                     </div>
                   ))}
                 </div>

                 {/* Table Section */}
                 <div className="bg-white border border-slate-200/60 rounded-2xl flex-1 flex flex-col shadow-sm overflow-hidden">
                   <div className="flex justify-end p-4 border-b border-slate-100">
                     <button className="border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-bold text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                       CS101 Final Exam <ChevronRight className="w-3 h-3 opacity-50 rotate-90" />
                     </button>
                   </div>
                   
                   <div className="hidden sm:grid px-6 py-3 border-b border-slate-100 grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                     <div>Student Name</div>
                     <div>Status</div>
                     <div>Progress</div>
                     <div>AI Score</div>
                     <div>Plagiarism</div>
                     <div className="text-right">Actions</div>
                   </div>

                   <div className="px-6 py-4 border-b border-slate-50 flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center text-sm hover:bg-slate-50/50 transition-colors">
                     <div className="flex flex-col gap-1 w-full">
                       <span className="font-bold text-slate-800 text-[13px]">Alex Johnson</span>
                       <span className="text-[10px] text-slate-400 font-medium">Submitted: Today, 9:51 PM</span>
                     </div>
                     <div className="w-full">
                       <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Completed
                       </span>
                     </div>
                     <div className="flex flex-col gap-1.5 w-full pr-4">
                       <span className="text-[11px] font-bold text-slate-600">100%</span>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                       </div>
                     </div>
                     <div className="font-bold text-slate-800 w-full text-[13px]">92 / 100</div>
                     <div className="font-semibold text-[#10B981] w-full text-[13px]">Low (2%)</div>
                     <div className="flex justify-end gap-1.5 text-slate-400 w-full">
                       <button className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>
                       <button className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
                       <button className="w-7 h-7 rounded-md hover:bg-red-50 hover:text-red-500 text-slate-300 flex items-center justify-center transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
                     </div>
                   </div>
                   
                   <div className="px-6 py-4 flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center text-sm hover:bg-slate-50/50 transition-colors">
                     <div className="flex flex-col gap-1 w-full">
                       <span className="font-bold text-slate-800 text-[13px]">Maria Garcia</span>
                       <span className="text-[10px] text-slate-400 font-medium">Submitted: Today, 10:15 PM</span>
                     </div>
                     <div className="w-full">
                       <span className="bg-amber-50 text-amber-600 border border-amber-200/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                         <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Evaluating
                       </span>
                     </div>
                     <div className="flex flex-col gap-1.5 w-full pr-4">
                       <span className="text-[11px] font-bold text-slate-600">45%</span>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-primary w-[45%] rounded-full"></div>
                       </div>
                     </div>
                     <div className="font-semibold text-slate-400 w-full text-[13px]">-</div>
                     <div className="font-semibold text-slate-400 w-full text-[13px]">-</div>
                     <div className="flex justify-end gap-1.5 text-slate-400 w-full">
                       <button className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>
                       <button className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
                       <button className="w-7 h-7 rounded-md hover:bg-red-50 hover:text-red-500 text-slate-300 flex items-center justify-center transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
                     </div>
                   </div>
                 </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowVideo(false)} />
          <div className="relative z-10 w-[90vw] max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 flex items-center justify-center">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="text-white text-xl font-medium">Product Tour Video Integration Pending</div>
          </div>
        </div>
      )}
    </>
  );
};
