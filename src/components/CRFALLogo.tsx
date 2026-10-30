import React from 'react';

interface CRFALLogoProps {
  className?: string;
  variant?: 'marrom-dourado' | 'dourado' | 'carteira';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const CRFALLogo: React.FC<CRFALLogoProps> = ({
  className = '',
  variant: _variant = 'dourado',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28',
  };

  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const imageSrc = `${base}assets/crfal-logo-dourado.png`;

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* 
        Logomarca original anexada pelo usuário, com formato e geometria 100% preservados,
        com coloração recalculada pixel a pixel nas tonalidades da Carteira Profissional (Marrom & Dourado).
      */}
      <div className="relative group flex items-center">
        <img
          src={imageSrc}
          alt="CRF/AL - Conselho Regional de Farmácia de Alagoas (Cores da Carteira Profissional)"
          className={`${sizeClasses[size]} w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] transition-all duration-300 group-hover:drop-shadow-[0_3px_18px_rgba(212,175,55,0.55)]`}
        />
      </div>

      {showSubtitle && (
        <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-serif text-gold-300/80 mt-1">
          Alagoas • Edição Solene
        </span>
      )}
    </div>
  );
};
