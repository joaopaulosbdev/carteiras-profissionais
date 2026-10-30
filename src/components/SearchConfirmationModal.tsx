import React, { useState } from 'react';
import { Search, X, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';
import { findConfirmationByCpfOrEmail } from '../services/storage';
import type { PharmacistConfirmation } from '../types';

interface SearchConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (confirmation: PharmacistConfirmation) => void;
}

export const SearchConfirmationModal = ({
  isOpen,
  onClose,
  onSelect,
}: SearchConfirmationModalProps) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<PharmacistConfirmation | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!query.trim()) {
      setError('Digite seu CPF ou E-mail cadastrado.');
      return;
    }

    const found = findConfirmationByCpfOrEmail(query);
    if (!found) {
      setError('Nenhuma confirmação encontrada com este CPF ou E-mail. Por favor, verifique os dados ou preencha o formulário de confirmação.');
      return;
    }

    setResult(found);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md leather-panel p-6 sm:p-7 rounded-2xl gold-border-glow shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gold-300/70 hover:text-gold-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-gold-100">
              Consultar Confirmação
            </h3>
            <p className="text-xs text-gold-300/70">
              Acesse seu passe solene com seu CPF ou e-mail.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-3">
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite seu CPF ou E-mail"
              className="w-full px-4 py-2.5 rounded-xl bg-leather-950/90 border border-gold-500/30 text-gold-100 placeholder-gold-400/30 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-leather-950 font-serif font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            Buscar Minha Credencial
          </button>
        </form>

        {result && (
          <div className="mt-5 p-4 rounded-xl bg-leather-950/90 border border-gold-500/40 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmação Localizada!</span>
            </div>

            <p className="font-serif font-bold text-gold-100 text-sm">{result.fullName}</p>
            <p className="text-xs text-gold-300/80 font-mono mt-0.5">CPF: {result.cpf}</p>
            <p className="text-xs text-gold-400/80 mt-1">
              {result.companionsCount} {result.companionsCount === 1 ? 'Acompanhante' : 'Acompanhantes'} • Token: {result.qrCodeToken}
            </p>

            <button
              onClick={() => {
                onSelect(result);
                onClose();
              }}
              className="mt-3 w-full py-2 rounded-lg bg-leather-800 hover:bg-leather-700 border border-gold-500/50 text-gold-200 font-serif text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Ticket className="w-4 h-4 text-gold-400" />
              Abrir Meu Passe Solene & QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
