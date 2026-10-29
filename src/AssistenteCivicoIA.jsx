import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare, HelpCircle, CheckCircle, ShieldCheck, User, RefreshCw } from 'lucide-react';

export function AssistenteCivicoIA({ politicosList = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      time: 'Agora',
      text: 'Olá! Sou o **Assessor Cívico com IA** do Conecta+RN. 🏛️🤖\n\nPosso responder em tempo real sobre emendas, obras nos bairros de Natal e cidades do RN, projetos de lei e gastos de qualquer parlamentar cadastrado. O que você gostaria de saber hoje?'
    }
  ]);

  const perguntasSugeridas = [
    'O que foi investido na Saúde em Natal?',
    'Quem destinou verbas para o bairro Alecrim?',
    'Quais são os senadores do RN?',
    'Como funciona o envio de demandas ao gabinete?',
    'Qual deputado tem mais obras vinculadas?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Motor de Inteligência Cívica Contextual (Simula IA Generativa Parlamentar em tempo real)
  const processarPergunta = (pergunta) => {
    const q = pergunta.toLowerCase();

    if (q.includes('saúde') || q.includes('ubs') || q.includes('posto') || q.includes('hospital')) {
      return `🩺 **Investimentos em Saúde no RN:**\n\nA área da saúde é a principal prioridade identificada nas emendas do portal (cerca de 35% do montante total).\n\n• **Destaques em Natal:** R$ 650 mil destinados à reforma da UBS Alecrim e convênios para mutirões de exames.\n• **Interior:** R$ 1,8 milhão para aquisição de tomógrafo no Hospital Regional de Caicó e ambulâncias para cidades do Seridó e Oeste.\n\nVocê pode conferir o detalhamento no nosso **🗺️ Mapa de Obras**!`;
    }

    if (q.includes('alecrim') || q.includes('bairro') || q.includes('ponta negra') || q.includes('zona norte') || q.includes('mossoró') || q.includes('caicó')) {
      return `📍 **Ações por Localidade:**\n\nLocalizamos registros diretos de emendas e atuações comunitárias:\n\n• **Alecrim (Natal):** Reforma e modernização de UBS com R$ 650.000 empenhados.\n• **Ponta Negra (Natal):** Projeto de modernização da iluminação pública em LED na orla.\n• **Caicó e Mossoró:** Verbas federais e estaduais com foco no comércio e saneamento básico.\n\nAbra o **Mapa de Obras** no menu superior para filtrar exatamente pelo seu bairro!`;
    }

    if (q.includes('senador') || q.includes('senadores')) {
      return `🏛️ **Bancada do Senado Federal pelo RN:**\n\nO Rio Grande do Norte conta com 3 senadores monitorados em tempo real:\n1. **Rogério Marinho (PL)** — R$ 41.2M em emendas, foco em infraestrutura e desenvolvimento regional.\n2. **Zenaide Maia (PSD)** — R$ 27.0M em emendas, priorizando saúde pública e hospitais.\n3. **Styvenson Valentim (PODEMOS)** — R$ 22.4M em emendas, direcionadas à segurança e reformas escolares.`;
    }

    if (q.includes('gabinete') || q.includes('whatsapp') || q.includes('falar') || q.includes('contato')) {
      return `💬 **Gabinete Digital no WhatsApp:**\n\nQualquer cidadão pode mandar sua solicitação diretamente para a equipe do político! Basta clicar no botão **"💬 Gabinete"** no card do parlamentar desejado. Você informa seu bairro e a demanda, e o sistema formata a mensagem para o WhatsApp da assessoria.`;
    }

    if (q.includes('mais obra') || q.includes('campeão') || q.includes('obras')) {
      return `🏗️ **Monitoramento de Obras:**\n\nEntre os senadores, Rogério Marinho lidera em obras vinculadas (51 obras). Já na Assembleia Legislativa do RN, deputados como Tomba Farias (15 obras) e Gustavo Carvalho (14 obras) possuem grande volume de projetos em andamento no interior.`;
    }

    if (q.includes('gasto') || q.includes('cota') || q.includes('combustível') || q.includes('passagem')) {
      return `📊 **Gastos de Gabinete:**\n\nOs gastos de Deputados Federais são buscados **ao vivo** diretamente da API Oficial da Câmara dos Deputados! Clique em **"📊 Ver Extrato"** no parlamentar e depois na aba **"Gastos de Gabinete"** para ver item por item: passagens, combustível e divulgação.`;
    }

    // Resposta padrão inteligente
    return `🤖 **Análise do Assessor IA:**\n\nCompreendi sua dúvida sobre *"\"${pergunta}\"*. O mandato dos parlamentares potiguares prioriza Saúde (35%), Infraestrutura (40%) e Educação (15%).\n\nVocê pode:\n1. Consultar o **Extrato Completo** de cada um na aba principal;\n2. Ver os pontos exatos no **🗺️ Mapa de Obras**;\n3. Enviar uma solicitação direta pelo botão **💬 Gabinete**.`;
  };

  const handleSendMessage = (textToSend = inputMessage) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: 'Agora',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Resposta humanizada com delay natural da IA
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        time: 'Agora',
        text: processarPergunta(textToSend)
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <>
      {/* Botão Flutuante Discreto e Profissional */}
      <div className="ia-floating-trigger" onClick={() => setIsOpen(!isOpen)} title="Central de Atendimento ao Cidadão">
        <div className="ia-trigger-icon">
          <MessageSquare size={20} />
        </div>
        <span className="ia-trigger-label">
          Atendimento ao Cidadão
        </span>
      </div>

      {/* Janela do Atendimento Cívico */}
      {isOpen && (
        <div className="ia-chat-modal">
          <div className="ia-chat-header">
            <div className="ia-chat-header-info">
              <div className="ia-avatar-badge">
                <MessageSquare size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3>Assistência Digital ao Eleitor</h3>
                  <span className="badge-ia-online">Disponível</span>
                </div>
                <p>Tire dúvidas sobre emendas, obras locais e atuações parlamentares</p>
              </div>
            </div>
            <button className="ia-close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="ia-chat-body">
            {messages.map(msg => (
              <div key={msg.id} className={`ia-message-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                {msg.sender === 'bot' && (
                  <div className="ia-msg-avatar">
                    <ShieldCheck size={15} />
                  </div>
                )}
                <div className={`ia-message-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                  <div className="ia-msg-text">
                    {msg.text.split('\n\n').map((paragrafo, i) => (
                      <p key={i} style={{ marginBottom: i < msg.text.split('\n\n').length - 1 ? '0.6rem' : 0 }}>
                        {paragrafo.split('\n').map((linha, j) => (
                          <React.Fragment key={j}>
                            {linha.startsWith('• ') ? (
                              <span style={{ display: 'block', paddingLeft: '8px' }}>{linha}</span>
                            ) : linha.startsWith('**') ? (
                              <strong>{linha.replace(/\*\*/g, '')}</strong>
                            ) : (
                              linha
                            )}
                            {j < linha.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    ))}
                  </div>
                  <span className="ia-msg-time">{msg.time}</span>
                </div>
                {msg.sender === 'user' && (
                  <div className="ia-msg-avatar user">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="ia-message-row bot">
                <div className="ia-msg-avatar">
                  <ShieldCheck size={15} />
                </div>
                <div className="ia-typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugestões Rápidas de Perguntas */}
          <div className="ia-suggestions-container">
            <span className="suggestions-title"><HelpCircle size={12} /> Perguntas Frequentes:</span>
            <div className="suggestions-scroll">
              {perguntasSugeridas.map((sugestao, idx) => (
                <button 
                  key={idx} 
                  className="suggestion-chip"
                  onClick={() => handleSendMessage(sugestao)}
                >
                  {sugestao}
                </button>
              ))}
            </div>
          </div>

          {/* Input de Mensagem */}
          <form 
            className="ia-chat-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input 
              type="text" 
              placeholder="Pergunte sobre emendas, obras, bairros ou políticos..." 
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={!inputMessage.trim() || isTyping}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
