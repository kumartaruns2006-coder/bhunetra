import React, { useState } from 'react';
import { User, UserRole } from '../../types/auth';
import { authService } from '../../services/authService';
import { mockUsers } from '../../data/mockUsers';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  Building2, 
  UserCheck, 
  AlertCircle,
  Fingerprint,
  Users,
  Smartphone,
  CheckCircle2,
  MapPin,
  FileCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [authTab, setAuthTab] = useState<'OFFICER' | 'CITIZEN'>('OFFICER');
  const [officerIdOrEmail, setOfficerIdOrEmail] = useState<string>('alok.ranjan@nic.in');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('NATIONAL_ADMIN');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [captchaInput, setCaptchaInput] = useState<string>('7X9M');

  // Citizen login state
  const [citizenMobile, setCitizenMobile] = useState<string>('9830144572');
  const [citizenOtp, setCitizenOtp] = useState<string>('2026');
  const [citizenKhasra, setCitizenKhasra] = useState<string>('108/1');
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const officerUsers = mockUsers.filter(u => u.role !== 'CITIZEN');
  const citizenUsers = mockUsers.filter(u => u.role === 'CITIZEN');

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.loginWithCredentials(officerIdOrEmail, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Invalid Officer ID or Password');
      }
    } catch {
      setErrorMessage('Authentication service temporarily unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoRoleLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const user = await authService.loginWithDemoRole(role);
      onLoginSuccess(user);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoCitizenLogin = async (userId: string) => {
    setIsLoading(true);
    try {
      const user = await authService.loginWithDemoUser(userId);
      onLoginSuccess(user);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitizenOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Default to Kolkata citizen Soumitra Chatterjee (or Bihar if phone matches)
      const user = citizenMobile.includes('94310') ? citizenUsers[1] : citizenUsers[0];
      const loggedUser = await authService.loginWithDemoUser(user.id);
      onLoginSuccess(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async () => {
    setIsLoading(true);
    try {
      const user = await authService.loginWithSSO('JAN_PARICHAY');
      onLoginSuccess(user);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gov-navy to-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Top National Identity Bar */}
      <header className="bg-slate-950/80 backdrop-blur border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-medium tracking-wide text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            GOVERNMENT OF INDIA &bull; MINISTRY OF ROAD TRANSPORT & HIGHWAYS
          </div>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-amber-400 font-semibold">Smart India Hackathon 2026 Prototype</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Lock size={12} className="text-emerald-400" />
            <span>NIC Secure Access Portal (v2.6)</span>
          </div>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="flex-1 flex items-center justify-center p-6 my-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Branding, Title, Tagline & National Scope */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-2">
            <div className="space-y-4">
              {/* BhuNetra Logo */}
              <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-2xl flex items-center justify-center border-2 border-amber-400/60">
                <img src="/logo.png" alt="BhuNetra Logo" className="w-full h-full object-contain" />
              </div>

              {/* Headings */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest mb-2">
                  <Sparkles size={12} /> PM GatiShakti &bull; SIH 2026
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  BhuNetra
                </h1>
                <h2 className="text-sm sm:text-base font-semibold text-slate-300 mt-1">
                  AI + GIS Powered National Land Acquisition Intelligence
                </h2>
                <p className="text-xs sm:text-sm font-bold tracking-wider text-amber-400 mt-2 uppercase">
                  Real-Time Land Insights. Better Decisions.
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                End-to-end digital monitoring, statutory stage progression (3A to 3E under the NH Act 1956 & RFCTLARR Act 2013), and parcel digital twins for national infrastructure corridors.
              </p>
            </div>

            {/* Architecture Highlights */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" />
                Enterprise Security & Access Control
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  9 Comprehensive Administrative Officer Roles
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Jurisdiction-scoped data filtering (National, State, District, Project, Field)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Ready for Jan Parichay (MeriPehchan) National SSO
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Login Cockpit */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Top Auth Mode Tabs */}
            <div className="border-b border-slate-200 bg-slate-50/70 p-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuthTab('OFFICER')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  authTab === 'OFFICER'
                    ? 'bg-gov-navy text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Building2 size={16} />
                <span>Officer Authentication</span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
                  9 ROLES
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAuthTab('CITIZEN')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  authTab === 'CITIZEN'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Users size={16} />
                <span>Citizen Landowner Portal</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                  PUBLIC
                </span>
              </button>
            </div>

            {authTab === 'OFFICER' ? (
              <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Officer Authentication Portal</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Authorized Government Personnel Only &bull; NIC Secured Access
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    NIC Verified
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                    <AlertCircle size={15} className="text-red-600 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Standard Login Form */}
                <form onSubmit={handleStandardLogin} className="space-y-4">
                  <Input
                    label="Officer ID / Official Email"
                    type="text"
                    value={officerIdOrEmail}
                    onChange={(e) => setOfficerIdOrEmail(e.target.value)}
                    placeholder="e.g. alok.ranjan@nic.in or GOI-IAS-1998-042"
                    leftIcon={<Mail size={15} />}
                    required
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your security passphrase"
                    leftIcon={<KeyRound size={15} />}
                    required
                  />

                  {/* Synthetic Captcha */}
                  <div className="flex items-center gap-3">
                    <div className="w-1/2">
                      <Input
                        label="Security Verification (Captcha)"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Enter 4-character code"
                        required
                      />
                    </div>
                    <div className="w-1/2 pt-5">
                      <div className="bg-slate-100 border border-slate-300 rounded-lg py-2 px-4 text-center font-mono font-bold tracking-widest text-slate-700 text-sm select-none shadow-inner">
                        7 X 9 M
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Button
                      type="submit"
                      variant="gov-navy"
                      size="md"
                      isLoading={isLoading}
                      className="w-full sm:w-auto px-6 py-2.5 font-bold"
                    >
                      Login to Platform
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={handleSSOLogin}
                      leftIcon={<Fingerprint size={15} className="text-blue-700" />}
                      className="w-full sm:w-auto text-xs"
                    >
                      Login via Jan Parichay (MeriPehchan SSO)
                    </Button>
                  </div>
                </form>

                {/* Divider: Demo Mode Quick Roles */}
                <div className="relative pt-2">
                  <div className="absolute inset-0 flex items-center pt-2">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase pt-2">
                    <span className="bg-white px-3 text-slate-500 font-bold text-[11px] tracking-wider">
                      Or Instant One-Click Demo Mode (9 Official Roles)
                    </span>
                  </div>
                </div>

                {/* 9 Demo Role Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {officerUsers.map((u, idx) => {
                    const isSelected = selectedDemoRole === u.role;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setSelectedDemoRole(u.role);
                          setOfficerIdOrEmail(u.email);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-gov-navy bg-blue-50/70 shadow-sm ring-2 ring-gov-navy/20'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                          <span>Role #{idx + 1}</span>
                          <span className="px-1.5 py-0.2 rounded bg-white text-slate-700 font-semibold border border-slate-200">
                            {u.scope}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                          {u.roleTitle}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                          {u.name}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate mt-0.5">
                          {u.allowedModules.length} Modules Allowed
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Fast Direct Enter with Selected Demo Role */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Launch Active Persona: {officerUsers.find(u => u.role === selectedDemoRole)?.roleTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-md">
                      {officerUsers.find(u => u.role === selectedDemoRole)?.designation}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="saffron"
                    size="md"
                    onClick={() => handleDemoRoleLogin(selectedDemoRole)}
                    rightIcon={<ChevronRight size={14} />}
                  >
                    Enter as {officerUsers.find(u => u.role === selectedDemoRole)?.roleTitle.split(' ')[0]}
                  </Button>
                </div>
              </div>
            ) : (
              /* CITIZEN LANDOWNER PORTAL LOGIN */
              <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-emerald-950">
                        Citizen Landowner Tracking Gateway
                      </h3>
                      <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                        Track land acquisition status, compensation award calculations (100% Solatium & 12% Interest), rehabilitation entitlements, gazette notifications, and schedule field hearings with complete transparency under RFCTLARR Act 2013 & NH Act 1956.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Demo Citizen Personas */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    Instant Demo Landowner Personas
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* West Bengal Kolkata Citizen */}
                    <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-white hover:border-emerald-600 transition-all shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            West Bengal &bull; Primary Demo
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Plot 108/1
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Shri Soumitra Chatterjee
                        </h4>
                        <div className="text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin size={12} className="text-slate-400" />
                            <span>Mouza Rajarhat, North 24 Parganas</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Corridor: <span className="font-semibold text-slate-700">Kolkata Elevated Corridor</span>
                          </div>
                          <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            Section 3G Hearing Scheduled &bull; Pending Award
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100">
                        <Button
                          type="button"
                          variant="gov-navy"
                          size="sm"
                          className="w-full bg-emerald-700 hover:bg-emerald-800 font-bold text-xs"
                          onClick={() => handleDemoCitizenLogin('usr-cit-wb-01')}
                          rightIcon={<ChevronRight size={14} />}
                        >
                          Access Soumitra's Portal (WB)
                        </Button>
                      </div>
                    </div>

                    {/* Bihar Patna Citizen */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Bihar Demo Corridor
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Plot 125/2
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Shri Mukesh Narayan Singh
                        </h4>
                        <div className="text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin size={12} className="text-slate-400" />
                            <span>Village Danapur, Patna</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Corridor: <span className="font-semibold text-slate-700">Patna Ring Road Phase-1</span>
                          </div>
                          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            Award Disbursed: ₹48.50 Lakhs (PFMS)
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full border-slate-300 hover:bg-slate-50 font-bold text-xs"
                          onClick={() => handleDemoCitizenLogin('usr-cit-br-01')}
                          rightIcon={<ChevronRight size={14} />}
                        >
                          Access Mukesh's Portal (BR)
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OTP Simulator */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Smartphone size={14} className="text-blue-600" />
                    Direct Mobile / Aadhaar OTP Verification
                  </div>

                  <form onSubmit={handleCitizenOtpLogin} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Registered Mobile Number"
                        type="text"
                        value={citizenMobile}
                        onChange={(e) => setCitizenMobile(e.target.value)}
                        placeholder="10-digit mobile number"
                        required
                      />
                      <Input
                        label="Khasra / Plot Number"
                        type="text"
                        value={citizenKhasra}
                        onChange={(e) => setCitizenKhasra(e.target.value)}
                        placeholder="e.g. 108/1 or 125/2"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          label="Enter 4-Digit OTP"
                          type="text"
                          value={citizenOtp}
                          onChange={(e) => setCitizenOtp(e.target.value)}
                          placeholder="Default Demo OTP: 2026"
                          required
                        />
                      </div>
                      <div className="pt-6">
                        <Button
                          type="submit"
                          variant="gov-navy"
                          size="md"
                          className="bg-emerald-700 hover:bg-emerald-800 px-6 font-bold"
                          isLoading={isLoading}
                        >
                          Verify & Access Records
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Confidentiality Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 text-center flex flex-wrap items-center justify-center gap-4">
              <span>National Informatics Centre (NIC) Security Compliance</span>
              <span>&bull;</span>
              <span>Confidential Official GovTech System</span>
              <span>&bull;</span>
              <span className="text-slate-600 font-mono">Build 2026.09-SIH</span>
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 px-6 py-3 text-center text-xs text-slate-400">
        BhuNetra &bull; Smart India Hackathon 2026 Prototype &bull; Designed for Ministry of Road Transport & Highways and NHAI
      </footer>
    </div>
  );
};
