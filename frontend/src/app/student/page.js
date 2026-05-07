"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload, FileText, GraduationCap, ArrowLeft, CheckCircle2, XCircle,
  AlertTriangle, Lightbulb, ChevronDown, ChevronUp, Sparkles, BarChart3,
  TrendingUp, AlertCircle, BookOpen, Star, Target, Clock, Eye
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

function FileDropzone({ onDrop, file }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => onDrop(accepted[0]),
    accept: { "application/pdf": [".pdf"], "application/msword": [".doc", ".docx"] },
    maxFiles: 1,
  });
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : file ? "border-emerald-400 bg-emerald-50" : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText className="w-10 h-10 text-emerald-600" />
          <div className="text-left">
            <p className="font-semibold text-emerald-700">{file.name}</p>
            <p className="text-sm text-emerald-600">{(file.size / 1024).toFixed(1)} KB · Ready to submit</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
      ) : (
        <div>
          <Upload className="w-14 h-14 text-muted-foreground mx-auto mb-3" />
          <p className="text-base font-medium mb-1">Drop your assignment here</p>
          <p className="text-sm text-muted-foreground">PDF or DOC/DOCX supported</p>
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score, max }) {
  const pct = (score / max) * 100;
  const color = pct >= 75 ? "text-emerald-700" : pct >= 50 ? "text-amber-700" : "text-red-700";
  const bg = pct >= 75 ? "bg-emerald-100" : pct >= 50 ? "bg-amber-100" : "bg-red-100";
  return (
    <span className={`${bg} ${color} font-bold px-3 py-1 rounded-full text-sm`}>
      {score}/{max}
    </span>
  );
}

const DEMO_RESULT = {
  totalMarks: 7.5,
  maxMarks: 10,
  percentage: 75,
  grade: "B+",
  similarityRisk: "low",
  scores: [
    { parameter: "Concept Accuracy", score: 2.5, maxScore: 3, feedback: "Core OOP concepts are well understood. Polymorphism explanation is accurate and includes both compile-time and runtime polymorphism.", status: "good" },
    { parameter: "Completeness", score: 1.5, maxScore: 2, feedback: "Most parts are answered but the question about abstract classes vs interfaces is only partially addressed.", status: "partial" },
    { parameter: "Relevance", score: 2, maxScore: 2, feedback: "All answers are directly relevant to the questions. No off-topic content detected.", status: "good" },
    { parameter: "Language Quality", score: 1, maxScore: 2, feedback: "Some grammatical errors in paragraphs 3 and 5. The use of technical terminology is appropriate but sentence structures could be cleaner.", status: "partial" },
    { parameter: "Structure", score: 0.5, maxScore: 1, feedback: "Introduction and body are present but conclusion is very brief and doesn't summarize key learnings.", status: "partial" },
  ],
  improvements: [
    "Provide a concrete real-world example when explaining inheritance (e.g., Vehicle → Car hierarchy)",
    "Expand the conclusion to summarize how each OOP concept relates to software design",
    "Proofread for grammatical consistency — particularly subject-verb agreement",
    "Include a comparison table for abstract classes vs interfaces",
    "Add a small code snippet to demonstrate polymorphism in action",
  ],
  strengths: [
    "Strong understanding of encapsulation with clear examples",
    "Correct definition and use cases for all four OOP pillars",
    "Good use of technical vocabulary throughout",
  ],
  aiComment: "This is a solid assignment demonstrating a good foundational understanding of Object-Oriented Programming. The student shows confidence in core concepts but needs to strengthen their explanations with real-world examples and improve the conclusion. Minor language issues slightly impact readability.",
};

export default function StudentPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [file, setFile] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [expandedParam, setExpandedParam] = useState(null);
  const { token, user, loading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("new");
  const [historySubmissions, setHistorySubmissions] = useState([]);

  const fetchMySubmissions = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/student/my-submissions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setHistorySubmissions(data.submissions);
    } catch (e) { console.error(e); }
  }, [token]);

  useEffect(() => {
    if (!loading && (!token || (user?.role !== "student" && user?.role !== "teacher"))) {
      router.push("/login"); // Both students and teachers can test evaluation
    }
  }, [token, user, loading, router]);

  useEffect(() => {
    if (activeTab === "history" && token) {
      fetchMySubmissions();
    }
  }, [activeTab, token, fetchMySubmissions]);

  const handleEvaluate = async () => {
    if (!file) { setError("Please upload your assignment file."); return; }
    if (!studentName) { setError("Please enter your name."); return; }
    setError("");
    setIsEvaluating(true);
    try {
      const formData = new FormData();
      formData.append("assignment", file);
      formData.append("sessionId", sessionId || "DEMO");
      formData.append("studentName", studentName);
      const res = await fetch("http://localhost:5000/api/student/evaluate", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) setResult(data.result);
      else { setError(data.message || "Evaluation failed."); }
    } catch {
      // Demo mode
      await new Promise(r => setTimeout(r, 3000));
      setResult(DEMO_RESULT);
    }
    setIsEvaluating(false);
  };


  const radarData = result?.scores.map(s => ({
    subject: s.parameter.replace(" ", "\n"),
    score: Math.round((s.score / s.maxScore) * 100),
    fullMark: 100,
  }));

  const gradeColor = result?.percentage >= 75 ? "text-emerald-700" : result?.percentage >= 50 ? "text-amber-700" : "text-red-700";
  const gradeBg = result?.percentage >= 75 ? "from-emerald-50 to-teal-50 border-emerald-200" : result?.percentage >= 50 ? "from-amber-50 to-yellow-50 border-amber-200" : "from-red-50 to-pink-50 border-red-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-white">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 90% 10%, rgba(139,92,246,0.07) 0%, transparent 40%)"
      }} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Student Portal</h1>
              <p className="text-sm text-muted-foreground">Submit your assignment for AI evaluation</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8 items-start">
          <TabsList className="flex-col h-auto w-full md:w-64 shrink-0 bg-white/80 shadow-sm border border-slate-200/50 rounded-2xl p-3 gap-1 sticky top-8">
            <div className="w-full px-3 py-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</div>
            <TabsTrigger value="new" onClick={() => setResult(null)} className="w-full justify-start px-4 py-2.5 text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all rounded-xl">
              <Upload className="w-4 h-4 mr-3" />New Submission
            </TabsTrigger>
            <TabsTrigger value="history" className="w-full justify-start px-4 py-2.5 text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all rounded-xl">
              <Clock className="w-4 h-4 mr-3" />My History
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0 w-full">

          <TabsContent value="new">
            {!result ? (
              <div className="space-y-6 animate-fade-in">
                <Card className="shadow-sm border-0 bg-white/80">
                  <CardHeader>
                    <CardTitle className="text-lg">Assignment Submission</CardTitle>
                    <CardDescription>Enter your details and upload your assignment to get instant AI feedback</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Your Name *</Label>
                        <Input placeholder="eg: Narendra" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Session ID <span className="text-muted-foreground text-xs">(optional)</span></Label>
                        <Input placeholder="Enter session ID from faculty" value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Assignment *</Label>
                      <FileDropzone onDrop={setFile} file={file} />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <Button size="lg" className="w-full" onClick={handleEvaluate} disabled={isEvaluating || !file}>
                      {isEvaluating ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>AI is evaluating your assignment...</span>
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Evaluate with AI
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Evaluation criteria preview */}
                <Card className="shadow-sm border-0 bg-white/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">What will be evaluated?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: "Concept Accuracy", icon: BookOpen, color: "text-blue-600 bg-blue-100" },
                        { label: "Completeness", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
                        { label: "Relevance", icon: Target, color: "text-indigo-600 bg-indigo-100" },
                        { label: "Language Quality", icon: Star, color: "text-amber-600 bg-amber-100" },
                        { label: "Structure", icon: BarChart3, color: "text-purple-600 bg-purple-100" },
                        { label: "Similarity Risk", icon: AlertTriangle, color: "text-red-600 bg-red-100" },
                      ].map(({ label, icon: Icon, color }) => (
                        <div key={label} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                          <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-medium">{label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Results View */
              <div className="space-y-6 animate-fade-in">
                {/* Score Hero */}
                <Card className={`shadow-sm border-2 bg-gradient-to-br ${gradeBg}`}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto">
                          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-white/50" strokeWidth="10" />
                            <circle
                              cx="60" cy="60" r="50" fill="none"
                              stroke="url(#scoreGrad)" strokeWidth="10"
                              strokeDasharray={`${2 * Math.PI * 50}`}
                              strokeDashoffset={`${2 * Math.PI * 50 * (1 - result.percentage / 100)}`}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                            <defs>
                              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="hsl(221,83%,53%)" />
                                <stop offset="100%" stopColor="hsl(262,83%,58%)" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-3xl font-extrabold ${gradeColor}`}>{result.grade}</span>
                            <span className="text-xs text-muted-foreground">{result.percentage}%</span>
                          </div>
                        </div>
                        <p className="font-bold text-2xl mt-2">{result.totalMarks} <span className="text-muted-foreground text-base font-normal">/ {result.maxMarks}</span></p>
                        <p className="text-sm text-muted-foreground">Total Score</p>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={result.similarityRisk === "low" ? "success" : result.similarityRisk === "medium" ? "warning" : "danger"}>
                            Similarity Risk: {result.similarityRisk?.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed italic">"{result.aiComment}"</p>
                        <Button variant="outline" size="sm" onClick={() => { setResult(null); setFile(null); }} className="text-xs">
                          ← Submit Another Assignment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Radar Chart */}
                  <Card className="shadow-sm border-0 bg-white/80">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        Performance Radar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                          <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                          <Tooltip formatter={(v) => [`${v}%`]} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Strengths */}
                  <Card className="shadow-sm border-0 bg-white/80">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Parameter Breakdown */}
                <Card className="shadow-sm border-0 bg-white/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Detailed Parameter Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.scores.map((item, idx) => (
                      <div key={idx} className="border border-border/50 rounded-xl overflow-hidden">
                        <button
                          className="w-full flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors text-left"
                          onClick={() => setExpandedParam(expandedParam === idx ? null : idx)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-sm">{item.parameter}</span>
                              <ScoreBadge score={item.score} max={item.maxScore} />
                              {item.status === "good" && <Badge variant="success" className="text-xs">Excellent</Badge>}
                              {item.status === "partial" && <Badge variant="warning" className="text-xs">Needs Work</Badge>}
                              {item.status === "poor" && <Badge variant="danger" className="text-xs">Poor</Badge>}
                            </div>
                            <Progress value={(item.score / item.maxScore) * 100} className="h-2" />
                          </div>
                          {expandedParam === idx ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                        </button>
                        {expandedParam === idx && (
                          <div className="px-4 pb-4 bg-muted/10 border-t border-border/50">
                            <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{item.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Improvement Suggestions */}
                <Card className="shadow-sm border-0 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      Improvement Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.improvements.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full gradient-bg text-white text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">{i + 1}</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card className="shadow-sm border-0 bg-white/80">
              <CardHeader>
                <CardTitle className="text-lg">My Submissions</CardTitle>
                <CardDescription>View your past assignment evaluations and scores.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {historySubmissions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">You haven't submitted any assignments yet.</p>
                ) : (
                  historySubmissions.map(sub => (
                    <div key={sub._id} className="border border-border/50 rounded-xl p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">Session: <span className="font-mono text-purple-700">{sub.sessionId}</span></p>
                          <p className="text-xs text-muted-foreground">{new Date(sub.evaluatedAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={sub.result?.percentage >= 75 ? "success" : sub.result?.percentage >= 50 ? "warning" : "danger"}>
                            {sub.result?.percentage || 0}%
                          </Badge>
                          <p className="text-sm font-bold mt-1 text-center">{sub.result?.totalMarks}/{sub.result?.maxMarks}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { setResult(sub.result); setActiveTab("new"); }}>
                        <Eye className="w-3 h-3 mr-2" /> View Detailed Feedback
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

