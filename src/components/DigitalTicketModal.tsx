import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Calendar, MapPin, Clock, Award, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PharmacistConfirmation, EventSettings } from '../types';
import { CRFALLogo } from './CRFALLogo';

interface DigitalTicketModalProps {
  confirmation: PharmacistConfirmation | null;
  settings: EventSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalTicketModal = ({
  confirmation,
  settings,
  isOpen,
  onClose,
}: DigitalTicketModalProps) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !confirmation) return null;

  const formattedDate = new Date(settings.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleShare = () => {
    const text = `Confirmação de Presença na Solenidade de Entrega das Carteiras do CRF/AL!\n\nProfissional: ${confirmation.fullName}\nLocal: ${settings.venueName}\nData: ${formattedDate} às ${settings.time}\nCódigo de Acesso: ${confirmation.qrCodeToken}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 p-2 text-gold-200 bg-leather-900 border border-gold-500/40 rounded-full hover:bg-leather-800 transition shadow-lg"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Bar Above Ticket */}
        <div className="flex items-center justify-between mb-3 px-2 no-print">
          <div className="flex items-center gap-2 text-gold-300 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Passe Solene Confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1.5 border border-emerald-400/40 transition shadow"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-gold-500 hover:bg-gold-400 text-leather-950 rounded-lg flex items-center gap-1.5 border border-gold-300 transition shadow font-serif"
            >
              <Download className="w-3.5 h-3.5" />
              Imprimir / Salvar
            </button>
          </div>
        </div>

        {/* Printable Pass Container */}
        <div
          ref={ticketRef}
          className="relative rounded-2xl overflow-hidden border-2 border-gold-500/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.25)]"
          style={{
            background: 'linear-gradient(160deg, #2D180F 0%, #1B0E07 50%, #120804 100%)',
          }}
        >
          {/* Top Gold Trim Header */}
          <div className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 p-1 text-center">
            <p className="text-[10px] tracking-[0.3em] font-serif font-black uppercase text-leather-950">
              PASSE SOLENE OFICIAL DE ACESSO • CERIMÔNIA DE OUTORGA
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Header: Logo and Edition */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gold-500/30 pb-5 gap-4">
              <CRFALLogo variant="dourado" size="md" showSubtitle={false} />
              <div className="text-center sm:text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/40 text-[10px] font-semibold text-gold-300 uppercase tracking-widest mb-1">
                  {settings.edition}
                </span>
                <p className="text-xs text-gold-200/80 font-serif">
                  Entrega de Carteira Profissional
                </p>
              </div>
            </div>

            {/* Pharmacist Main Badge Information */}
            <div className="my-6 p-4 rounded-xl bg-leather-900/80 border border-gold-500/30 relative">
              <div className="absolute -top-3 left-4 px-2 bg-leather-800 border border-gold-500/40 rounded text-[9px] uppercase tracking-wider text-gold-300 font-serif">
                Farmacêutico(a) Outorgado(a)
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-gold-400">
                    {confirmation.fullName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gold-200/90 font-mono">
                    <span>CPF: {confirmation.cpf}</span>
                    {confirmation.registrationNumber && (
                      <span className="text-gold-400">Inscrição: {confirmation.registrationNumber}</span>
                    )}
                  </div>
                  {confirmation.collegeOrCourse && (
                    <p className="text-xs text-gold-300/70 mt-1 font-sans">
                      Formação: {confirmation.collegeOrCourse}
                    </p>
                  )}
                </div>

                {/* Status Stamp */}
                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{confirmation.checkedIn ? 'Check-in Realizado' : 'Presença Confirmada'}</span>
                </div>
              </div>

              {/* Companions Badge */}
              <div className="mt-3 pt-3 border-t border-gold-500/20 flex flex-wrap items-center justify-between text-xs gap-2">
                <span className="text-gold-300/80">
                  Acompanhantes autorizados: <strong className="text-gold-200 font-semibold">{confirmation.companionsCount}</strong> {confirmation.companionsCount === 1 ? 'pessoa' : 'pessoas'}
                </span>
                {confirmation.companionNames && confirmation.companionNames.length > 0 && (
                  <span className="text-[11px] text-gold-400/80 italic truncate max-w-xs">
                    ({confirmation.companionNames.join(', ')})
                  </span>
                )}
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-6">
              <div className="p-3 rounded-lg bg-leather-950/60 border border-gold-500/20 flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gold-400/80 font-medium">Data da Solenidade</p>
                  <p className="text-gold-100 font-semibold capitalize">{formattedDate}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-leather-950/60 border border-gold-500/20 flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gold-400/80 font-medium">Horário da Cerimônia</p>
                  <p className="text-gold-100 font-semibold">{settings.time} (Recepção às {settings.doorsOpenTime})</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-leather-950/60 border border-gold-500/20 flex items-start gap-3 sm:col-span-2">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gold-400/80 font-medium">Local do Evento</p>
                  <p className="text-gold-100 font-semibold">{settings.venueName}</p>
                  <p className="text-gold-300/70 text-[11px]">{settings.venueAddress} • {settings.cityState}</p>
                </div>
              </div>
            </div>

            {/* Check-in QR Code Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-gradient-to-r from-leather-950 via-leather-900 to-leather-950 border border-gold-500/30 gap-4">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-serif font-bold uppercase mb-1">
                  <Award className="w-4 h-4 text-gold-400" />
                  Validação de Acesso na Recepção
                </div>
                <p className="text-xs text-gold-200/80 max-w-xs">
                  Apresente este QR Code na entrada do auditório para retirada imediata da credencial e assinatura da ata.
                </p>
                <p className="text-[11px] font-mono text-gold-400 mt-2 tracking-wider">
                  TOKEN: {confirmation.qrCodeToken}
                </p>
              </div>

              {/* QR Code Graphic */}
              <div className="p-3 rounded-xl bg-white shadow-[0_0_20px_rgba(212,175,55,0.4)] border-2 border-gold-500/60 shrink-0">
                <QRCodeSVG
                  value={confirmation.qrCodeToken}
                  size={110}
                  bgColor="#ffffff"
                  fgColor="#1C0E07"
                  level="H"
                />
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-4 pt-3 border-t border-gold-500/20 text-center text-[10px] text-gold-400/60 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-gold-400" />
              <span>Traje Solene Obrigatório: {settings.dressCode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
