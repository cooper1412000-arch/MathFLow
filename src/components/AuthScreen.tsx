import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Mail, Lock, User, ArrowRight, Chrome, School, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { signInWithGoogle, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthScreenProps {
  onLogin: () => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'auth' | 'role_selection'>('auth');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [authUser, setAuthUser] = useState<any>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        onLogin();
      } else {
        // New user, need to select role
        setAuthUser(user);
        setStep('role_selection');
      }
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !authUser) return;
    if (selectedRole === 'teacher' && !schoolName.trim()) return;

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', authUser.uid);
      await setDoc(userDocRef, {
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName || 'Usuario',
        role: selectedRole,
        ...(selectedRole === 'teacher' ? { schoolName: schoolName.trim() } : {}),
        createdAt: serverTimestamp()
      });
      onLogin();
    } catch (error) {
      console.error("Error creating user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call for email/password (not fully implemented with Firebase Auth here)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[1100px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Branding/Info */}
        <div className="w-full md:w-1/2 bg-brand-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white">
                <Calculator size={28} />
              </div>
              <span className="text-2xl font-bold tracking-tight">MathFlow</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Domina las matemáticas con <span className="text-brand-200">precisión.</span>
            </h1>
            <p className="text-brand-100 text-lg leading-relaxed max-w-md">
              Únete a miles de estudiantes y profesores que mejoran sus habilidades cada día con nuestra plataforma adaptativa.
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`} 
                  className="w-10 h-10 rounded-full border-2 border-brand-600"
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-brand-600 bg-brand-400 flex items-center justify-center text-xs font-bold">
                +2k
              </div>
            </div>
            <p className="text-sm font-medium text-brand-200 uppercase tracking-widest">Usuarios activos hoy</p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-500 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-20 -left-20 w-60 h-60 bg-brand-700 rounded-full blur-3xl opacity-50" />
        </div>

        {/* Right Side - Forms */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
          <AnimatePresence mode="wait">
            {step === 'auth' ? (
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                  </h2>
                  <p className="text-slate-500">
                    {isLogin 
                      ? 'Ingresa tus credenciales para continuar aprendiendo.' 
                      : 'Comienza tu viaje matemático hoy mismo.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Nombre completo</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                        <input 
                          required
                          type="text" 
                          placeholder="Tu nombre"
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Correo electrónico</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                      <input 
                        required
                        type="email" 
                        placeholder="ejemplo@correo.com"
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-bold text-slate-700">Contraseña</label>
                      {isLogin && (
                        <button type="button" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                      <input 
                        required
                        type="password" 
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                    <span className="bg-white px-4 text-slate-400">O continúa con</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all font-medium text-slate-700 disabled:opacity-70"
                  >
                    <Chrome size={20} />
                    Google
                  </button>
                </div>

                <p className="mt-10 text-center text-slate-500 font-medium">
                  {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-brand-600 font-bold hover:underline"
                  >
                    {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="role_selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Completa tu perfil
                  </h2>
                  <p className="text-slate-500">
                    ¿Cómo vas a usar MathFlow?
                  </p>
                </div>

                <form onSubmit={handleRoleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={cn(
                        "p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                        selectedRole === 'student' 
                          ? "border-brand-600 bg-brand-50 text-brand-700" 
                          : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                      )}
                    >
                      <GraduationCap size={32} />
                      <span className="font-bold">Soy Alumno</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('teacher')}
                      className={cn(
                        "p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                        selectedRole === 'teacher' 
                          ? "border-brand-600 bg-brand-50 text-brand-700" 
                          : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                      )}
                    >
                      <School size={32} />
                      <span className="font-bold">Soy Profesor</span>
                    </button>
                  </div>

                  {selectedRole === 'teacher' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-bold text-slate-700 ml-1">¿En qué escuela enseñas?</label>
                      <div className="relative group">
                        <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                        <input 
                          required
                          type="text" 
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="Nombre de tu colegio o instituto"
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                        />
                      </div>
                      <p className="text-xs text-slate-500 ml-1 mt-2">
                        Esto nos ayuda a verificar tu cuenta como profesor para que puedas crear clases y enviar tareas.
                      </p>
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading || !selectedRole || (selectedRole === 'teacher' && !schoolName.trim())}
                    className="w-full py-4 rounded-2xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Comenzar
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

