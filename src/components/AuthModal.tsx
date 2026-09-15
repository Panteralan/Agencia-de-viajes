import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Lock, Mail, User, Phone, MapPin, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterSuccess: (user: UserProfile) => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);

  // Login form
  const [loginEmail, setLoginEmail] = useState('mateo.silva@viajesmercosur.com');
  const [loginPassword, setLoginPassword] = useState('123456');

  // Register form (Req 8.3: Nombre, Documento, Teléfono, País, Email, Contraseña)
  const [regName, setRegName] = useState('');
  const [regDocType, setRegDocType] = useState('DNI');
  const [regDocNumber, setRegDocNumber] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('Argentina');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Forgot password form (Req 8.5)
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Completá email y contraseña.');
      return;
    }

    const mockLoggedUser: UserProfile = {
      id: 'usr-001',
      name: loginEmail.includes('mateo') ? 'Mateo Silva' : 'Usuario Mercosur',
      email: loginEmail,
      docType: 'DNI',
      docNumber: '38.452.190',
      phone: '+54 9 11 4982-3310',
      country: 'Argentina',
      role: 'client',
      isRegistered: true,
    };

    onLoginSuccess(mockLoggedUser);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regDocNumber || !regPhone || !regEmail || !regPassword) {
      setError('Por favor completá todos los campos requeridos para el registro.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: regName,
      email: regEmail,
      docType: regDocType,
      docNumber: regDocNumber,
      phone: regPhone,
      country: regCountry,
      role: 'client',
      isRegistered: true,
    };

    onRegisterSuccess(newUser);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
              {mode === 'login' ? 'CU-03 Iniciar Sesión' : mode === 'register' ? 'CU-02 Registrarse' : 'CU-04 Recuperar Contraseña'}
            </span>
            <h3 className="font-extrabold text-stone-900 text-base mt-1">
              {mode === 'login' && 'Acceso a tu Cuenta Mercosur'}
              {mode === 'register' && 'Crear Cuenta de Viajero'}
              {mode === 'forgot' && 'Recuperación de Contraseña'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {error}
            </div>
          )}

          {/* LOGIN (CU-03) */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-700 uppercase">Contraseña</label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); }}
                    className="text-[11px] text-sky-600 hover:underline"
                  >
                    ¿Olvidaste tu contraseña? (CU-04)
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
              >
                Ingresar a Viajes Mercosur
              </button>

              <div className="pt-3 border-t border-stone-200 text-center">
                <span className="text-stone-500">¿No tenés cuenta aún? </span>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className="text-sky-700 font-bold hover:underline"
                >
                  Registrate aquí (CU-02)
                </button>
              </div>
            </form>
          )}

          {/* REGISTER (CU-02, Req 8.1, 8.3) */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía Rossi"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Tipo Doc</label>
                  <select
                    value={regDocType}
                    onChange={(e) => setRegDocType(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="CPF">CPF (Brasil)</option>
                    <option value="CI">C.I.</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Nº Documento</label>
                  <input
                    type="text"
                    required
                    placeholder="Número"
                    value={regDocNumber}
                    onChange={(e) => setRegDocNumber(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">País Mercosur</label>
                  <select
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Argentina">Argentina</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Paraguay">Paraguay</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Teléfono</label>
                  <input
                    type="tel"
                    required
                    placeholder="+54 9 11..."
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
              >
                Crear Cuenta y Continuar
              </button>

              <div className="pt-2 text-center">
                <span className="text-stone-500">¿Ya tenés cuenta? </span>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-sky-700 font-bold hover:underline"
                >
                  Iniciá sesión aquí
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD (CU-04, Req 8.5) */}
          {mode === 'forgot' && (
            <div className="space-y-4 text-xs">
              {forgotSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">Enlace de recuperación enviado</h4>
                  <p className="text-stone-600">
                    Se envió un enlace a <strong>{forgotEmail}</strong> para redefinir tu contraseña de acceso.
                  </p>
                  <button
                    onClick={() => { setMode('login'); setForgotSent(false); }}
                    className="mt-2 text-sky-700 font-bold hover:underline"
                  >
                    Volver a Iniciar Sesión
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-3">
                  <p className="text-stone-600">
                    Ingresá el correo electrónico asociado a tu cuenta para recibir un enlace seguro de restablecimiento (Req 8.5).
                  </p>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Email registrado</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="ejemplo@viajesmercosur.com"
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Enviar Enlace de Recuperación
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-center text-stone-500 hover:text-stone-800"
                  >
                    Volver al login
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
