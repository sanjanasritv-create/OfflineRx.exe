import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, WifiOff, MessageSquare, MapPin, Map, Bell, ShieldCheck, CheckCircle2, User, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [workerId, setWorkerId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/dashboard');
  };

  const handleOfflineLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row animate-fade-in">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 to-blue-900 p-8 md:p-12 lg:p-16 text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-10">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">OfflineRx</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Offline AI-powered referral assistance for frontline healthcare workers.
          </h1>
          
          <div className="space-y-6 mt-12">
            <div className="flex items-start space-x-4">
              <WifiOff className="w-6 h-6 text-blue-300 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Works with limited connectivity</h3>
                <p className="text-blue-100 text-sm mt-1">Full functionality available offline, syncs automatically when online.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MessageSquare className="w-6 h-6 text-blue-300 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Natural-language referral assistance</h3>
                <p className="text-blue-100 text-sm mt-1">Describe patient needs naturally, AI suggests the right department.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-blue-300 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Nearby facility matching</h3>
                <p className="text-blue-100 text-sm mt-1">Find the closest available facilities with the required capabilities.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Map className="w-6 h-6 text-blue-300 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">End-to-end referral tracking</h3>
                <p className="text-blue-100 text-sm mt-1">Monitor patient journey from primary care to specialized facilities.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Bell className="w-6 h-6 text-blue-300 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Follow-up alerts</h3>
                <p className="text-blue-100 text-sm mt-1">Never miss a follow-up with automated offline notifications.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
          <p className="font-medium tracking-wide text-sm text-blue-100">
            RIGHT PATIENT → RIGHT FACILITY → RIGHT TIME → COMPLETED FOLLOW-UP
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col overflow-y-auto">
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in to manage your referrals</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Worker ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  placeholder="e.g. HW12345"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleOfflineLogin}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <WifiOff className="w-4 h-4 mr-2" />
                Continue in Offline Mode
              </button>
            </div>
          </form>

          {/* Comparison Section */}
          <div className="mt-12 space-y-4">
            <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Why OfflineRx?
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center text-slate-600 font-medium mb-2 text-sm">
                  <ShieldCheck className="w-4 h-4 mr-2 text-slate-400" />
                  Traditional Referral Search
                </div>
                <div className="text-xs text-slate-500 space-y-2">
                  <p>1. Worker must know department</p>
                  <p>2. Search/Filter manually</p>
                  <p>3. Find facility</p>
                </div>
              </div>
              
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <CheckCircle2 className="w-8 h-8 text-blue-200 opacity-50" />
                </div>
                <div className="flex items-center text-blue-800 font-medium mb-2 text-sm">
                  <Activity className="w-4 h-4 mr-2 text-blue-600" />
                  OfflineRx Approach
                </div>
                <div className="text-xs text-blue-700 space-y-2 relative z-10">
                  <p className="font-medium">1. Describe need naturally</p>
                  <p className="font-medium">2. AI understands & suggests</p>
                  <p className="font-medium">3. Facilities retrieved & matched</p>
                  <p className="font-medium">4. Worker decides confidently</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
