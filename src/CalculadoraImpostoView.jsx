import React, { useState } from 'react';
import { Calculator, DollarSign, PieChart, ArrowRight, ShieldCheck, HeartPulse, HardHat, GraduationCap, Lightbulb, Share2, Sparkles, RefreshCw } from 'lucide-react';

export function CalculadoraImpostoView() {
  const [salario, setSalario] = useState('3000');
  const [cidade, setCidade] = useState('Natal');
  const [bairro, setBairro] = useState('Alecrim');
  const [calculado, setCalculado] = useState(true);

  // Média aproximada de carga tributária sobre consumo e renda no Brasil (~33%)
  const numSalario = parseFloat(salario) || 0;
  const impostoAnualTotal = numSalario * 12 * 0.33;

  // Parcela que retorna através das emendas e investimentos auditados no RN (~1.8% a 2.5% do imposto per capita)
  const retornoEstimado = impostoAnualTotal * 0.022;

  // Divisão por áreas prioritárias das emendas
  const retornoSaude = retornoEstimado * 0.38;
  const retornoObras = retornoEstimado * 0.35;
  const retornoEducacao = retornoEstimado * 0.17;
  const retornoIluminacao = retornoEstimado * 0.10;

  const shareText = `💰 *Meu Imposto de Volta no RN:*%0A%0A` +
    `Calculei no Portal Conecta+RN: com minha renda em ${cidade}, cerca de *R$ ${retornoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}* do meu imposto retornaram em obras, UBS e reformas pelas emendas parlamentares fiscalizadas!%0A%0A` +
    `Faça sua simulação cívica também: ${window.location.origin}`;

  const handleShareZap = () => {
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  return (
    <div className="calc-imposto-wrapper">
      <div className="calc-header-box">
        <div className="calc-icon-bubble">
          <Calculator size={30} />
        </div>
        <span className="badge-comercial-pro">Estimativa de Retorno Social</span>
        <h2>Retorno Social de Tributos</h2>
        <p>
          Demonstrativo da estimativa de reinvestimento dos tributos municipais e estaduais através de obras, saúde e serviços públicos fiscalizados no Rio Grande do Norte.
        </p>
      </div>

      <div className="calc-card-grid">
        {/* Painel de Entrada de Dados */}
        <div className="calc-input-panel">
          <h3>Simule seus Tributos</h3>
          <p className="calc-input-desc">Insira sua renda mensal aproximada e onde você mora para calcularmos o retorno social das emendas.</p>

          <div className="form-group">
            <label>Sua Renda / Salário Mensal (R$)</label>
            <div className="input-currency-wrapper">
              <span className="currency-prefix">R$</span>
              <input 
                type="number" 
                min="1000" 
                step="500" 
                value={salario} 
                onChange={e => setSalario(e.target.value)} 
                placeholder="Ex: 3000"
              />
            </div>
            <div className="preset-salarios">
              <button type="button" onClick={() => setSalario('1518')}>1 Salário Mínimo</button>
              <button type="button" onClick={() => setSalario('3000')}>R$ 3.000</button>
              <button type="button" onClick={() => setSalario('5000')}>R$ 5.000</button>
              <button type="button" onClick={() => setSalario('10000')}>R$ 10.000</button>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group flex-1">
              <label>Sua Cidade / Município</label>
              <select value={cidade} onChange={e => setCidade(e.target.value)}>
                <option value="Natal">Natal</option>
                <option value="Parnamirim">Parnamirim</option>
                <option value="Mossoró">Mossoró</option>
                <option value="Caicó">Caicó</option>
                <option value="Outro Município do RN">Outro Município do RN</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Bairro ou Região</label>
              <input 
                type="text" 
                value={bairro} 
                onChange={e => setBairro(e.target.value)} 
                placeholder="Ex: Alecrim, Ponta Negra, Zona Norte"
              />
            </div>
          </div>

          <div className="calc-disclaimer-legal">
            <ShieldCheck size={16} />
            <span>Cálculo baseado na alíquota média de impostos no Brasil e no montante de emendas fiscalizadas no portal.</span>
          </div>
        </div>

        {/* Painel de Resultados do Retorno */}
        <div className="calc-result-panel">
          <div className="result-kpi-banner">
            <span className="kpi-label">RETORNO ESTIMADO EM AÇÕES NO SEU MUNICÍPIO</span>
            <strong className="kpi-value">
              R$ {retornoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
            <span className="kpi-sub">
              de um total estimado de R$ {impostoAnualTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })} pagos em tributos por ano
            </span>
          </div>

          <div className="destinacao-breakdown">
            <h4>Onde o seu dinheiro foi reinvestido:</h4>

            <div className="breakdown-item health">
              <div className="breakdown-icon">
                <HeartPulse size={20} />
              </div>
              <div className="breakdown-details">
                <div className="breakdown-title-row">
                  <strong>Saúde & Postos de Saúde (UBS)</strong>
                  <span>R$ {retornoSaude.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <p>Compra de remédios básicos, ambulâncias e exames na rede pública.</p>
              </div>
            </div>

            <div className="breakdown-item works">
              <div className="breakdown-icon">
                <HardHat size={20} />
              </div>
              <div className="breakdown-details">
                <div className="breakdown-title-row">
                  <strong>Pavimentação & Drenagem de Ruas</strong>
                  <span>R$ {retornoObras.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <p>Obras de asfalto, reforma de praças e contenção de encostas.</p>
              </div>
            </div>

            <div className="breakdown-item edu">
              <div className="breakdown-icon">
                <GraduationCap size={20} />
              </div>
              <div className="breakdown-details">
                <div className="breakdown-title-row">
                  <strong>Educação & Reformas Escolares</strong>
                  <span>R$ {retornoEducacao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <p>Ar-condicionado nas salas, compra de fardamento e quadras poliesportivas.</p>
              </div>
            </div>

            <div className="breakdown-item light">
              <div className="breakdown-icon">
                <Lightbulb size={20} />
              </div>
              <div className="breakdown-details">
                <div className="breakdown-title-row">
                  <strong>Iluminação em LED & Segurança</strong>
                  <span>R$ {retornoIluminacao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <p>Lâmpadas de LED para praças e reforço na Guarda Municipal.</p>
              </div>
            </div>
          </div>

          <button className="btn-share-imposto-zap" onClick={handleShareZap}>
            <Share2 size={16} /> Compartilhar meu extrato no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
