import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, User, Phone, MapPin, FileText, Sparkles, X } from 'lucide-react';

export function GabineteDigitalModal({ politico, onClose }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bairro, setBairro] = useState('');
  const [tipoDemanda, setTipoDemanda] = useState('Saúde / UBS');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !mensagem.trim()) {
      alert('Por favor, informe seu nome e a solicitação.');
      return;
    }

    // Texto formatado para o WhatsApp da equipe do político
    const textoMensagem = `*🚨 Demanda Popular - Gabinete Digital Conecta+RN*%0A%0A` +
      `*Parlamentar:* ${politico.name} (${politico.role})%0A` +
      `*Cidadão:* ${nome}%0A` +
      `*Telefone / WhatsApp:* ${telefone || 'Não informado'}%0A` +
      `*Bairro / Cidade:* ${bairro || 'Geral'}%0A` +
      `*Setor / Área:* ${tipoDemanda}%0A%0A` +
      `*Solicitação:*%0A${encodeURIComponent(mensagem)}%0A%0A` +
      `_Enviado via Portal de Transparência e Gabinete Online_`;

    // Número padrão de demonstração comercial (ou número configurado)
    const numeroWhatsApp = politico.whatsapp || '5584999999999';
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${textoMensagem}`;

    // Abrir o WhatsApp
    window.open(linkWhatsApp, '_blank');
    setEnviado(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content gabinete-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        
        <div className="gabinete-header">
          <div className="gabinete-icon-badge">
            <MessageSquare size={22} />
          </div>
          <div>
            <span className="badge-comercial-pro">Canal Direto de Ouvidoria</span>
            <h2>Gabinete Parlamentar • {politico.name}</h2>
            <p>Protocolo direto para envio de solicitações comunitárias, melhorias de infraestrutura e projetos de lei.</p>
          </div>
        </div>

        {enviado ? (
          <div className="gabinete-sucesso">
            <CheckCircle2 size={54} color="#16a34a" />
            <h3>Mensagem Preparada com Sucesso!</h3>
            <p>Sua solicitação foi encaminhada para a equipe de <strong>{politico.name}</strong> pelo WhatsApp.</p>
            <button className="btn-confirm-login" onClick={onClose} style={{ marginTop: '1.5rem' }}>
              Fechar Janela
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="gabinete-form">
            <div className="form-group-row">
              <div className="form-group flex-1">
                <label><User size={14} /> Seu Nome Completo *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Maria das Graças" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group flex-1">
                <label><Phone size={14} /> Seu WhatsApp (com DDD)</label>
                <input 
                  type="tel" 
                  placeholder="(84) 9..." 
                  value={telefone} 
                  onChange={e => setTelefone(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group flex-1">
                <label><MapPin size={14} /> Bairro / Município</label>
                <input 
                  type="text" 
                  placeholder="Ex: Alecrim, Ponta Negra ou Mossoró" 
                  value={bairro} 
                  onChange={e => setBairro(e.target.value)} 
                />
              </div>
              <div className="form-group flex-1">
                <label><FileText size={14} /> Categoria da Demanda</label>
                <select value={tipoDemanda} onChange={e => setTipoDemanda(e.target.value)}>
                  <option value="Saúde / UBS">Saúde (Postos / Remédios)</option>
                  <option value="Infraestrutura e Obras">Obras e Pavimentação</option>
                  <option value="Iluminação Pública">Iluminação Pública</option>
                  <option value="Educação e Creches">Educação e Creches</option>
                  <option value="Segurança Comunitária">Segurança Pública</option>
                  <option value="Sugestão de Projeto de Lei">Sugestão de Lei</option>
                  <option value="Outro Assunto">Outro Assunto</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Descreva a Situação / Pedido *</label>
              <textarea 
                rows={4} 
                placeholder="Conte o que está precisando de melhoria ou fiscalização na sua localidade..." 
                value={mensagem} 
                onChange={e => setMensagem(e.target.value)} 
                required
              ></textarea>
            </div>

            <div className="gabinete-comercial-callout">
              🔒 <strong>Garantia de Atendimento:</strong> A assessoria registrará o protocolo para acompanhamento do eleitor.
            </div>

            <div className="modal-actions-gabinete">
              <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-enviar-whatsapp">
                <Send size={16} /> Enviar Demanda via WhatsApp
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
