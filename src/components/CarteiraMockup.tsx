import React from 'react';
import { Award, Sparkles, ShieldCheck } from 'lucide-react';

interface CarteiraMockupProps {
  pharmacistName?: string;
  registrationNumber?: string;
  className?: string;
  isConfirmed?: boolean;
}

export const CarteiraMockup: React.FC<CarteiraMockupProps> = ({
  pharmacistName,
  registrationNumber,
  className = '',
  isConfirmed = false,
}) => {
  return (
    <div className={`relative perspective-1000 ${className}`}>
      {/* Ambient Gold Halo */}
      <div className="absolute -inset-4 bg-gradient-to-r from-gold-600/20 via-gold-400/30 to-gold-700/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition duration-700 pointer-events-none" />

      {/* The Booklet (Carteira de Couro Marrom Nobre) */}
      <div className="relative w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] md:h-[460px] rounded-2xl p-6 sm:p-7 flex flex-col justify-between items-center text-center select-none transition-transform duration-500 hover:scale-[1.02] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.25)] border border-gold-500/40 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #381E12 0%, #25130A 40%, #170A04 100%)',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,240,180,0.25), 0 20px 45px rgba(0,0,0,0.9)',
        }}
      >
        {/* Leather texture grain simulation */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '4px 4px'
          }}
        />

        {/* Embossed Stitched Border */}
        <div className="absolute inset-3 rounded-xl border border-dashed border-gold-500/30 pointer-events-none" />
        <div className="absolute inset-4 rounded-lg border border-gold-500/20 pointer-events-none" />

        {/* Gold Foil Top Curve / Council Title */}
        <div className="relative z-10 w-full pt-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-[1px] w-6 bg-gold-400/50" />
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span className="h-[1px] w-6 bg-gold-400/50" />
          </div>
          <h3 className="font-serif tracking-widest text-[11px] sm:text-[12px] font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            CONSELHO REGIONAL DE FARMÁCIA
          </h3>
          <p className="text-[9px] tracking-[0.25em] text-gold-300/80 uppercase font-sans mt-0.5">
            ESTADO DE ALAGOAS • CRF/AL
          </p>
        </div>

        {/* Center: Brazilian Coat of Arms / Pharmacy Emblem (Gold Foil Embossed) */}
        <div className="relative z-10 my-auto flex flex-col items-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gold-400/40 flex items-center justify-center p-3 shadow-inner bg-leather-900/50">
            {/* Outer ornamental ring */}
            <div className="absolute inset-1 rounded-full border border-gold-500/25 border-dashed" />
            
            {/* Official pharmacy insignia */}
            <div className="flex flex-col items-center justify-center">
              <Award className="w-12 h-12 sm:w-14 sm:h-14 text-gold-400 drop-shadow-[0_2px_8px_rgba(212,175,55,0.6)]" />
              <ShieldCheck className="w-5 h-5 text-gold-200 -mt-2 drop-shadow" />
            </div>
          </div>
          
          <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-[9px] text-gold-300 font-medium">
            DOCUMENTO OFICIAL DA REPÚBLICA
          </div>
        </div>

        {/* Bottom Gold Embossed Text: CARTEIRA DE IDENTIDADE PROFISSIONAL */}
        <div className="relative z-10 w-full pb-2">
          <p className="font-serif text-[11px] sm:text-[12px] tracking-wider text-gold-300 uppercase font-semibold leading-tight">
            CARTEIRA DE IDENTIDADE
          </p>
          <p className="font-serif text-[10px] sm:text-[11px] tracking-widest text-gold-400/90 uppercase font-bold">
            PROFISSIONAL DE
          </p>
          <h2 className="font-serif text-base sm:text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-400 to-gold-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0.5">
            FARMACÊUTICO
          </h2>

          {/* Dynamic Personalized Name Preview */}
          {pharmacistName ? (
            <div className="mt-3 pt-2.5 border-t border-gold-500/30">
              <p className="text-[9px] text-gold-400/70 uppercase tracking-widest font-sans">
                Destinada ao Profissional
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gold-100 truncate px-2 font-serif">
                {pharmacistName}
              </p>
              {registrationNumber && (
                <p className="text-[10px] text-gold-400 font-mono mt-0.5">
                  CRF/AL nº {registrationNumber}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-3 pt-2 border-t border-gold-500/20 text-[9px] text-gold-400/60 font-sans tracking-wide">
              Edição Oficial Solenidade de Outorga
            </div>
          )}

          {isConfirmed && (
            <div className="mt-2 bg-emerald-950/80 border border-emerald-500/50 rounded-lg py-1 px-2 text-[10px] text-emerald-300 font-medium flex items-center justify-center gap-1.5 animate-bounce">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Presença Confirmada para a Solenidade
            </div>
          )}
        </div>

        {/* Lateral spine / booklet fold reflection */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
        {/* Subtle top light sheen */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />
      </div>
    </div>
  );
};
