import React from 'react';
import { Share2, MessageCircle, Copy, Check, Sparkles, Building2 } from 'lucide-react';

export function ShareCardModal({ politico, onClose }) {
  const [copiado, setCopiado] = React.useState(false);

  const shareText = `🏛️ *Prestação de Contas Oficial - ${politico.name} (${politico.party})*\n` +
    `📌 Cargo: ${politico.role}\n` +
    `💰 Total em Emendas: ${politico.emendas}\n` +
    `🏗️ Obras Vinculadas: ${politico.obras}\n\n` +
    `Confira o extrato completo e os projetos no Portal Conecta+RN:\n` +
    `${window.location.origin}`;

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content share-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="share-modal-header">
          <div className="share-badge-top">
            Extrato Auditado
          </div>
          <h2>Boletim de Prestação de Contas</h2>
          <p>Exportação de dados consolidados para veiculação informativa e prestação de contas.</p>
        </div>

        {/* Pré-visualização do Card no estilo panfleto digital / WhatsApp Status */}
        <div className="share-preview-card">
          <div className="share-card-banner">
            <span className="banner-tag">Transparência em Ação</span>
            <span className="banner-logo">Conecta+RN</span>
          </div>

          <div className="share-card-body">
            <div className="share-card-avatar">
              <img src={politico.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(politico.name)}&background=002776&color=fff&size=128`} alt={politico.name} />
            </div>

            <div className="share-card-info">
              <h3>{politico.name}</h3>
              <p className="share-card-sub">{politico.role} • <strong>{politico.party}</strong></p>
            </div>

            <div className="share-card-stats-grid">
              <div className="stat-pill-green">
                <span>EMENDAS DESTINADAS</span>
                <strong>{politico.emendas}</strong>
              </div>
              <div className="stat-pill-blue">
                <span>OBRAS EM ANDAMENTO</span>
                <strong>{politico.obras} Obras</strong>
              </div>
            </div>

            <p className="share-card-disclaimer">
              Fiscalize os recursos públicos e acompanhe a aplicação das verbas no portal oficial.
            </p>
          </div>
        </div>

        <div className="share-actions-buttons">
          <button className="btn-share-zap" onClick={handleShareWhatsApp}>
            <MessageCircle size={18} /> Disparar no WhatsApp
          </button>
          <button className="btn-copy-text" onClick={handleCopy}>
            {copiado ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Texto</>}
          </button>
        </div>
      </div>
    </div>
  );
}
