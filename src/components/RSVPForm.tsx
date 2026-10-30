import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserCheck, Mail, Users, Sparkles, AlertCircle } from 'lucide-react';
import type { EventSettings, PharmacistConfirmation } from '../types';
import { formatCPF, formatPhone, saveConfirmation } from '../services/storage';

interface RSVPFormProps {
  settings: EventSettings;
  onSuccess: (confirmation: PharmacistConfirmation) => void;
  onNameChange?: (name: string) => void;
}

export const RSVPForm = ({
  settings,
  onSuccess,
  onNameChange,
}: RSVPFormProps) => {
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [collegeOrCourse, setCollegeOrCourse] = useState('');
  const [companionsCount, setCompanionsCount] = useState<number>(1);
  const [companion1, setCompanion1] = useState('');
  const [companion2, setCompanion2] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFullName(val);
    if (onNameChange) {
      onNameChange(val);
    }
  };

  const handleCpfInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setErrorMessage('Por favor, informe seu nome completo (nome e sobrenome).');
      return;
    }

    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setErrorMessage('Por favor, informe um CPF válido com 11 dígitos.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Por favor, informe um número de WhatsApp válido com DDD.');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('É necessário concordar com os protocolos da solenidade para confirmar.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const companionsList: string[] = [];
      if (companionsCount >= 1 && companion1.trim()) companionsList.push(companion1.trim());
      if (companionsCount >= 2 && companion2.trim()) companionsList.push(companion2.trim());

      const saved = saveConfirmation({
        fullName: fullName.trim(),
        cpf: formatCPF(cpf),
        email: email.trim().toLowerCase(),
        phone: formatPhone(phone),
        registrationNumber: registrationNumber.trim() ? registrationNumber.trim().toUpperCase() : undefined,
        collegeOrCourse: collegeOrCourse.trim() || undefined,
        companionsCount,
        companionNames: companionsList,
        specialNeeds: specialNeeds.trim() || undefined,
      });

      // Fire celebratory confetti in gold and chocolate tones
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF3C4', '#AA7A1E', '#3D2214', '#F5D77F'],
      });

      setIsSubmitting(false);
      onSuccess(saved);
    }, 600);
  };

  return (
    <div className="relative rounded-2xl leather-panel p-6 sm:p-8 gold-border-glow shadow-2xl">
      <div className="flex items-center gap-3 border-b border-gold-500/25 pb-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/30 to-leather-800 border border-gold-500/40 flex items-center justify-center text-gold-400">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-100">
            Confirmação de Presença
          </h3>
          <p className="text-xs text-gold-300/70">
            Preencha seus dados para garantir a confecção e outorga solene da sua carteira.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome Completo */}
        <div>
          <label className="block text-xs font-semibold text-gold-200 uppercase tracking-wider mb-1.5 font-serif">
            Nome Completo do(a) Farmacêutico(a) *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={fullName}
              onChange={handleNameInput}
              placeholder="Ex: Dra. Mariana Silveira Cavalcante"
              className="w-full pl-4 pr-4 py-2.5 rounded-xl bg-leather-950/80 border border-gold-500/30 text-gold-100 placeholder-gold-400/30 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition"
            />
          </div>
        </div>

        {/* CPF e WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gold-200 uppercase tracking-wider mb-1.5 font-serif">
              CPF *
            </label>
            <input
              type="text"
              required
              value={cpf}
              onChange={handleCpfInput}
              maxLength={14}
              placeholder="000.000.000-00"
              className="w-full px-4 py-2.5 rounded-xl bg-leather-950/80 border border-gold-500/30 text-gold-100 placeholder-gold-400/30 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 font-mono transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-200 uppercase tracking-wider mb-1.5 font-serif">
              WhatsApp / Celular com DDD *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={phone}
                onChange={handlePhoneInput}
                maxLength={15}
                placeholder="(82) 99999-9999"
                className="w-full px-4 py-2.5 rounded-xl bg-leather-950/80 border border-gold-500/30 text-gold-100 placeholder-gold-400/30 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 font-mono transition"
              />
            </div>
          </div>
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-xs font-semibold text-gold-200 uppercase tracking-wider mb-1.5 font-serif">
            E-mail para Recebimento do Passe *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-leather-950/80 border border-gold-500/30 text-gold-100 placeholder-gold-400/30 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition"
            />
            <Mail className="absolute right-3.5 top-3 w-4 h-4 text-gold-400/50 pointer-events-none" />
          </div>
        </div>

        {/* Inscrição e Instituição de Ensino */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gold-200 uppercase tracking-wider mb-1.5 font-serif flex items-center justify-between">
              <span>Nº Registro / Protocolo</span>
              <span className="text-[10px] text-gold-400/60 font-sans lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="Ex: 6890/AL ou PROT-2026"
                className="w-full px-4 py-2.5 rounded-xl bg-leather-950/80 border border-gold-500/30 text-gold-100 placeholder-gold-400/30 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 uppercase font-mono transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-200 uppercase tracking-wider mb-1.5 font-serif flex items-center justify-between">
              <span>Instituição Formadora</span>
              <span className="text-[10px] text-gold-400/60 font-sans lowercase">(opcional)</span>
            </label>
            <input
              type="text"
              value={collegeOrCourse}
              onChange={(e) => setCollegeOrCourse(e.target.value)}
              placeholder="Ex: UFAL, CESMAC, UNIT..."
              className="w-full px-4 py-2.5 rounded-xl bg-leather-950/80 border border-gold-500/30 text-gold-100 placeholder-gold-400/30 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition"
            />
          </div>
        </div>

        {/* Acompanhantes */}
        <div className="p-3.5 rounded-xl bg-leather-950/60 border border-gold-500/20">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider font-serif flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gold-400" />
              Acompanhantes Solenes
            </label>
            <span className="text-[11px] text-gold-400/80 font-medium">
              Máx: {settings.maxCompanionsPerPharmacist} por formando
            </span>
          </div>

          <div className="flex gap-3 mb-3">
            {[0, 1, 2].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCompanionsCount(num)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  companionsCount === num
                    ? 'bg-gold-500 text-leather-950 border-gold-400 shadow-md font-serif'
                    : 'bg-leather-900 text-gold-200/80 border-gold-500/25 hover:border-gold-500/50'
                }`}
              >
                {num === 0 ? 'Sem acompanhante' : `${num} ${num === 1 ? 'acompanhante' : 'acompanhantes'}`}
              </button>
            ))}
          </div>

          {companionsCount >= 1 && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={companion1}
                onChange={(e) => setCompanion1(e.target.value)}
                placeholder="Nome completo do 1º acompanhante"
                className="w-full px-3 py-1.5 rounded-lg bg-leather-900 border border-gold-500/30 text-gold-100 placeholder-gold-400/30 text-xs focus:outline-none focus:border-gold-400"
              />
              {companionsCount >= 2 && (
                <input
                  type="text"
                  value={companion2}
                  onChange={(e) => setCompanion2(e.target.value)}
                  placeholder="Nome completo do 2º acompanhante"
                  className="w-full px-3 py-1.5 rounded-lg bg-leather-900 border border-gold-500/30 text-gold-100 placeholder-gold-400/30 text-xs focus:outline-none focus:border-gold-400"
                />
              )}
            </div>
          )}
        </div>

        {/* Acessibilidade */}
        <div>
          <label className="block text-xs font-medium text-gold-300/80 mb-1">
            Necessidade Especial ou Acessibilidade (opcional)
          </label>
          <input
            type="text"
            value={specialNeeds}
            onChange={(e) => setSpecialNeeds(e.target.value)}
            placeholder="Ex: Usuário de cadeira de rodas, gestante, assento térreo..."
            className="w-full px-3.5 py-2 rounded-xl bg-leather-950/60 border border-gold-500/25 text-gold-100 placeholder-gold-400/30 text-xs focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Termo e Juramento */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 text-xs text-gold-300/90 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gold-500/50 text-gold-500 focus:ring-0 bg-leather-950 accent-gold-500"
            />
            <span>
              Declaro estar ciente de que deverei comparecer com traje solene ({settings.dressCode}) e documento oficial com foto para o juramento e outorga da carteira.
            </span>
          </label>
        </div>

        {/* Botão de Envio com Efeito Ouro */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-serif font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.5)] active:scale-[0.99] disabled:opacity-50 text-leather-950 bg-gradient-to-r from-[#FFF6D6] via-[#D4AF37] to-[#B88A22] border border-gold-300 flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-leather-950 border-t-transparent rounded-full animate-spin" />
                Registrando Confirmação...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-leather-950 group-hover:rotate-12 transition-transform" />
                <span>Confirmar Minha Presença na Solenidade</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
