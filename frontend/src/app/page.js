"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, GraduationCap, Sparkles, ChevronRight, Brain, Target, BarChart3, Shield, CheckCircle2, 
  UploadCloud, Cloud, ScanText, Settings, Binary, LineChart, Star, Save, Monitor, ArrowRight, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/layout/HeroSection";
export default function HomePage() {
  const router = useRouter();
  const [hovering, setHovering] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const workflowSteps = [
    { id: 1, title: "Upload Assignment", desc: "Student uploads assignment in PDF or image format.", icon: UploadCloud, color: "text-primary", bg: "bg-orange-100" },
    { id: 2, title: "File Storage", desc: "Securely stored in cloud storage.", icon: Cloud, color: "text-accent", bg: "bg-amber-100" },
    { id: 3, title: "Text Extraction", desc: "OCR/Parser extracts text from images or PDFs.", icon: ScanText, color: "text-yellow-600", bg: "bg-yellow-100" },
    { id: 4, title: "Preprocessing", desc: "Remove stop words, punctuation, normalize text.", icon: Settings, color: "text-rose-500", bg: "bg-rose-100" },
    { id: 5, title: "Feature Extraction", desc: "Convert text to numerical format (TF-IDF).", icon: Binary, color: "text-red-500", bg: "bg-red-100" },
    { id: 6, title: "Similarity Calculation", desc: "Cosine similarity compares answers.", icon: LineChart, color: "text-primary", bg: "bg-orange-100" },
    { id: 7, title: "AI-Based Evaluation", desc: "Relevance, Completeness & Quality Checking.", icon: Brain, color: "text-accent", bg: "bg-amber-100" },
    { id: 8, title: "Score Generation", desc: "System generates final score & detailed feedback.", icon: Star, color: "text-yellow-500", bg: "bg-yellow-100" },
    { id: 9, title: "Result Storage", desc: "Results and feedback stored in MongoDB.", icon: Save, color: "text-rose-600", bg: "bg-rose-100" },
    { id: 10, title: "Output to User", desc: "Final result displayed to the student.", icon: Monitor, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[120px]"></div>
        <div className="absolute left-1/4 right-0 bottom-[-10%] -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/10 opacity-50 blur-[120px]"></div>
      </div>


      {/* Main Content */}
      <div className="relative z-10 mx-auto pt-16 pb-20 flex flex-col items-center justify-center w-full">
        
        <HeroSection />
        {/* Roles Section (Bento Box style) */}
        <div className="w-full max-w-6xl mx-auto px-6 mb-32">
          <motion.div className="grid md:grid-cols-2 gap-8" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            {[
              { id: "faculty", icon: BookOpen, title: "For Faculty", subtitle: "Streamline grading effortlessly.", accent: "text-primary", color: "from-orange-400 to-accent", bg: "bg-gradient-to-br from-white to-orange-50/30", path: "/faculty", items: ["Upload rubrics & model answers", "Customize strictness levels", "Review profound analytics"] },
              { id: "student", icon: GraduationCap, title: "For Students", subtitle: "Get immediate, actionable insights.", accent: "text-rose-500", color: "from-rose-400 to-red-500", bg: "bg-gradient-to-br from-white to-rose-50/30", path: "/student", items: ["Submit assignments seamlessly", "Receive instant scores", "View personalized feedback"] }
            ].map((role) => (
              <Card key={role.id} className={`group relative h-full overflow-hidden cursor-pointer border border-slate-200/60 ${role.bg} backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300`} onClick={() => router.push(role.path)}>
                <CardContent className="p-10 flex flex-col h-full relative z-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg shadow-${role.accent}/20`}>
                      <role.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{role.title}</h2>
                      <p className="text-slate-500 text-base font-medium mt-1">{role.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {role.items.map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-base font-semibold text-slate-700">
                        <CheckCircle2 className={`w-6 h-6 ${role.accent} shrink-0`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={`inline-flex items-center font-bold ${role.accent} group-hover:translate-x-2 transition-transform duration-300`}>
                    Get Started <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>

        {/* Workflow Diagram Section */}
        <div className="w-full bg-slate-50/80 border-y border-slate-200/60 py-24 mb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 bg-white border-slate-200 text-primary font-bold px-3 py-1">THE SYSTEMATIC WORKFLOW</Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">How Assignment Evaluator Works</h2>
              <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto font-medium">A transparent, 10-step AI pipeline engineered for absolute accuracy and fairness.</p>
            </div>

            <div className="relative">
              {/* Connecting Line - Top */}
              <div className="hidden md:block absolute top-[55px] left-[10%] right-[10%] h-1 bg-slate-200/60 rounded-full z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-y-12 gap-x-6 relative z-10">
                {workflowSteps.slice(0, 5).map((step, idx) => (
                  <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="flex flex-col items-center text-center">
                    <div className={`w-28 h-28 rounded-3xl ${step.bg} ${step.color} border-4 border-white shadow-xl flex items-center justify-center mb-6 relative group hover:-translate-y-2 transition-transform duration-300`}>
                      <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center shadow-lg">{step.id}</span>
                      <step.icon className="w-12 h-12" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight">{step.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed px-2">{step.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Connecting Line - Down arrow */}
              <div className="hidden md:flex justify-end pr-[10%] py-10 text-slate-300 relative z-0">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse text-slate-400"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
              </div>

              {/* Connecting Line - Bottom */}
              <div className="hidden md:block absolute bottom-[180px] left-[10%] right-[10%] h-1 bg-slate-200/60 rounded-full z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-y-12 gap-x-6 relative z-10 mt-12 md:mt-0 flex-row-reverse" dir="rtl">
                 {/* Reversing visually for a zig zag flow */}
                 {workflowSteps.slice(5).reverse().map((step, idx) => (
                  <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="flex flex-col items-center text-center" dir="ltr">
                    <div className={`w-28 h-28 rounded-3xl ${step.bg} ${step.color} border-4 border-white shadow-xl flex items-center justify-center mb-6 relative group hover:-translate-y-2 transition-transform duration-300`}>
                      <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center shadow-lg">{step.id}</span>
                      <step.icon className="w-12 h-12" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight">{step.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed px-2">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Bento */}
        <div className="w-full max-w-6xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">Unmatched Precision & Scale</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Built for modern educational institutions looking to modernize their evaluation processes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
             <Card className="md:col-span-2 bg-gradient-to-br from-orange-50 to-white border-orange-100 p-8 shadow-sm hover:shadow-md transition-shadow">
               <Brain className="w-10 h-10 text-primary mb-6" />
               <h3 className="text-2xl font-bold text-slate-900 mb-3">AI-Powered Extraction & Evaluation</h3>
               <p className="text-slate-600 font-medium leading-relaxed">Advanced LLM engines coupled with robust OCR pipelines extract raw data, preprocess it, and run deep semantic checking against your custom rubrics. No more hallucinated scores.</p>
             </Card>
             <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 p-8 shadow-sm hover:shadow-md transition-shadow">
               <Shield className="w-10 h-10 text-accent mb-6" />
               <h3 className="text-xl font-bold text-slate-900 mb-3">Plagiarism & Integrity</h3>
               <p className="text-slate-600 font-medium leading-relaxed">Smart filtering flags potential similarity, code overlaps, and AI-generated content automatically.</p>
             </Card>
             <Card className="bg-gradient-to-br from-rose-50 to-white border-rose-100 p-8 shadow-sm hover:shadow-md transition-shadow">
               <Zap className="w-10 h-10 text-rose-500 mb-6" />
               <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
               <p className="text-slate-600 font-medium leading-relaxed">Evaluate 100s of assignments in minutes, not days. Return results to students instantly.</p>
             </Card>
             <Card className="md:col-span-2 bg-gradient-to-br from-red-50 to-white border-red-100 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
               <BarChart3 className="w-10 h-10 text-red-500 mb-6" />
               <h3 className="text-2xl font-bold text-slate-900 mb-3">Profound Analytics & Insights</h3>
               <p className="text-slate-600 font-medium leading-relaxed">Visual breakdowns of scores across all parameters. Identify class-wide knowledge gaps and export reports directly from the dashboard.</p>
             </Card>
          </div>
        </div>

        {/* Social Proof Banner */}
        <div className="w-full bg-slate-900 text-white py-20 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary/80 mb-2">99%</div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Scoring Accuracy</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary/80 mb-2">10x</div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Faster Grading</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary/80 mb-2">50k+</div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Papers Scored</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary/80 mb-2">24/7</div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Instant Feedback</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="w-full max-w-5xl mx-auto px-6 mb-32 text-center relative">
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-12 md:p-20 shadow-2xl overflow-hidden relative border border-slate-800">
            {/* Glowing orbs */}
            <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 bg-primary opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 -mb-20 w-96 h-96 bg-accent opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 relative z-10 text-white">
              Ready to transform your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">workflow?</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Join thousands of educators who have reclaimed their time and improved student outcomes with AIEval.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
              <Button variant="primary" size="lg" className="rounded-full px-10 h-14 text-base font-bold w-full sm:w-auto shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all hover:-translate-y-1" onClick={() => router.push('/signup')}>
                Create Free Account
              </Button>
              <Button variant="ghost" size="lg" className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md px-10 h-14 text-base font-bold w-full sm:w-auto transition-all hover:-translate-y-1" onClick={() => router.push('/faculty')}>
                Contact Sales
              </Button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
