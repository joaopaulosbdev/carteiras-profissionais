import { useState } from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  Download,
  Printer,
  Search,
  CheckCircle,
  QrCode,
  Settings,
  ChevronRight,
  RefreshCw,
  Trash2,
  Eye,
  ExternalLink,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import type { PharmacistConfirmation, EventSettings } from '../types';
import {
  exportToCSV,
  toggleCheckInStatus,
  deleteConfirmation,
  saveSettings,
  resetToInitialMock,
} from '../services/storage';
import { CRFALLogo } from './CRFALLogo';

interface AdminDashboardProps {
  confirmations: PharmacistConfirmation[];
  settings: EventSettings;
  onRefresh: () => void;
  onViewTicket: (conf: PharmacistConfirmation) => void;
  onBackToPublicSite: () => void;
}

export const AdminDashboard = ({
  confirmations,
  settings,
  onRefresh,
  onViewTicket,
  onBackToPublicSite,
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'reception' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked-in' | 'pending'>('all');
  const [quickCheckInInput, setQuickCheckInInput] = useState('');
  const [receptionMessage, setReceptionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editable settings state
  const [editableSettings, setEditableSettings] = useState<EventSettings>({ ...settings });
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  // Calculations
  const totalPharmacists = confirmations.length;
  const totalCompanions = confirmations.reduce((acc, c) => acc + c.companionsCount, 0);
  const totalAudience = totalPharmacists + totalCompanions;
  const checkedInCount = confirmations.filter((c) => c.checkedIn).length;
  const checkedInPercentage = totalPharmacists > 0 ? Math.round((checkedInCount / totalPharmacists) * 100) : 0;
  const capacityPercentage = Math.round((totalAudience / settings.totalCapacity) * 100);

  // Filtered List
  const filteredConfirmations = confirmations.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.fullName.toLowerCase().includes(q) ||
      item.cpf.includes(q) ||
      item.email.toLowerCase().includes(q) ||
      (item.registrationNumber && item.registrationNumber.toLowerCase().includes(q)) ||
      item.qrCodeToken.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === 'checked-in') return item.checkedIn;
    if (statusFilter === 'pending') return !item.checkedIn;
    return true;
  });

  const handleToggleCheckIn = (id: string, currentStatus: boolean) => {
    toggleCheckInStatus(id, !currentStatus);
    onRefresh();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover a confirmação de "${name}"?`)) {
      deleteConfirmation(id);
      onRefresh();
    }
  };

  const handleQuickReceptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReceptionMessage(null);

    const val = quickCheckInInput.trim().toLowerCase();
    if (!val) return;

    const digits = val.replace(/\D/g, '');
    const found = confirmations.find((c) => {
      const cDigits = c.cpf.replace(/\D/g, '');
      if (digits.length >= 8 && cDigits.includes(digits)) return true;
      if (c.qrCodeToken.toLowerCase() === val) return true;
      if (c.email.toLowerCase() === val) return true;
      return false;
    });

    if (!found) {
      setReceptionMessage({
        type: 'error',
        text: 'Profissional não localizado na lista de confirmados. Verifique o CPF ou código.',
      });
      return;
    }

    toggleCheckInStatus(found.id, true);
    onRefresh();
    setQuickCheckInInput('');
    setReceptionMessage({
      type: 'success',
      text: `Presença de ${found.fullName} confirmada na recepção! (${found.companionsCount} acompanhantes)`,
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(editableSettings);
    onRefresh();
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  const handlePrintOfficialSheet = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-leather-950 text-gold-50">
      {/* Printable Sheet (visible only during window.print()) */}
      <div className="hidden print-only p-8 bg-white text-black font-sans">
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-xl font-bold uppercase tracking-wider">
            CONSELHO REGIONAL DE FARMÁCIA DO ESTADO DE ALAGOAS - CRF/AL
          </h1>
          <h2 className="text-base font-semibold uppercase mt-1">
            {settings.title} • {settings.edition}
          </h2>
          <p className="text-xs text-gray-700 mt-1">
            Data: {settings.date} às {settings.time} | Local: {settings.venueName}
          </p>
          <p className="text-xs font-bold text-gray-900 mt-1">
            LISTA OFICIAL DE CHAMADA E ENTREGA DAS CARTEIRAS PROFISSIONAIS
          </p>
        </div>

        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-200 border border-black">
              <th className="border border-black p-2 text-left w-10">Nº</th>
              <th className="border border-black p-2 text-left">Nome Completo do Farmacêutico</th>
              <th className="border border-black p-2 text-left w-32">CPF</th>
              <th className="border border-black p-2 text-left w-24">Nº Registro</th>
              <th className="border border-black p-2 text-center w-16">Acomp.</th>
              <th className="border border-black p-2 text-center w-20">Presença</th>
              <th className="border border-black p-2 text-center w-48">Assinatura de Recebimento</th>
            </tr>
          </thead>
          <tbody>
            {confirmations
              .sort((a, b) => a.fullName.localeCompare(b.fullName))
              .map((c, idx) => (
                <tr key={c.id} className="border border-black">
                  <td className="border border-black p-2 text-center">{idx + 1}</td>
                  <td className="border border-black p-2 font-semibold">{c.fullName}</td>
                  <td className="border border-black p-2 font-mono">{c.cpf}</td>
                  <td className="border border-black p-2 font-mono">{c.registrationNumber || '-'}</td>
                  <td className="border border-black p-2 text-center">{c.companionsCount}</td>
                  <td className="border border-black p-2 text-center">{c.checkedIn ? '[X] SIM' : '[ ] NÃO'}</td>
                  <td className="border border-black p-2"></td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="mt-8 pt-8 flex justify-around text-center text-xs">
          <div>
            <div className="w-56 border-t border-black mb-1"></div>
            <p className="font-semibold">Comissão de Solenidades CRF/AL</p>
          </div>
          <div>
            <div className="w-56 border-t border-black mb-1"></div>
            <p className="font-semibold">Diretoria Executiva CRF/AL</p>
          </div>
        </div>
      </div>

      {/* Main Admin UI (no-print) */}
      <div className="no-print">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-leather-900/90 border-b border-gold-500/25 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CRFALLogo variant="marrom-dourado" size="sm" showSubtitle={false} />
            <div className="border-l border-gold-500/30 pl-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gold-400 block">
                Painel Administrativo
              </span>
              <h1 className="font-serif font-bold text-sm sm:text-base text-gold-100 leading-tight">
                Gestão da Solenidade de Carteiras
              </h1>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCSV(confirmations)}
              className="px-3 py-1.5 rounded-lg bg-leather-800 hover:bg-leather-700 border border-gold-500/30 text-gold-200 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Exportar planilha Excel/CSV"
            >
              <Download className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>

            <button
              onClick={handlePrintOfficialSheet}
              className="px-3 py-1.5 rounded-lg bg-leather-800 hover:bg-leather-700 border border-gold-500/30 text-gold-200 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Imprimir folha de chamada com assinaturas"
            >
              <Printer className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Lista de Chamada</span>
            </button>

            <button
              onClick={onBackToPublicSite}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-leather-950 font-serif text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Site Público</span>
            </button>
          </div>
        </header>

        {/* Sub-navigation tabs */}
        <div className="border-b border-gold-500/15 bg-leather-950/60 px-4 sm:px-6">
          <div className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'overview'
                  ? 'border-gold-500 text-gold-300'
                  : 'border-transparent text-gold-400/60 hover:text-gold-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'list'
                  ? 'border-gold-500 text-gold-300'
                  : 'border-transparent text-gold-400/60 hover:text-gold-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Lista de Confirmados ({confirmations.length})
            </button>
            <button
              onClick={() => setActiveTab('reception')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'reception'
                  ? 'border-gold-500 text-gold-300'
                  : 'border-transparent text-gold-400/60 hover:text-gold-200'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Recepção & Check-in
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'settings'
                  ? 'border-gold-500 text-gold-300'
                  : 'border-transparent text-gold-400/60 hover:text-gold-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          </div>
        </div>

        {/* Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Event Summary Bar */}
              <div className="p-4 rounded-xl bg-leather-900 border border-gold-500/25 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-gold-100 text-sm sm:text-base">
                      {settings.title}
                    </h2>
                    <p className="text-xs text-gold-300/70">
                      {settings.date} às {settings.time} (Abertura dos portões: {settings.doorsOpenTime}) • {settings.venueName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    Inscrições Abertas
                  </span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Confirmados */}
                <div className="p-5 rounded-2xl leather-panel border border-gold-500/30">
                  <div className="flex items-center justify-between text-gold-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider font-serif">Farmacêuticos</span>
                    <Users className="w-5 h-5 text-gold-400" />
                  </div>
                  <div className="text-3xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-100 to-gold-400">
                    {totalPharmacists}
                  </div>
                  <p className="text-xs text-gold-300/70 mt-1">
                    Profissionais que garantiram a carteira
                  </p>
                </div>

                {/* Total Acompanhantes */}
                <div className="p-5 rounded-2xl leather-panel border border-gold-500/30">
                  <div className="flex items-center justify-between text-gold-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider font-serif">Acompanhantes</span>
                    <Users className="w-5 h-5 text-gold-400" />
                  </div>
                  <div className="text-3xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-100 to-gold-400">
                    {totalCompanions}
                  </div>
                  <p className="text-xs text-gold-300/70 mt-1">
                    Média de {(totalPharmacists > 0 ? (totalCompanions / totalPharmacists).toFixed(1) : 0)} por formando
                  </p>
                </div>

                {/* Lotação do Auditório */}
                <div className="p-5 rounded-2xl leather-panel border border-gold-500/30">
                  <div className="flex items-center justify-between text-gold-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider font-serif">Público Total Previsto</span>
                    <span className="text-xs font-mono text-gold-300">{capacityPercentage}%</span>
                  </div>
                  <div className="text-3xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-100 to-gold-400">
                    {totalAudience} / {settings.totalCapacity}
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-leather-950 h-2 rounded-full overflow-hidden mt-2 border border-gold-500/20">
                    <div
                      className={`h-full transition-all duration-500 ${
                        capacityPercentage > 90
                          ? 'bg-red-500'
                          : capacityPercentage > 75
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-gold-500 to-gold-300'
                      }`}
                      style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gold-300/70 mt-1">
                    {settings.totalCapacity - totalAudience} assentos disponíveis
                  </p>
                </div>

                {/* Check-ins na Recepção */}
                <div className="p-5 rounded-2xl leather-panel border border-gold-500/30">
                  <div className="flex items-center justify-between text-gold-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider font-serif">Check-in no Dia</span>
                    <span className="text-xs font-mono text-emerald-400">{checkedInPercentage}%</span>
                  </div>
                  <div className="text-3xl font-black font-serif text-emerald-400">
                    {checkedInCount} / {totalPharmacists}
                  </div>
                  <p className="text-xs text-gold-300/70 mt-1">
                    {totalPharmacists - checkedInCount} aguardando chegada
                  </p>
                </div>
              </div>

              {/* Quick Table of Recent Confirmations */}
              <div className="p-6 rounded-2xl leather-panel border border-gold-500/25">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-gold-100 text-base">
                      Últimas Confirmações Registradas
                    </h3>
                    <p className="text-xs text-gold-300/70">
                      Profissionais que responderam ao convite recentemente
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('list')}
                    className="text-xs text-gold-400 hover:text-gold-200 flex items-center gap-1 font-semibold"
                  >
                    Ver todos ({confirmations.length})
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-gold-500/20 text-gold-400 uppercase tracking-wider font-serif text-[11px]">
                        <th className="py-2.5 px-3">Profissional</th>
                        <th className="py-2.5 px-3">CPF</th>
                        <th className="py-2.5 px-3">WhatsApp</th>
                        <th className="py-2.5 px-3 text-center">Acomp.</th>
                        <th className="py-2.5 px-3 text-center">Presença</th>
                        <th className="py-2.5 px-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {confirmations.slice(0, 5).map((conf) => (
                        <tr key={conf.id} className="hover:bg-leather-900/60 transition">
                          <td className="py-3 px-3 font-semibold text-gold-100">
                            <div>{conf.fullName}</div>
                            {conf.registrationNumber && (
                              <span className="text-[10px] text-gold-400/80 font-mono">
                                Reg. {conf.registrationNumber}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono text-gold-300">{conf.cpf}</td>
                          <td className="py-3 px-3 font-mono text-gold-300">{conf.phone}</td>
                          <td className="py-3 px-3 text-center text-gold-200 font-semibold">
                            {conf.companionsCount}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                conf.checkedIn
                                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                                  : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                              }`}
                            >
                              {conf.checkedIn ? 'Presente' : 'Confirmado'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1">
                            <button
                              onClick={() => onViewTicket(conf)}
                              className="p-1.5 rounded-lg bg-leather-800 hover:bg-leather-700 border border-gold-500/30 text-gold-300"
                              title="Ver Passe Solene"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleCheckIn(conf.id, conf.checkedIn)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold ${
                                conf.checkedIn
                                  ? 'bg-emerald-900/60 border-emerald-500/50 text-emerald-300'
                                  : 'bg-leather-800 border-gold-500/30 text-gold-300'
                              }`}
                              title={conf.checkedIn ? 'Desmarcar presença' : 'Confirmar presença agora'}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL LIST WITH SEARCH & FILTERS */}
          {activeTab === 'list' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Search & Filter Bar */}
              <div className="p-4 rounded-xl leather-panel border border-gold-500/25 flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[260px]">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gold-400/50 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome, CPF, e-mail ou protocolo..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-leather-950 border border-gold-500/30 text-gold-100 placeholder-gold-400/40 text-xs focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg overflow-hidden border border-gold-500/30">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 text-xs font-semibold ${
                        statusFilter === 'all'
                          ? 'bg-gold-500 text-leather-950'
                          : 'bg-leather-900 text-gold-300 hover:bg-leather-800'
                      }`}
                    >
                      Todos ({confirmations.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('checked-in')}
                      className={`px-3 py-1.5 text-xs font-semibold ${
                        statusFilter === 'checked-in'
                          ? 'bg-gold-500 text-leather-950'
                          : 'bg-leather-900 text-gold-300 hover:bg-leather-800'
                      }`}
                    >
                      Presentes ({checkedInCount})
                    </button>
                    <button
                      onClick={() => setStatusFilter('pending')}
                      className={`px-3 py-1.5 text-xs font-semibold ${
                        statusFilter === 'pending'
                          ? 'bg-gold-500 text-leather-950'
                          : 'bg-leather-900 text-gold-300 hover:bg-leather-800'
                      }`}
                    >
                      Pendentes ({totalPharmacists - checkedInCount})
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="rounded-2xl leather-panel border border-gold-500/30 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-leather-900/90 text-gold-300 uppercase tracking-wider font-serif text-[11px] border-b border-gold-500/30">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Farmacêutico(a)</th>
                        <th className="py-3 px-4">CPF / Inscrição</th>
                        <th className="py-3 px-4">Contato</th>
                        <th className="py-3 px-4 text-center">Acompanhantes</th>
                        <th className="py-3 px-4 text-center">Presença no Dia</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {filteredConfirmations.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gold-400/60 font-sans">
                            Nenhum registro encontrado para os filtros selecionados.
                          </td>
                        </tr>
                      ) : (
                        filteredConfirmations.map((conf, index) => (
                          <tr key={conf.id} className="hover:bg-leather-900/50 transition">
                            <td className="py-3 px-4 text-gold-400/60 font-mono">{index + 1}</td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-gold-100 text-sm font-serif">{conf.fullName}</p>
                              {conf.collegeOrCourse && (
                                <p className="text-[11px] text-gold-400/70">{conf.collegeOrCourse}</p>
                              )}
                              {conf.specialNeeds && (
                                <p className="text-[10px] text-amber-400 italic mt-0.5">
                                  Obs: {conf.specialNeeds}
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-gold-300">
                              <div>{conf.cpf}</div>
                              {conf.registrationNumber && (
                                <span className="text-[10px] text-gold-400/80">Reg. {conf.registrationNumber}</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-gold-200">{conf.email}</p>
                              <p className="text-gold-400 font-mono text-[11px]">{conf.phone}</p>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-bold text-gold-100">{conf.companionsCount}</span>
                              {conf.companionNames && conf.companionNames.length > 0 && (
                                <p className="text-[10px] text-gold-400/70 truncate max-w-[150px] mx-auto">
                                  {conf.companionNames.join(', ')}
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleToggleCheckIn(conf.id, conf.checkedIn)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
                                  conf.checkedIn
                                    ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300 hover:bg-red-950/60 hover:text-red-300 hover:border-red-500/50'
                                    : 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-emerald-950 hover:text-emerald-300'
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>{conf.checkedIn ? 'Presente' : 'Aguardando'}</span>
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => onViewTicket(conf)}
                                className="p-1.5 rounded-lg bg-leather-800 hover:bg-leather-700 border border-gold-500/30 text-gold-300 transition"
                                title="Visualizar Passe Solene e QR Code"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(conf.id, conf.fullName)}
                                className="p-1.5 rounded-lg bg-leather-800 hover:bg-red-950 border border-gold-500/30 text-gold-400 hover:text-red-400 transition"
                                title="Excluir confirmação"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RECEPTION & CHECK-IN SCANNER */}
          {activeTab === 'reception' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl leather-panel border border-gold-500/30 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-gold-500/20 pb-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-gold-100 text-base sm:text-lg">
                      Recepção no Dia da Solenidade
                    </h3>
                    <p className="text-xs text-gold-300/70">
                      Valide o QR Code ou digite o CPF do profissional para registrar a presença imediata.
                    </p>
                  </div>
                </div>

                {receptionMessage && (
                  <div
                    className={`mb-5 p-4 rounded-xl text-xs flex items-start gap-3 border ${
                      receptionMessage.type === 'success'
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                        : 'bg-red-950/80 border-red-500/60 text-red-200'
                    }`}
                  >
                    {receptionMessage.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold text-sm">
                        {receptionMessage.type === 'success' ? 'Check-in Realizado!' : 'Atenção'}
                      </p>
                      <p className="mt-0.5">{receptionMessage.text}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleQuickReceptionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gold-200 uppercase tracking-wider mb-2 font-serif">
                      Código QR / Token ou CPF do Farmacêutico
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        autoFocus
                        value={quickCheckInInput}
                        onChange={(e) => setQuickCheckInInput(e.target.value)}
                        placeholder="Ex: CRFAL-2026-MSC-8942 ou 084.721..."
                        className="w-full px-4 py-3 rounded-xl bg-leather-950 border-2 border-gold-500/40 text-gold-100 placeholder-gold-400/40 text-sm font-mono focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-leather-950 font-serif font-bold text-sm uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-leather-950" />
                    Confirmar Presença na Entrada
                  </button>
                </form>

                {/* Quick stats in reception */}
                <div className="mt-6 pt-5 border-t border-gold-500/20 grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-leather-950/60 border border-gold-500/20">
                    <p className="text-2xl font-bold font-serif text-emerald-400">{checkedInCount}</p>
                    <p className="text-[11px] text-gold-300/70 uppercase">Presentes no Auditório</p>
                  </div>
                  <div className="p-3 rounded-xl bg-leather-950/60 border border-gold-500/20">
                    <p className="text-2xl font-bold font-serif text-amber-400">{totalPharmacists - checkedInCount}</p>
                    <p className="text-[11px] text-gold-300/70 uppercase">Aguardando Chegada</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl leather-panel border border-gold-500/30">
                <div className="flex items-center justify-between border-b border-gold-500/20 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-gold-100 text-base sm:text-lg">
                        Configurações da Solenidade
                      </h3>
                      <p className="text-xs text-gold-300/70">
                        Edite os dados da cerimônia, datas, capacidade e regras de acompanhantes.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Deseja restaurar os dados de exemplo da demonstração?')) {
                        resetToInitialMock();
                        onRefresh();
                      }
                    }}
                    className="text-xs text-gold-400 hover:text-gold-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-500/30 bg-leather-900"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Restaurar Mock Inicial
                  </button>
                </div>

                {settingsSavedNotice && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Configurações atualizadas com sucesso!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                      Título Oficial do Evento
                    </label>
                    <input
                      type="text"
                      value={editableSettings.title}
                      onChange={(e) => setEditableSettings({ ...editableSettings, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                        Edição / Turma
                      </label>
                      <input
                        type="text"
                        value={editableSettings.edition}
                        onChange={(e) => setEditableSettings({ ...editableSettings, edition: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                        Traje Solene Exigido
                      </label>
                      <input
                        type="text"
                        value={editableSettings.dressCode}
                        onChange={(e) => setEditableSettings({ ...editableSettings, dressCode: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                        Data (AAAA-MM-DD)
                      </label>
                      <input
                        type="date"
                        value={editableSettings.date}
                        onChange={(e) => setEditableSettings({ ...editableSettings, date: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                        Horário da Solenidade
                      </label>
                      <input
                        type="time"
                        value={editableSettings.time}
                        onChange={(e) => setEditableSettings({ ...editableSettings, time: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                        Abertura dos Portões
                      </label>
                      <input
                        type="time"
                        value={editableSettings.doorsOpenTime}
                        onChange={(e) => setEditableSettings({ ...editableSettings, doorsOpenTime: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                        Nome do Local / Auditório
                      </label>
                      <input
                        type="text"
                        value={editableSettings.venueName}
                        onChange={(e) => setEditableSettings({ ...editableSettings, venueName: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                        Endereço Completo
                      </label>
                      <input
                        type="text"
                        value={editableSettings.venueAddress}
                        onChange={(e) => setEditableSettings({ ...editableSettings, venueAddress: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                        Capacidade Máxima do Auditório
                      </label>
                      <input
                        type="number"
                        value={editableSettings.totalCapacity}
                        onChange={(e) => setEditableSettings({ ...editableSettings, totalCapacity: Number(e.target.value) })}
                        className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gold-200 uppercase mb-1 font-serif">
                        Limite de Acompanhantes por Formando
                      </label>
                      <input
                        type="number"
                        value={editableSettings.maxCompanionsPerPharmacist}
                        onChange={(e) => setEditableSettings({ ...editableSettings, maxCompanionsPerPharmacist: Number(e.target.value) })}
                        className="w-full px-4 py-2 rounded-xl bg-leather-950 border border-gold-500/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-leather-950 font-serif font-bold text-xs uppercase tracking-wider transition shadow-md"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
