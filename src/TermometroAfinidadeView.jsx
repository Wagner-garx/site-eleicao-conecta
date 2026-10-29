import React, { useState } from 'react';
import { Check, X, ThumbsUp, ThumbsDown, Sparkles, Share2, RefreshCw, Award, ArrowRight, UserCheck, Flame } from 'lucide-react';

// Votações reais e emblemáticas para o quiz de afinidade cívica
const questoesVotacao = [
  {
    id: 1,
    tema: 'Transporte & Mobilidade',
    titulo: 'Passe Livre Estudantil Integral nos Ônibus',
    descricao: 'Proposta para garantir gratuidade total para estudantes de escolas públicas e universidades nas linhas intermunicipais e da capital.',
    posicoes: {
      'Camila Araújo': 'SIM',
      'Nina Souza': 'SIM',
      'Rogério Marinho': 'NAO',
      'Zenaide Maia': 'SIM',
      'Styvenson Valentim': 'SIM',
      'Tomba Farias': 'NAO',
      'Divaneide Basílio': 'SIM'
    }
  },
  {
    id: 2,
    tema: 'Tributação & Comércio',
    titulo: 'Redução do ICMS Estadual e Isenção para Pequenos Negócios',
    descricao: 'Redução da alíquota básica de impostos sobre produtos de consumo e incentivo fiscal para microempreendedores potiguares.',
    posicoes: {
      'Camila Araújo': 'SIM',
      'Nina Souza': 'SIM',
      'Rogério Marinho': 'SIM',
      'Zenaide Maia': 'NAO',
      'Styvenson Valentim': 'SIM',
      'Tomba Farias': 'SIM',
      'Divaneide Basílio': 'NAO'
    }
  },
  {
    id: 3,
    tema: 'Saúde Pública',
    titulo: 'Destinação Obrigatória de 50% das Emendas para Hospitais e UBS',
    descricao: 'Vincular por lei metade de todas as verbas parlamentares exclusivamente para zerar filas de cirurgias eletivas e compra de medicamentos.',
    posicoes: {
      'Camila Araújo': 'SIM',
      'Nina Souza': 'SIM',
      'Rogério Marinho': 'SIM',
      'Zenaide Maia': 'SIM',
      'Styvenson Valentim': 'SIM',
      'Tomba Farias': 'SIM',
      'Divaneide Basílio': 'SIM'
    }
  },
  {
    id: 4,
    tema: 'Segurança Pública',
    titulo: 'Armamento e Modernização da Guarda Municipal de Natal',
    descricao: 'Permitir treinamento tático, compra de viaturas blindadas e porte de armas para agentes da Guarda Municipal na proteção de praças e escolas.',
    posicoes: {
      'Camila Araújo': 'SIM',
      'Nina Souza': 'SIM',
      'Rogério Marinho': 'SIM',
      'Zenaide Maia': 'NAO',
      'Styvenson Valentim': 'SIM',
      'Tomba Farias': 'SIM',
      'Divaneide Basílio': 'NAO'
    }
  },
  {
    id: 5,
    tema: 'Meio Ambiente & Turismo',
    titulo: 'Flexibilização do Plano Diretor para Hotéis na Orla',
    descricao: 'Permitir novos investimentos imobiliários e construção de novos resorts turísticos na orla marítima para gerar empregos na capital.',
    posicoes: {
      'Camila Araújo': 'SIM',
      'Nina Souza': 'SIM',
      'Rogério Marinho': 'SIM',
      'Zenaide Maia': 'NAO',
      'Styvenson Valentim': 'SIM',
      'Tomba Farias': 'SIM',
      'Divaneide Basílio': 'NAO'
    }
  }
];

// Lista de parlamentares analisados
const politicosParaComparacao = [
  { name: 'Camila Araújo', role: 'Dep. Estadual', party: 'PL', foto: 'https://ui-avatars.com/api/?name=Camila+Araujo&background=002776&color=fff' },
  { name: 'Nina Souza', role: 'Vereadora', party: 'UNIÃO', foto: 'https://ui-avatars.com/api/?name=Nina+Souza&background=002776&color=fff' },
  { name: 'Rogério Marinho', role: 'Senador', party: 'PL', foto: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador4694.jpg' },
  { name: 'Zenaide Maia', role: 'Senadora', party: 'PSD', foto: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador5783.jpg' },
  { name: 'Styvenson Valentim', role: 'Senador', party: 'PODEMOS', foto: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador5959.jpg' },
  { name: 'Divaneide Basílio', role: 'Dep. Estadual', party: 'PT', foto: 'https://ui-avatars.com/api/?name=Divaneide+Basilio&background=002776&color=fff' },
  { name: 'Tomba Farias', role: 'Dep. Estadual', party: 'PL', foto: 'https://ui-avatars.com/api/?name=Tomba+Farias&background=002776&color=fff' }
];

export function TermometroAfinidadeView() {
  const [etapa, setEtapa] = useState('intro'); // 'intro' | 'quiz' | 'resultado'
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostasUsuario, setRespostasUsuario] = useState({}); // { [id]: 'SIM' | 'NAO' }

  const handleVotar = (voto) => {
    const qId = questoesVotacao[questaoAtual].id;
    const novasRespostas = { ...respostasUsuario, [qId]: voto };
    setRespostasUsuario(novasRespostas);

    if (questaoAtual < questoesVotacao.length - 1) {
      setQuestaoAtual(prev => prev + 1);
    } else {
      setEtapa('resultado');
    }
  };

  const reiniciarQuiz = () => {
    setQuestaoAtual(0);
    setRespostasUsuario({});
    setEtapa('quiz');
  };

  // Cálculo da % de afinidade para cada político
  const rankingAfinidade = politicosParaComparacao.map(pol => {
    let pontuacao = 0;
    questoesVotacao.forEach(q => {
      const meuVoto = respostasUsuario[q.id];
      const votoPol = q.posicoes[pol.name];
      if (meuVoto && votoPol && meuVoto === votoPol) {
        pontuacao += 1;
      }
    });

    const percentual = Math.round((pontuacao / questoesVotacao.length) * 100);
    return {
      ...pol,
      compatibilidade: percentual
    };
  }).sort((a, b) => b.compatibilidade - a.compatibilidade);

  const topMatch = rankingAfinidade[0];

  const shareText = `🗳️ *Meu Termômetro de Afinidade Política no RN:*\n\n` +
    `Fiz o teste no Conecta+RN e descobri que tenho *${topMatch.compatibilidade}% de afinidade* com o(a) parlamentar *${topMatch.name} (${topMatch.party})*!\n\n` +
    `Descubra com quem você tem mais sintonia nas votações reais: ${window.location.origin}`;

  const handleShareZap = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="termometro-wrapper">
      {/* TELA DE INTRODUÇÃO */}
      {etapa === 'intro' && (
        <div className="termometro-intro-card">
          <div className="termometro-fire-bubble">
            <UserCheck size={32} />
          </div>
          <span className="badge-comercial-pro">Análise de Compatibilidade Legislativa</span>
          <h2>Afinidade de Votações em Plenário</h2>
          <p>
            Avalie seu alinhamento com os posicionamentos dos parlamentares potiguares.
            Compare sua opinião com <strong>5 votações recentes</strong> realizadas na Assembleia Legislativa e na Câmara Municipal de Natal.
          </p>

          <div className="termometro-benefits-row">
            <div className="benefit-item">
              <span>Critério Técnico</span>
              <p>Questões objetivas de interesse público</p>
            </div>
            <div className="benefit-item">
              <span>Registros Oficiais</span>
              <p>Histórico apurado dos anais legislativos</p>
            </div>
            <div className="benefit-item">
              <span>Sigilo Total</span>
              <p>Suas respostas não são armazenadas</p>
            </div>
          </div>

          <button className="btn-iniciar-quiz" onClick={() => setEtapa('quiz')}>
            Iniciar Simulação de Votos
          </button>
        </div>
      )}

      {/* TELA DO QUIZ / PERGUNTAS */}
      {etapa === 'quiz' && (
        <div className="termometro-quiz-container">
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress-fill" 
              style={{ width: `${((questaoAtual + 1) / questoesVotacao.length) * 100}%` }}
            ></div>
          </div>

          <div className="quiz-header-counter">
            <span>Questão {questaoAtual + 1} de {questoesVotacao.length}</span>
            <span className="quiz-tag-tema">{questoesVotacao[questaoAtual].tema}</span>
          </div>

          <div className="quiz-card-content">
            <h3 className="quiz-question-title">{questoesVotacao[questaoAtual].titulo}</h3>
            <p className="quiz-question-desc">{questoesVotacao[questaoAtual].descricao}</p>

            <div className="quiz-vote-buttons">
              <button className="btn-vote-sim" onClick={() => handleVotar('SIM')}>
                <ThumbsUp size={22} />
                <span>Sou a Favor (SIM)</span>
              </button>
              <button className="btn-vote-nao" onClick={() => handleVotar('NAO')}>
                <ThumbsDown size={22} />
                <span>Sou Contra (NÃO)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TELA DE RESULTADO / RANKING DE AFINIDADE */}
      {etapa === 'resultado' && (
        <div className="termometro-result-wrapper">
          <div className="result-main-card">
            <div className="result-top-badge">
              <Award size={18} /> Seu Maior Alinhamento Político
            </div>

            <div className="result-highlight-profile">
              <div className="profile-img-match">
                <img src={topMatch.foto} alt={topMatch.name} />
                <span className="match-tag-circle">{topMatch.compatibilidade}%</span>
              </div>
              <div className="profile-info-match">
                <h3>{topMatch.name}</h3>
                <p>{topMatch.role} • <strong>{topMatch.party}</strong></p>
                <div className="match-bar-container">
                  <div className="match-bar-fill" style={{ width: `${topMatch.compatibilidade}%` }}></div>
                </div>
                <small>Suas posições coincidem em {topMatch.compatibilidade}% das votações em plenário.</small>
              </div>
            </div>

            <div className="result-share-buttons">
              <button className="btn-share-zap-result" onClick={handleShareZap}>
                <Share2 size={16} /> Compartilhar meu resultado no WhatsApp
              </button>
              <button className="btn-refazer-quiz" onClick={reiniciarQuiz}>
                <RefreshCw size={15} /> Refazer Teste
              </button>
            </div>
          </div>

          {/* Ranking com todos os parlamentares */}
          <div className="result-ranking-list">
            <h3>Compatibilidade com os Demais Representantes:</h3>
            <div className="ranking-items-grid">
              {rankingAfinidade.slice(1).map((pol, idx) => (
                <div key={idx} className="ranking-card-item">
                  <img src={pol.foto} alt={pol.name} />
                  <div className="ranking-card-info">
                    <strong>{pol.name}</strong>
                    <span>{pol.role} ({pol.party})</span>
                  </div>
                  <div className="ranking-score-pill">
                    <strong>{pol.compatibilidade}%</strong>
                    <div className="mini-progress-track">
                      <div className="mini-progress-val" style={{ width: `${pol.compatibilidade}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
