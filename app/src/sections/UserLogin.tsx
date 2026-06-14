import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/hooks/useStore';
import { Atom, User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, ArrowRight, Sparkles, BookOpen, Trophy, Zap } from 'lucide-react';
import gsap from 'gsap';

export default function UserLogin() {
  const { state, loginUser, registerUser } = useStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (heroRef.current) {
      tl.fromTo(heroRef.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 });
    }
    if (cardRef.current) {
      tl.fromTo(cardRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.3');
    }
    if (featuresRef.current) {
      tl.fromTo(featuresRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.3');
    }
  }, []);

  const handleLogin = () => {
    setError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Ingresa tu correo y contraseña');
      return;
    }
    const success = loginUser(loginEmail.trim(), loginPassword);
    if (!success) {
      setError('Correo o contraseña incorrectos');
    }
  };

  const handleRegister = () => {
    setError('');
    setSuccess('');
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (regPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Check if email already exists
    const emailExists = Object.values(state.usersData).some(
      (u) => u.user.email === regEmail.trim()
    );
    if (emailExists) {
      setError('Este correo ya está registrado');
      return;
    }

    const userId = regName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!userId) {
      setError('Nombre no válido');
      return;
    }

    registerUser(userId, regName.trim(), regEmail.trim(), regPassword);
    setSuccess('Cuenta creada correctamente');
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setIsLoginMode(true);
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const features = [
    { icon: BookOpen, label: '15 Módulos', desc: 'Desde JS hasta arquitectura' },
    { icon: Trophy, label: 'Evaluaciones', desc: 'Valida tu aprendizaje' },
    { icon: Zap, label: 'Interactivo', desc: 'Código y ejercicios' },
    { icon: Sparkles, label: 'IA', desc: 'Genera cursos personalizados' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-dots pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Hero */}
        <div ref={heroRef} className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/25 animate-float">
            <Atom size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            React Native <span className="text-gradient">Academy</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-3 text-base leading-relaxed">
            Aprende desarrollo móvil desde cero hasta nivel avanzado.<br />
            Tu camino hacia apps profesionales comienza aquí.
          </p>
        </div>

        {/* Features strip */}
        <div ref={featuresRef} className="grid grid-cols-4 gap-2 mb-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="text-center p-2.5 rounded-xl bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/50">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-1.5">
                  <Icon size={14} className="text-indigo-500" />
                </div>
                <p className="text-[10px] font-semibold text-stone-700 dark:text-stone-300 leading-tight">{f.label}</p>
                <p className="text-[9px] text-stone-400 dark:text-stone-500 mt-0.5 leading-tight">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Login Card */}
        <div ref={cardRef} className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 shadow-xl shadow-stone-900/5 dark:shadow-stone-900/30">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLoginMode ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
              {isLoginMode
                ? <LogIn size={18} className="text-indigo-600 dark:text-indigo-400" />
                : <UserPlus size={18} className="text-purple-600 dark:text-purple-400" />
              }
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-xs text-stone-400 dark:text-stone-500">
                {isLoginMode ? 'Ingresa tus credenciales' : 'Regístrate para comenzar'}
              </p>
            </div>
          </div>

          {/* Error/Success */}
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-xs text-green-600 dark:text-green-400">
              {success}
            </div>
          )}

          {/* Login Form */}
          {isLoginMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all cursor-pointer shadow-md shadow-indigo-500/20 mt-2"
              >
                <ArrowRight size={16} />
                Ingresar
              </button>
            </div>
          ) : (
            /* Register Form */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">Nombre completo</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleRegister}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all cursor-pointer shadow-md shadow-indigo-500/20 mt-2"
              >
                <UserPlus size={16} />
                Crear Cuenta
              </button>
            </div>
          )}

          {/* Switch mode */}
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-700 text-center">
            <p className="text-xs text-stone-400 dark:text-stone-500">
              {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={switchMode}
                className="ml-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {isLoginMode ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-6">
          Plataforma educativa de React Native · 15 módulos · +80 lecciones
        </p>
      </div>
    </div>
  );
}
