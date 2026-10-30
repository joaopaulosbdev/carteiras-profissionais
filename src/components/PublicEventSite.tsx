import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Search,
  Users,
  Award,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import type { EventSettings, PharmacistConfirmation } from '../types';
import { CRFALLogo } from './CRFALLogo';
import { CarteiraMockup } from './CarteiraMockup';
import { RSVPForm } from './RSVPForm';
import { SearchConfirmationModal } from './SearchConfirmationModal';

interface PublicEventSiteProps {
  settings: EventSettings;
  onConfirmationSuccess: (conf: PharmacistConfirmation) => void;
  onOpenAdmin: () => void;
  onOpenTicket: (conf: PharmacistConfirmation) => void;
}

export const PublicEventSite = ({
  settings,
  onConfirmationSuccess,
  onOpenAdmin,
  onOpenTicket,
}: PublicEventSiteProps) => {
  const [typedName, setTypedName] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [logoVariant, setLogoVariant] = useState<'marrom-dourado' | 'dourado'>('marrom-dourado');

  const formattedDate = new Date(settings.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const scrollToRSVP = () => {
    document.getElementById('confirmar-presenca')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-leather-950 text-gold-50 selection:bg-gold-500 selection:text-leather-950">
      {/* Top Banner & Header */}
      <header className="sticky top-0 z-40 bg-leather-950/85 backdrop-blur-md border-b border-gold-500/20 px-4 sm:px-8 py-3.5 transition">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo in Marrom & Ouro da Carteira */}
          <div className="flex items-center gap-3">
            <CRFALLogo variant={logoVariant} size="md" showSubtitle={true} />
          </div>

          {/* Navigation & Action */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Seletor de Tonalidade da Logo (Geometria 100% Original) */}
            <div className="hidden lg:flex items-center bg-leather-900 border border-gold-500/30 rounded-full p-0.5 text-[10px]">
              <button
                onClick={() => setLogoVariant('marrom-dourado')}
                className={`px-2.5 py-1 rounded-full transition ${
                  logoVariant === 'marrom-dourado'
                    ? 'bg-gold-500 text-leather-950 font-bold'
                    : 'text-gold-300 hover:text-gold-100'
                }`}
                title="Logo anexada nas cores Marrom e Dourado"
              >
                Logo Marrom & Dourado
              </button>
              <button
                onClick={() => setLogoVariant('dourado')}
                className={`px-2.5 py-1 rounded-full transition ${
                  logoVariant === 'dourado'
                    ? 'bg-gold-500 text-leather-950 font-bold'
                    : 'text-gold-300 hover:text-gold-100'
                }`}
                title="Logo anexada em Ouro Foil da Carteira"
              >
                Logo Ouro Foil
              </button>
            </div>

            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="px-3 sm:px-4 py-2 rounded-xl bg-leather-900 hover:bg-leather-800 border border-gold-500/30 text-gold-200 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Search className="w-3.5 h-3.5 text-gold-400" />
              <span>Já Confirmei</span>
            </button>

            <button
              onClick={scrollToRSVP}
              className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-leather-950 font-serif text-xs font-bold uppercase tracking-wider transition shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
            >
              Confirmar Presença
            </button>

            {/* Admin entry point */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-xl text-gold-400/60 hover:text-gold-300 hover:bg-leather-900 border border-transparent hover:border-gold-500/30 transition"
              title="Acesso Administrativo (Dashboard)"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden">
        {/* Subtle decorative gold light glow in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-b from-gold-500/15 via-gold-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Solene Headline & Details */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-serif tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>{settings.edition}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight leading-[1.15] text-gold-50">
                Solenidade de Outorga e Entrega das{' '}
                <span className="gold-text-shimmer">
                  Carteiras Profissionais
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gold-200/80 max-w-2xl leading-relaxed">
                O <strong>Conselho Regional de Farmácia de Alagoas (CRF/AL)</strong> tem a honra de convidar os novos farmacêuticos e farmacêuticas para o ato solene de juramento e outorga da sua identidade profissional definitiva.
              </p>

              {/* Key Highlights Cards (Data, Local, Horário) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-leather-900/80 border border-gold-500/25 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-gold-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[11px] font-serif uppercase tracking-wider font-semibold">Data</span>
                  </div>
                  <p className="text-xs font-bold text-gold-100 capitalize">{formattedDate}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-leather-900/80 border border-gold-500/25 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-gold-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-[11px] font-serif uppercase tracking-wider font-semibold">Horário</span>
                  </div>
                  <p className="text-xs font-bold text-gold-100">{settings.time} (Portões: {settings.doorsOpenTime})</p>
                </div>

                <div className="p-3.5 rounded-xl bg-leather-900/80 border border-gold-500/25 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-gold-400 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[11px] font-serif uppercase tracking-wider font-semibold">Local</span>
                  </div>
                  <p className="text-xs font-bold text-gold-100 truncate">{settings.venueName}</p>
                </div>
              </div>

              {/* CTA Action Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <button
                  onClick={scrollToRSVP}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-serif font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_35px_rgba(212,175,55,0.6)] text-leather-950 bg-gradient-to-r from-[#FFF6D6] via-[#D4AF37] to-[#B88A22] border border-gold-300 flex items-center justify-center gap-2"
                >
                  <span>Confirmar Minha Presença</span>
                  <ArrowRight className="w-4 h-4 text-leather-950" />
                </button>

                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-leather-900/90 hover:bg-leather-800 border border-gold-500/30 text-gold-200 text-xs font-serif font-semibold tracking-wider uppercase transition flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-gold-400" />
                  <span>Consultar Meu Passe Solene</span>
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-gold-400/70 pt-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Passe digital com QR Code instantâneo
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold-400" />
                  Até 2 acompanhantes
                </span>
              </div>
            </div>

            {/* Right Column: Physical Carteira Profissional 3D Mockup */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="text-center mb-3">
                <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase">
                  Identidade Visual Solene • Marrom & Dourado
                </span>
              </div>
              <CarteiraMockup pharmacistName={typedName} />
              <p className="text-[11px] text-gold-400/60 font-serif italic mt-4 text-center max-w-xs">
                {typedName ? (
                  <>Personalizada para <strong className="text-gold-200">{typedName}</strong></>
                ) : (
                  'Digite seu nome no formulário abaixo para visualizar sua carteira'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Form & Confirmation Section */}
      <section id="confirmar-presenca" className="py-12 sm:py-20 relative bg-leather-900/50 border-t border-b border-gold-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-serif uppercase tracking-widest">
              Credenciamento Oficial
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-gold-100">
              Confirme sua Participação na Solenidade
            </h2>
            <p className="text-xs sm:text-sm text-gold-300/80 max-w-xl mx-auto">
              A confirmação antecipada é indispensável para a preparação nominativa do documento físico da sua carteira e assentos dos seus acompanhantes.
            </p>
          </div>

          <RSVPForm
            settings={settings}
            onSuccess={onConfirmationSuccess}
            onNameChange={setTypedName}
          />
        </div>
      </section>

      {/* Ceremony Protocol & Solemn Oath */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Solemn Oath Box */}
        <div className="relative rounded-2xl p-8 sm:p-12 leather-panel gold-border-glow shadow-2xl text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center mx-auto text-gold-400">
            <Award className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] tracking-[0.3em] uppercase font-mono text-gold-400">
              Compromisso com a Vida e a Saúde
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-gold-400">
              O Juramento do Farmacêutico
            </h3>
          </div>

          <blockquote className="font-serif italic text-sm sm:text-base text-gold-200/90 leading-relaxed max-w-3xl mx-auto">
            &ldquo;Prometo exercer a Farmácia com honra, dignidade e dedicação, respeitando sempre a vida humana e a ética profissional. Dedicarei meus conhecimentos científicos e técnicos à promoção da saúde, alívio do sofrimento e bem-estar de toda a sociedade.&rdquo;
          </blockquote>

          <div className="inline-flex items-center gap-2 text-xs text-gold-400/80 font-serif">
            <span>Conselho Federal de Farmácia • CFF / CRF-AL</span>
          </div>
        </div>

        {/* Schedule & Information Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cronograma Solene */}
          <div className="p-6 sm:p-8 rounded-2xl bg-leather-900/80 border border-gold-500/25 space-y-5">
            <div className="flex items-center gap-3 border-b border-gold-500/20 pb-3">
              <Clock className="w-5 h-5 text-gold-400" />
              <h4 className="font-serif font-bold text-base text-gold-100">
                Cronograma da Noite Solene
              </h4>
            </div>

            <ol className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-gold-500/15 border border-gold-500/30 text-gold-300 font-mono font-bold shrink-0">
                  {settings.doorsOpenTime}
                </span>
                <div>
                  <strong className="text-gold-200 font-serif text-sm block">Recepção e Assinatura da Ata</strong>
                  <span className="text-gold-300/70">Apresentação do QR Code na recepção e conferência de documentos.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-gold-500/15 border border-gold-500/30 text-gold-300 font-mono font-bold shrink-0">
                  {settings.time}
                </span>
                <div>
                  <strong className="text-gold-200 font-serif text-sm block">Abertura Oficial</strong>
                  <span className="text-gold-300/70">Composição da mesa de honra e execução do Hino Nacional Brasileiro.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-gold-500/15 border border-gold-500/30 text-gold-300 font-mono font-bold shrink-0">
                  19:30
                </span>
                <div>
                  <strong className="text-gold-200 font-serif text-sm block">Juramento Farmacêutico</strong>
                  <span className="text-gold-300/70">Juramento solene coletivo conduzido pelo orador da turma.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-gold-500/15 border border-gold-500/30 text-gold-300 font-mono font-bold shrink-0">
                  19:45
                </span>
                <div>
                  <strong className="text-gold-200 font-serif text-sm block">Entrega das Carteiras & Foto Oficial</strong>
                  <span className="text-gold-300/70">Chamada nominal no púlpito para outorga solene da identidade profissional.</span>
                </div>
              </li>
            </ol>
          </div>

          {/* Orientações & Traje */}
          <div className="p-6 sm:p-8 rounded-2xl bg-leather-900/80 border border-gold-500/25 space-y-5">
            <div className="flex items-center gap-3 border-b border-gold-500/20 pb-3">
              <Info className="w-5 h-5 text-gold-400" />
              <h4 className="font-serif font-bold text-base text-gold-100">
                Orientações aos Participantes
              </h4>
            </div>

            <ul className="space-y-3 text-xs text-gold-200/80">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Traje Solene:</strong> {settings.dressCode}. Para garantir a padronização das fotografias institucionais.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Documento Obrigatório:</strong> Apresentar documento de identificação original com foto na recepção.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Acompanhantes:</strong> Permitido até {settings.maxCompanionsPerPharmacist} convidados para acomodação adequada no auditório.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Local:</strong> {settings.venueName} — {settings.venueAddress}, {settings.cityState}.</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-gold-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gold-400/80 gap-2">
              <span>Dúvidas com a comissão organizadora?</span>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-gold-300 hover:text-gold-100 font-semibold underline underline-offset-2"
              >
                {settings.contactEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-leather-950 border-t border-gold-500/25 py-8 text-center text-xs text-gold-400/70">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center">
            <CRFALLogo variant={logoVariant} size="sm" showSubtitle={true} />
          </div>
          <p className="text-gold-200/90 font-serif">
            CONSELHO REGIONAL DE FARMÁCIA DO ESTADO DE ALAGOAS • CRF/AL
          </p>
          <p className="text-[11px] text-gold-400/60 max-w-lg mx-auto">
            Plataforma Oficial de Confirmação e Gestão de Solenidades de Entrega de Carteiras Profissionais.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="text-gold-400 hover:text-gold-200 transition"
            >
              Consultar Confirmação
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-gold-400/80 hover:text-gold-200 transition flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Painel do CRF/AL
            </button>
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      <SearchConfirmationModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={(conf) => onOpenTicket(conf)}
      />
    </div>
  );
};
