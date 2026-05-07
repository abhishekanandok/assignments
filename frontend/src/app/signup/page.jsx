"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, GraduationCap, Shield, BookOpen } from "lucide-react";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { login } = useAuth();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await authAPI.signup(formData);
            if (res.data.success) {
                toast({
                    title: "Account Created!",
                    description: "Welcome to AIEval.",
                    variant: "default",
                });
                login(res.data.user, res.data.token);
            }
        } catch (err) {
            toast({
                title: "Signup Failed",
                description: err.response?.data?.message || "An error occurred during signup. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-32">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[380px] bg-white border border-slate-200/60 rounded-3xl shadow-xl overflow-hidden relative z-10 mx-4"
            >
                <div className="p-6 sm:p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                            <BookOpen className="text-white w-6 h-6" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1.5">
                            Create Account
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Join the AIEval platform</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-3">

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                    className={`py-2 px-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${formData.role === 'student'
                                        ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
                                        : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                >
                                    <GraduationCap className={`w-5 h-5 ${formData.role === 'student' ? 'text-primary' : 'text-slate-400'}`} />
                                    <span className="text-[13px] font-bold">Student</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                    className={`py-2 px-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${formData.role === 'teacher'
                                        ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
                                        : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                >
                                    <Shield className={`w-5 h-5 ${formData.role === 'teacher' ? 'text-primary' : 'text-slate-400'}`} />
                                    <span className="text-[13px] font-bold">Faculty</span>
                                </button>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-slate-700 ml-1 text-xs">Full Name</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-slate-700 ml-1 text-xs">Email Address</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm"
                                        placeholder="name@university.edu"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-slate-700 ml-1 text-xs">Password</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 rounded-lg text-sm font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-[0_4px_14px_rgba(249,115,22,0.25)] transition-all flex items-center justify-center gap-2 group mt-2 text-white"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm font-medium text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-bold hover:text-accent transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            </motion.div>
        </div>
    );
}
