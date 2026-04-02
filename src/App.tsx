import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, BookOpen, GraduationCap, Trophy, LayoutGrid, Settings, LogOut, Search, Menu, X, User, Volume2, Target, School, ClipboardList } from 'lucide-react';
import { TopicCard } from './components/TopicCard';
import { ExerciseSession } from './components/ExerciseSession';
import { AuthScreen } from './components/AuthScreen';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentTasks } from './components/StudentTasks';
import { InteractiveCalculator } from './components/InteractiveCalculator';
import { Achievements } from './components/Achievements';
import { MATH_DATA, TopicData } from './types';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { cn } from './lib/utils';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('mathflow_auth');
    if (!saved) return false;
    
    try {
      const { lastActivity, durationMinutes } = JSON.parse(saved);
      if (durationMinutes === 0) return false; 
      if (durationMinutes === -1) return true; // Never expire
      
      const now = Date.now();
      const diffMinutes = (now - lastActivity) / (1000 * 60);
      
      if (diffMinutes > durationMinutes) {
        localStorage.removeItem('mathflow_auth');
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  });

  const [sessionDuration, setSessionDuration] = useState(() => {
    const saved = localStorage.getItem('mathflow_auth');
    if (saved) {
      try {
        return JSON.parse(saved).durationMinutes;
      } catch (e) {}
    }
    return 60; // Default 1 hour
  });

  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'courses' | 'achievements' | 'progress' | 'settings' | 'teacher_dashboard' | 'student_tasks'>('dashboard');
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(false);

  useEffect(() => {
    if (isAuthenticated && auth.currentUser) {
      setIsLoadingRole(true);
      const fetchRole = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        } finally {
          setIsLoadingRole(false);
        }
      };
      fetchRole();
    }
  }, [isAuthenticated, auth.currentUser]);

  const [userSettings, setUserSettings] = useState(() => {
    const saved = localStorage.getItem('mathflow_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { course: '', sound: true, dailyGoal: 10, profilePic: 'https://picsum.photos/seed/user1/100/100' };
  });

  const updateSetting = (key: string, value: any) => {
    const updated = { ...userSettings, [key]: value };
    setUserSettings(updated);
    localStorage.setItem('mathflow_settings', JSON.stringify(updated));
  };

  // Session management
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSession = () => {
      const saved = localStorage.getItem('mathflow_auth');
      if (!saved) {
        setIsAuthenticated(false);
        return;
      }

      const { lastActivity, durationMinutes } = JSON.parse(saved);
      if (durationMinutes === -1) return; // Never expire
      if (durationMinutes === 0) return; // Don't expire if "Solo esta sesión" (until reload)

      const now = Date.now();
      const diffMinutes = (now - lastActivity) / (1000 * 60);

      if (diffMinutes > durationMinutes) {
        handleLogout();
      }
    };

    const updateActivity = () => {
      const saved = localStorage.getItem('mathflow_auth');
      if (!saved) return;
      const data = JSON.parse(saved);
      data.lastActivity = Date.now();
      localStorage.setItem('mathflow_auth', JSON.stringify(data));
    };

    const interval = setInterval(checkSession, 30000); // Check every 30 seconds
    
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [isAuthenticated]);

  const handleLogin = (durationMinutes?: number) => {
    const finalDuration = durationMinutes ?? sessionDuration;
    const authData = {
      isAuthenticated: true,
      lastActivity: Date.now(),
      durationMinutes: finalDuration
    };
    localStorage.setItem('mathflow_auth', JSON.stringify(authData));
    setSessionDuration(finalDuration);
    setIsAuthenticated(true);
  };

  const updateSessionDuration = (minutes: number) => {
    setSessionDuration(minutes);
    const saved = localStorage.getItem('mathflow_auth');
    if (saved) {
      const data = JSON.parse(saved);
      data.durationMinutes = minutes;
      localStorage.setItem('mathflow_auth', JSON.stringify(data));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mathflow_auth');
    setIsAuthenticated(false);
    setSelectedTopic(null);
  };

  // Handle scroll lock when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  const filteredTopics = MATH_DATA.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = userSettings.course ? topic.courseLevel === userSettings.course : true;
    return matchesSearch && matchesCourse;
  });

  const LEVEL_ORDER = [
    '1º Primaria', '2º Primaria', '3º Primaria', '4º Primaria', '5º Primaria', '6º Primaria',
    '1º ESO', '2º ESO', '3º ESO', '4º ESO',
    '1º Bachillerato', '2º Bachillerato'
  ];

  const courses = Array.from(new Set(MATH_DATA.map(t => t.courseLevel)))
    .sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b));

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (isLoadingRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedTopic) {
      return (
        <motion.div
          key="session"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
        >
          <ExerciseSession 
            topic={selectedTopic} 
            onExit={() => {
              setSelectedTopic(null);
              setActiveTaskId(null);
            }} 
            taskId={activeTaskId || undefined}
          />
        </motion.div>
      );
    }

    switch (activeView) {
      case 'achievements':
        return <Achievements />;
      case 'teacher_dashboard':
        return <TeacherDashboard />;
      case 'student_tasks':
        return <StudentTasks onTopicSelect={(topic, taskId) => { setSelectedTopic(topic); setActiveTaskId(taskId); }} />;
      case 'courses':
        return (
          <motion.div
            key="courses-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {courses.map(level => (
              <section key={level}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-brand-600 rounded-full" />
                  {level}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {MATH_DATA.filter(t => t.courseLevel === level).map(topic => (
                    <TopicCard 
                      key={topic.id} 
                      topic={topic} 
                      onClick={() => setSelectedTopic(topic)} 
                    />
                  ))}
                </div>
              </section>
            ))}
          </motion.div>
        );
      case 'achievements':
        return <Achievements />;
      case 'progress':
        return (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
            <GraduationCap size={48} className="mx-auto text-brand-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900">Tu Progreso</h2>
            <p className="text-slate-500">Aquí verás tus estadísticas de aprendizaje.</p>
          </div>
        );
      case 'settings':
        return (
          <motion.div
            key="settings-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            {/* Perfil de Usuario */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <User className="text-brand-600" />
                Perfil de Usuario
              </h2>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xl overflow-hidden">
                  {userSettings.profilePic ? (
                    <img src={userSettings.profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    auth.currentUser?.displayName?.[0] || 'U'
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{auth.currentUser?.displayName || 'Usuario de MathFlow'}</p>
                  <p className="text-sm text-slate-500">{auth.currentUser?.email || 'falso0518@gmail.com'}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 ml-1">URL de la foto de perfil</label>
                  <input 
                    type="text"
                    value={userSettings.profilePic || ''}
                    onChange={(e) => updateSetting('profilePic', e.target.value)}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 transition-all outline-none text-slate-700 font-medium mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 ml-1">Curso Actual</label>
                  <p className="text-xs text-slate-500 mb-4">Selecciona tu curso para personalizar tu experiencia.</p>
                  <select 
                    value={userSettings.course}
                    onChange={(e) => updateSetting('course', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 transition-all outline-none text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="">Selecciona un curso...</option>
                    {LEVEL_ORDER.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Preferencias */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Settings className="text-brand-600" />
                Preferencias de Aprendizaje
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Volume2 size={20} /></div>
                    <div>
                      <label className="text-sm font-bold text-slate-700">Efectos de Sonido</label>
                      <p className="text-xs text-slate-500">Reproducir sonidos al acertar o fallar.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateSetting('sound', !userSettings.sound)}
                    className={cn("w-14 h-8 rounded-full transition-colors relative", userSettings.sound ? "bg-brand-500" : "bg-slate-200")}
                  >
                    <div className={cn("w-6 h-6 bg-white rounded-full absolute top-1 transition-transform", userSettings.sound ? "translate-x-7" : "translate-x-1")} />
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Target size={20} /></div>
                    <label className="text-sm font-bold text-slate-700">Meta Diaria de Ejercicios</label>
                  </div>
                  <select 
                    value={userSettings.dailyGoal}
                    onChange={(e) => updateSetting('dailyGoal', Number(e.target.value))}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 transition-all outline-none text-slate-700 font-medium cursor-pointer"
                  >
                    <option value={5}>5 ejercicios (Relajado)</option>
                    <option value={10}>10 ejercicios (Normal)</option>
                    <option value={20}>20 ejercicios (Intenso)</option>
                    <option value={50}>50 ejercicios (Maratón)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Configuración de Sesión */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <LogOut className="text-brand-600" />
                Sesión y Seguridad
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Tiempo de inactividad para cerrar sesión</label>
                  <p className="text-xs text-slate-500 mb-4">El tiempo se cuenta solo cuando no estás usando la web. Si eliges "Nunca", tu sesión permanecerá abierta indefinidamente.</p>
                  <select 
                    value={sessionDuration}
                    onChange={(e) => updateSessionDuration(Number(e.target.value))}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 transition-all outline-none text-slate-700 font-medium cursor-pointer"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                    <option value={1440}>1 día</option>
                    <option value={10080}>1 semana</option>
                    <option value={-1}>Nunca (Sesión permanente)</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all w-full justify-center"
                  >
                    <LogOut size={20} />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredTopics.map((topic) => (
              <TopicCard 
                key={topic.id} 
                topic={topic} 
                onClick={() => setSelectedTopic(topic)} 
              />
            ))}
            
            {filteredTopics.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex p-4 rounded-full bg-slate-100 text-slate-400 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No se encontraron temas</h3>
                <p className="text-slate-500">Prueba con otra palabra clave o explora las categorías.</p>
              </div>
            )}
          </motion.div>
        );
    }
  };

  const handleViewChange = (view: any) => {
    setActiveView(view);
    setSelectedTopic(null);
    setActiveTaskId(null);
    setIsSidebarOpen(false);
  };

  const getActiveViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'courses': return 'Cursos';
      case 'achievements': return 'Logros';
      case 'progress': return 'Mi Progreso';
      case 'settings': return 'Ajustes';
      case 'teacher_dashboard': return 'Panel de Profesor';
      case 'student_tasks': return 'Tareas del Cole';
      default: return activeView;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col lg:flex-row">
      {/* Sidebar - Desktop & Mobile Overlay */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <>
            {/* Mobile Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col p-6 z-50 shadow-2xl lg:shadow-none",
                "lg:translate-x-0 lg:static lg:w-64"
              )}
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-200">
                    <Calculator size={24} />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">MathFlow</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1 flex-1">
                <NavItem icon={LayoutGrid} label="Dashboard" active={activeView === 'dashboard'} onClick={() => handleViewChange('dashboard')} />
                {userRole === 'teacher' && (
                  <NavItem icon={School} label="Panel de Profesor" active={activeView === 'teacher_dashboard'} onClick={() => handleViewChange('teacher_dashboard')} />
                )}
                {userRole === 'student' && (
                  <NavItem icon={ClipboardList} label="Tareas del Cole" active={activeView === 'student_tasks'} onClick={() => handleViewChange('student_tasks')} />
                )}
                <NavItem icon={BookOpen} label="Cursos" active={activeView === 'courses'} onClick={() => handleViewChange('courses')} />
                <NavItem icon={Trophy} label="Logros" active={activeView === 'achievements'} onClick={() => handleViewChange('achievements')} />
                <NavItem icon={GraduationCap} label="Mi Progreso" active={activeView === 'progress'} onClick={() => handleViewChange('progress')} />
                <NavItem icon={Settings} label="Ajustes" active={activeView === 'settings'} onClick={() => handleViewChange('settings')} />
              </nav>

              <div className="mt-auto pt-6 border-t border-slate-100 space-y-1">
                <button 
                  onClick={() => setIsCalculatorOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group text-slate-500 hover:bg-brand-50 hover:text-brand-600 mb-2"
                >
                  <Calculator size={20} className="text-slate-400 group-hover:text-brand-600" />
                  Calculadora
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group text-slate-500 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={20} className="text-slate-400 group-hover:text-red-600" />
                  Cerrar Sesión
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-500 min-h-screen relative",
        "p-6 md:p-10 pb-32 lg:pb-10" // Added pb-32 for mobile nav clearance
      )}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm active:scale-95 transition-transform"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">MF</div>
            <span className="font-bold text-slate-900">MathFlow</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img 
              src={userSettings.profilePic || "https://picsum.photos/seed/user1/100/100"} 
              alt="Avatar" 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2 uppercase">
              {selectedTopic ? selectedTopic.title : getActiveViewTitle()}
            </h1>
            <p className="text-slate-500 font-medium">
              {selectedTopic 
                ? `Practicando: ${selectedTopic.description}` 
                : '¿Qué quieres aprender hoy? Elige un tema para comenzar.'}
            </p>
          </div>

          {!selectedTopic && activeView === 'dashboard' && (
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Buscar temas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3.5 w-full md:w-80 rounded-2xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm outline-none text-sm font-medium"
              />
            </div>
          )}
        </header>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-4 flex justify-between items-center z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <MobileNavItem icon={LayoutGrid} active={activeView === 'dashboard'} onClick={() => handleViewChange('dashboard')} />
        {userRole === 'teacher' && (
          <MobileNavItem icon={School} active={activeView === 'teacher_dashboard'} onClick={() => handleViewChange('teacher_dashboard')} />
        )}
        {userRole === 'student' && (
          <MobileNavItem icon={ClipboardList} active={activeView === 'student_tasks'} onClick={() => handleViewChange('student_tasks')} />
        )}
        <MobileNavItem icon={BookOpen} active={activeView === 'courses'} onClick={() => handleViewChange('courses')} />
        <MobileNavItem icon={Calculator} active={isCalculatorOpen} onClick={() => setIsCalculatorOpen(true)} />
        <MobileNavItem icon={Settings} active={activeView === 'settings'} onClick={() => handleViewChange('settings')} />
      </nav>

      <AnimatePresence>
        {isCalculatorOpen && (
          <InteractiveCalculator onClose={() => setIsCalculatorOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group text-left",
        active 
          ? "bg-brand-50 text-brand-600 shadow-sm" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon size={20} className={cn(
        "transition-colors",
        active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
      )} />
      {label}
    </button>
  );
}

function MobileNavItem({ icon: Icon, active = false, onClick }: { icon: any, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl transition-all",
        active ? "text-brand-600 bg-brand-50" : "text-slate-400"
      )}
    >
      <Icon size={24} />
    </button>
  );
}
