import { useState, useEffect } from 'react';
import type { PharmacistConfirmation, EventSettings } from './types';
import { getStoredConfirmations, getStoredSettings } from './services/storage';
import { PublicEventSite } from './components/PublicEventSite';
import { AdminDashboard } from './components/AdminDashboard';
import { DigitalTicketModal } from './components/DigitalTicketModal';

export function App() {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [confirmations, setConfirmations] = useState<PharmacistConfirmation[]>([]);
  const [settings, setSettings] = useState<EventSettings>(getStoredSettings());
  const [selectedTicket, setSelectedTicket] = useState<PharmacistConfirmation | null>(null);

  const loadData = () => {
    setConfirmations(getStoredConfirmations());
    setSettings(getStoredSettings());
  };

  useEffect(() => {
    loadData();

    // Check if URL has ?admin=true
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setView('admin');
    }
  }, []);

  const handleConfirmationSuccess = (newConfirmation: PharmacistConfirmation) => {
    loadData();
    setSelectedTicket(newConfirmation);
  };

  return (
    <div className="min-h-screen bg-leather-950 font-sans">
      {view === 'public' ? (
        <PublicEventSite
          settings={settings}
          onConfirmationSuccess={handleConfirmationSuccess}
          onOpenAdmin={() => setView('admin')}
          onOpenTicket={(conf) => setSelectedTicket(conf)}
        />
      ) : (
        <AdminDashboard
          confirmations={confirmations}
          settings={settings}
          onRefresh={loadData}
          onViewTicket={(conf) => setSelectedTicket(conf)}
          onBackToPublicSite={() => setView('public')}
        />
      )}

      {/* Digital Ticket Modal with QR Code */}
      <DigitalTicketModal
        confirmation={selectedTicket}
        settings={settings}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}

export default App;
