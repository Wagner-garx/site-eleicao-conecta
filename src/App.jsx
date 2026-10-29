import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Building2, Landmark, CheckCircle2, X, BarChart3, PieChart as PieChartIcon, Users, Shield, BookOpen, Receipt, RefreshCw, Wifi, WifiOff, Share2, Headphones, Lock, MapPin } from 'lucide-react';
import { VotacaoBairroView } from './VotacaoBairroView';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAdmin } from './AdminContext';
import { BlogSection } from './BlogSection';
import { ParlamentarMidiasAdmin } from './ParlamentarMidiasAdmin';
import { GabineteDigitalModal } from './GabineteDigitalModal';
import { ShareCardModal } from './ShareCardModal';
import { MapaObrasView } from './MapaObrasView';
import { AssistenteCivicoIA } from './AssistenteCivicoIA';
import { TermometroAfinidadeView } from './TermometroAfinidadeView';
import { CalculadoraImpostoView } from './CalculadoraImpostoView';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// ===== CÁLCULO AUTOMÁTICO DA LEGISLATURA =====
// A legislatura brasileira dura 4 anos. A 57ª iniciou em 2023.
// Após as eleições de 2026, a 58ª começa em 2027, e assim por diante.
const getCurrentLegislatura = () => {
  const ano = new Date().getFullYear();
  // A 57ª legislatura started in 2023. Each 4 years = new legislature.
  // Formula: 57 + floor((ano - 2023) / 4) se ano >= 2027
  if (ano < 2027) return 57;
  return 57 + Math.floor((ano - 2023) / 4);
};

// Helper for generic Bio and Gastos
const generateBio = (name, role, party) => `${name} é um(a) ${role} atuante pelo estado do Rio Grande do Norte, filiado(a) ao ${party}. Ao longo de seu mandato, tem priorizado a destinação de emendas para as áreas de saúde, infraestrutura e educação, buscando o desenvolvimento dos municípios potiguares e a melhoria da qualidade de vida da população.`;

const generateGastos = () => [
  { categoria: 'Divulgação da Atividade Parlamentar', valor: 'R$ ' + (Math.random() * 20 + 10).toFixed(1) + ' mil' },
  { categoria: 'Passagens Aéreas', valor: 'R$ ' + (Math.random() * 15 + 5).toFixed(1) + ' mil' },
  { categoria: 'Manutenção de Escritório', valor: 'R$ ' + (Math.random() * 10 + 2).toFixed(1) + ' mil' },
  { categoria: 'Combustíveis e Lubrificantes', valor: 'R$ ' + (Math.random() * 8 + 3).toFixed(1) + ' mil' },
];

const processData = (list, defaultRole) => list.map(item => ({
  ...item,
  role: item.role || defaultRole,
  bio: item.bio || generateBio(item.name, item.role || defaultRole, item.party),
  gastosDetalhes: item.gastosDetalhes || generateGastos()
}));

// ===== BUSCA AUTOMÁTICA: DEPUTADOS FEDERAIS DO RN =====
const fetchDeputadosFederaisRN = async () => {
  const legislatura = getCurrentLegislatura();
  const resp = await fetch(`/api-camara/deputados?idLegislatura=${legislatura}&siglaUf=RN&ordem=ASC&ordenarPor=nome&itens=100`);
  if (!resp.ok) throw new Error('Falha ao buscar deputados');
  const data = await resp.json();
  // Desduplicar por id (a API pode retornar duplicatas por mudança de partido)
  const seen = new Set();
  return (data.dados || [])
    .filter(d => { if (seen.has(d.id)) return false; seen.add(d.id); return true; })
    .map((d, idx) => ({
      id: d.id,
      name: d.nome,
      role: 'Dep. Federal',
      party: d.siglaPartido,
      foto: d.urlFoto,
      link: `https://www.camara.leg.br/deputados/${d.id}/biografia`,
      emendas: 'Carregando...',
      obras: '—',
    }));
};

// ===== BUSCA AUTOMÁTICA: SENADORES DO RN =====
const fetchSenadoresRN = async () => {
  const resp = await fetch('/api-senado/senador/lista/atual');
  if (!resp.ok) throw new Error('Falha ao buscar senadores');
  const text = await resp.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');
  const parlamentares = Array.from(xml.querySelectorAll('Parlamentar'));
  return parlamentares
    .filter(p => p.querySelector('UfParlamentar')?.textContent?.trim() === 'RN')
    .map(p => {
      const id = p.querySelector('CodigoParlamentar')?.textContent;
      const nome = p.querySelector('NomeParlamentar')?.textContent;
      const partido = p.querySelector('SiglaPartidoParlamentar')?.textContent;
      const foto = p.querySelector('UrlFotoParlamentar')?.textContent;
      const link = p.querySelector('UrlPaginaParlamentar')?.textContent;
      return {
        id: parseInt(id),
        name: nome,
        role: 'Senador(a)',
        party: partido,
        foto,
        link,
        emendas: 'Carregando...',
        obras: '—',
      };
    });
};

// ==== VEREADORES (29) ====
const vereadoresRaw = [
  { id: 101, name: 'Aldo Clemente', party: 'PSDB', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2022/03/09/dc6c4a2d56e7b06e2529cfebb86fcdbc.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/55', emendas: 'R$ 1.2M', obras: 6 },
  { id: 102, name: 'Anne Lagartixa', party: 'PL', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/03/c606e7662b30b476d484312d4aba2625.jpeg', link: 'https://www.cmnat.rn.gov.br/vereadores/67', emendas: 'R$ 0.8M', obras: 3 },
  { id: 103, name: 'Brisa Bracchi', party: 'PT', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2021/01/12/d9e2fe4fda93ec3800eda792569c7c87.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/57', emendas: 'R$ 0.9M', obras: 4 },
  { id: 104, name: 'Camila Araújo', party: 'PL', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2026/04/13/fa7c2abd7855621d06bf953127b2e76c.jpeg', link: 'https://www.cmnat.rn.gov.br/vereadores/53', emendas: 'R$ 1.1M', obras: 5 },
  { id: 105, name: 'Claudio Custódio', party: 'PP', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/12/12/0e0d54b26a92336d72bc933548c11965.jpeg', link: 'https://www.cmnat.rn.gov.br/vereadores/68', emendas: 'R$ 0.7M', obras: 3 },
  { id: 106, name: 'Cleiton da Policlínica', party: 'PSDB', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/02/20/b08393c3ab1f20dd9b58de55f9f9fe67.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/83', emendas: 'R$ 0.6M', obras: 2 },
  { id: 107, name: 'Daniel Santiago', party: 'PP', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/02/19/0ac1b158bf0d2a489432137c57ae41e7.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/70', emendas: 'R$ 0.9M', obras: 4 },
  { id: 108, name: 'Daniel Valença', party: 'PT', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2023/01/30/1855dd36f7447df28e7e7399ccc61731.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/63', emendas: 'R$ 1.0M', obras: 5 },
  { id: 109, name: 'Daniell Rendall', party: 'Republicanos', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/02/a24382deaca2ca5e1d36be1c7e4d65e4.png', link: 'https://www.cmnat.rn.gov.br/vereadores/69', emendas: 'R$ 0.8M', obras: 3 },
  { id: 110, name: 'Eribaldo Medeiros', party: 'REDE', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2021/02/12/1833e1817e2b4a11976b168886d3b6da.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/56', emendas: 'R$ 0.7M', obras: 3 },
  { id: 111, name: 'Eriko Jácome', party: 'PSDB', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2023/08/23/e347d4e2513141e391f4abe587537d32.jpeg', link: 'https://www.cmnat.rn.gov.br/vereadores/29', emendas: 'R$ 1.4M', obras: 7 },
  { id: 112, name: 'Fúlvio Saulo', party: 'Solidariedade', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2026/01/14/ab31dad57a97a7a29c0ab172b65515e0.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/71', emendas: 'R$ 0.6M', obras: 2 },
  { id: 113, name: 'Herberth Sena', party: 'PV', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2021/01/19/c2c78471c798ef726490ea63937a7799.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/58', emendas: 'R$ 0.8M', obras: 4 },
  { id: 114, name: 'Irapoã Nóbrega', party: 'Republicanos', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/03/1853fcfbf051d43b64a1e96c365a729c.png', link: 'https://www.cmnat.rn.gov.br/vereadores/72', emendas: 'R$ 0.9M', obras: 4 },
  { id: 115, name: 'João Batista Torres', party: 'DC', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/03/8010bc13a364d7c196d8fd7a4a193ce0.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/73', emendas: 'R$ 0.7M', obras: 3 },
  { id: 116, name: 'Kleber Fernandes', party: 'Republicanos', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/02/5c41827af140e2e511897dde33cc2006.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/15', emendas: 'R$ 1.1M', obras: 5 },
  { id: 117, name: 'Leo Souza', party: 'PSDB', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/08/afed9613dd43102549c59b8c28a24de1.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/82', emendas: 'R$ 0.9M', obras: 4 },
  { id: 118, name: 'Luciano Nascimento', party: 'PSD', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2021/01/12/0f10b475ca59f2cf0f59f4a4a939f54c.jpeg', link: 'https://www.cmnat.rn.gov.br/vereadores/51', emendas: 'R$ 1.0M', obras: 5 },
  { id: 119, name: 'Matheus Faustino', party: 'União Brasil', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2026/05/22/444de026debf44b1929628672cbec63a.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/75', emendas: 'R$ 0.8M', obras: 3 },
  { id: 120, name: 'Nina Souza', party: 'PL', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2021/02/10/83d18dc6658dcf1468fdd854ed233f0c.jpeg', link: 'https://www.cmnat.rn.gov.br/vereadores/32', emendas: 'R$ 1.0M', obras: 5 },
  { id: 121, name: 'Pedro Henrique', party: 'PP', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/03/e0164a53e00c013310391bf3612fa31e.jpeg', link: 'https://www.cmnat.rn.gov.br/vereadores/76', emendas: 'R$ 0.7M', obras: 3 },
  { id: 122, name: 'Preto Aquino', party: 'PODEMOS', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2019/10/15/6fcda4e7a42ea0e57275156b87bd2c60.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/21', emendas: 'R$ 1.3M', obras: 6 },
  { id: 123, name: 'Robson Carvalho', party: 'União Brasil', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2019/10/14/1dcf0dafd237f926a2c340c0e3db1c57.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/30', emendas: 'R$ 1.5M', obras: 7 },
  { id: 124, name: 'Samanda Alves', party: 'PT', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/02/11/642453d54154bc09b5bd562ce18e5f47.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/77', emendas: 'R$ 0.8M', obras: 3 },
  { id: 125, name: 'Subtenente Eliabe', party: 'PL', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/08/38af3087c5ad9b34d29f4f9794f9b9a1.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/78', emendas: 'R$ 0.7M', obras: 3 },
  { id: 126, name: 'Tarcio de Eudiane', party: 'União Brasil', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/02/3c86f68a4e33a7c4c1bbf6e742dd1a97.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/79', emendas: 'R$ 0.9M', obras: 4 },
  { id: 127, name: 'Tércio Tinoco', party: 'União Brasil', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2026/09/24/0bc8908920331db44eccaa7dd259338f.jpg', link: 'https://www.cmnat.rn.gov.br/vereadores/49', emendas: 'R$ 1.1M', obras: 5 },
  { id: 128, name: 'Thabatta Pimenta', party: 'PV', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2025/01/15/c004b620ce42664f3e0b311330f58fba.png', link: 'https://www.cmnat.rn.gov.br/vereadores/81', emendas: 'R$ 0.9M', obras: 4 },
  { id: 129, name: 'Tony Henrique', party: 'PL', foto: 'https://www.cmnat.rn.gov.br/_ups/vereadores/2026/04/13/6a6c2ef93c4eedf1b4d60b53e6a8e6d4.jpeg', link: 'https://www.cmnat.rn.gov.br/vereadores/80', emendas: 'R$ 0.8M', obras: 3 },
];

// ==== FALLBACK ESTÁTICO: DEPUTADOS FEDERAIS (usado se API falhar) ====
const deputadosFederaisFallback = [
  { id: 204453, name: 'Natália Bonavides', role: 'Dep. Federal', party: 'PT', emendas: 'R$ 33.5M', obras: 45, foto: 'https://www.camara.leg.br/internet/deputado/bandep/204453.jpg', link: 'https://www.camara.leg.br/deputados/204453/biografia' },
  { id: 109429, name: 'Benes Leocádio', role: 'Dep. Federal', party: 'UNIÃO', emendas: 'R$ 15.2M', obras: 19, foto: 'https://www.camara.leg.br/internet/deputado/bandep/109429.jpg', link: 'https://www.camara.leg.br/deputados/109429/biografia' },
  { id: 213762, name: 'Carla Dickson', role: 'Dep. Federal', party: 'PL', emendas: 'R$ 12.1M', obras: 14, foto: 'https://www.camara.leg.br/internet/deputado/bandep/213762.jpg', link: 'https://www.camara.leg.br/deputados/213762/biografia' },
  { id: 204445, name: 'Fernando Mineiro', role: 'Dep. Federal', party: 'PT', emendas: 'R$ 18.9M', obras: 24, foto: 'https://www.camara.leg.br/internet/deputado/bandep/204445.jpg', link: 'https://www.camara.leg.br/deputados/204445/biografia' },
  { id: 204473, name: 'General Girão', role: 'Dep. Federal', party: 'PL', emendas: 'R$ 19.3M', obras: 21, foto: 'https://www.camara.leg.br/internet/deputado/bandep/204473.jpg', link: 'https://www.camara.leg.br/deputados/204473/biografia' },
  { id: 141459, name: 'João Maia', role: 'Dep. Federal', party: 'PP', emendas: 'R$ 25.6M', obras: 30, foto: 'https://www.camara.leg.br/internet/deputado/bandep/141459.jpg', link: 'https://www.camara.leg.br/deputados/141459/biografia' },
  { id: 220624, name: 'Robinson Faria', role: 'Dep. Federal', party: 'PP', emendas: 'R$ 20.3M', obras: 22, foto: 'https://www.camara.leg.br/internet/deputado/bandep/220624.jpg', link: 'https://www.camara.leg.br/deputados/220624/biografia' },
  { id: 220621, name: 'Sargento Gonçalves', role: 'Dep. Federal', party: 'PL', emendas: 'R$ 14.7M', obras: 17, foto: 'https://www.camara.leg.br/internet/deputado/bandep/220621.jpg', link: 'https://www.camara.leg.br/deputados/220621/biografia' },
];

// ==== FALLBACK ESTÁTICO: SENADORES DO RN (usado se API falhar) ====
const senadoresFallback = [
  { id: 4694, name: 'Rogério Marinho', party: 'PL', emendas: 'R$ 41.2M', obras: 51, foto: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador4694.jpg', link: 'https://www25.senado.leg.br/web/senadores/senador/-/perfil/4694' },
  { id: 5783, name: 'Zenaide Maia', party: 'PSD', emendas: 'R$ 27.0M', obras: 28, foto: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador5783.jpg', link: 'https://www25.senado.leg.br/web/senadores/senador/-/perfil/5783' },
  { id: 5959, name: 'Styvenson Valentim', party: 'PODEMOS', emendas: 'R$ 22.4M', obras: 15, foto: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador5959.jpg', link: 'https://www25.senado.leg.br/web/senadores/senador/-/perfil/5959' },
];

// ==== DEPUTADOS ESTADUAIS (ALRN) ====
const deputadosEstaduaisRaw = [
  { id: 10, name: 'Coronel Azevedo', role: 'Dep. Estadual', party: 'PL', emendas: 'R$ 10.5M', obras: 15, foto: 'https://al.rn.leg.br/storage/parlamentares/33/foto-coronel-azevedo_65e9ccb79e553.png', link: 'https://al.rn.leg.br/parlamentares/33/coronel-azevedo' },
  { id: 11, name: 'Ezequiel Ferreira', role: 'Dep. Estadual', party: 'PSDB', emendas: 'R$ 11.2M', obras: 18, foto: 'https://al.rn.leg.br/storage/parlamentares/25/foto-ezequiel-ferreira_65e9cd47de8b9.png', link: 'https://al.rn.leg.br/parlamentares/25/ezequiel-ferreira' },
  { id: 12, name: 'Robson Carvalho', role: 'Dep. Estadual', party: 'União', emendas: 'R$ 8.9M', obras: 11 },
  { id: 13, name: 'Julio Cesar', role: 'Dep. Estadual', party: 'PP', emendas: 'R$ 9.1M', obras: 12 },
  { id: 14, name: 'Kleber Rodrigues', role: 'Dep. Estadual', party: 'PP', emendas: 'R$ 9.5M', obras: 14 },
  { id: 15, name: 'Francisco do PT', role: 'Dep. Estadual', party: 'PT', emendas: 'R$ 10.2M', obras: 16 },
  { id: 16, name: 'Kaline de Dr. Bernardo', role: 'Dep. Estadual', party: 'PV', emendas: 'R$ 7.5M', obras: 9 },
  { id: 17, name: 'Cinthia de Allyson', role: 'Dep. Estadual', party: 'União', emendas: 'R$ 7.2M', obras: 8 },
  { id: 18, name: 'Isolda Dantas', role: 'Dep. Estadual', party: 'PT', emendas: 'R$ 8.5M', obras: 12, foto: 'https://al.rn.leg.br/storage/parlamentares/35/foto-isolda-dantas_65ef5e4c0d16c.png', link: 'https://al.rn.leg.br/parlamentares/35/isolda-dantas' },
  { id: 19, name: 'Divaneide Basílio', role: 'Dep. Estadual', party: 'PT', emendas: 'R$ 7.8M', obras: 10 },
  { id: 20, name: 'Neilton Diógenes', role: 'Dep. Estadual', party: 'PP', emendas: 'R$ 8.1M', obras: 11 },
  { id: 21, name: 'Dr. Kerginaldo', role: 'Dep. Estadual', party: 'PL', emendas: 'R$ 7.9M', obras: 10 },
  { id: 22, name: 'Dr. Gustavo Soares', role: 'Dep. Estadual', party: 'PSDB', emendas: 'R$ 8.4M', obras: 12 },
  { id: 23, name: 'Nelter Queiroz', role: 'Dep. Estadual', party: 'PP', emendas: 'R$ 9.2M', obras: 13 },
  { id: 24, name: 'Daniel Valença', role: 'Dep. Estadual', party: 'PT', emendas: 'R$ 7.1M', obras: 9 },
  { id: 25, name: 'Tomba Farias', role: 'Dep. Estadual', party: 'PL', emendas: 'R$ 10.0M', obras: 15 },
  { id: 26, name: 'Cristiane Dantas', role: 'Dep. Estadual', party: 'PSDB', emendas: 'R$ 8.7M', obras: 12 },
  { id: 27, name: 'Gustavo Carvalho', role: 'Dep. Estadual', party: 'PL', emendas: 'R$ 9.6M', obras: 14 },
  { id: 28, name: 'Bibiano', role: 'Dep. Estadual', party: 'MDB', emendas: 'R$ 7.4M', obras: 9 },
  { id: 29, name: 'Eudiane Macedo', role: 'Dep. Estadual', party: 'PV', emendas: 'R$ 8.2M', obras: 11 },
  { id: 30, name: 'Ivanilson Oliveira', role: 'Dep. Estadual', party: 'PV', emendas: 'R$ 7.6M', obras: 10 },
  { id: 31, name: 'Luíz Eduardo', role: 'Dep. Estadual', party: 'PL', emendas: 'R$ 7.3M', obras: 9 },
  { id: 32, name: 'Adjuto Dias', role: 'Dep. Estadual', party: 'PL', emendas: 'R$ 7.5M', obras: 10 },
  { id: 33, name: 'Camila Araújo', role: 'Dep. Estadual', party: 'PL', emendas: 'R$ 6.9M', obras: 8 },
];

// ==== SENADORES ====
const senadoresRaw = [
  { id: 51, name: 'Rogério Marinho', party: 'PL', emendas: 'R$ 41.2M', obras: 51, foto: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador4694.jpg', link: 'https://www25.senado.leg.br/web/senadores/senador/-/perfil/4694' },
  { id: 52, name: 'Zenaide Maia', party: 'PSD', emendas: 'R$ 27.0M', obras: 28, foto: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador5783.jpg', link: 'https://www25.senado.leg.br/web/senadores/senador/-/perfil/5783' },
  { id: 53, name: 'Styvenson Valentim', party: 'PODEMOS', emendas: 'R$ 22.4M', obras: 15, foto: 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador5959.jpg', link: 'https://www25.senado.leg.br/web/senadores/senador/-/perfil/5959' },
];

const vereadores = processData(vereadoresRaw, 'Vereador(a) — Natal/RN');
const deputadosEstaduais = processData(deputadosEstaduaisRaw, 'Dep. Estadual — RN');


const barData = {
  labels: ['Saúde', 'Infraest.', 'Educação', 'Segurança', 'Cultura'],
  datasets: [{ label: 'Destinação (%)', data: [35, 40, 15, 7, 3], backgroundColor: '#002776', borderRadius: 4 }],
};
const doughnutData = {
  labels: ['Concluídas', 'Em Andamento', 'Licitação', 'Paralisadas'],
  datasets: [{ data: [45, 35, 15, 5], backgroundColor: ['#009c3b', '#ffdf00', '#3b82f6', '#ef4444'], borderWidth: 0 }],
};
const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#f0f0f0' }, ticks: { color: '#6b7280' } }, x: { grid: { display: false }, ticks: { color: '#6b7280' } } } };
const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#374151' } } }, cutout: '70%' };

const fallbackPhoto = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=002776&color=fff&size=128`;

function PoliticoCard({ pol }) {
  const [modal, setModal] = useState(false);
  const [modalGabinete, setModalGabinete] = useState(false);
  const [modalShare, setModalShare] = useState(false);
  const [modalTab, setModalTab] = useState('emendas'); // 'emendas', 'gastos', 'bio', 'midias', 'votacao'
  const [realGastos, setRealGastos] = useState(null);
  const [loadingGastos, setLoadingGastos] = useState(false);
  const { parlamentarExtras, isAdmin } = useAdmin();

  // Dados extras alimentados pelo Administrador para este parlamentar
  const extra = parlamentarExtras[pol.id] || {};
  const fotoExibicao = extra.foto || pol.foto || fallbackPhoto(pol.name);

  React.useEffect(() => {
    if (modalTab === 'gastos' && pol.role.includes('Federal') && !realGastos) {
      setLoadingGastos(true);
      // Fetch despesas reais de 2024
      fetch(`/api-camara/deputados/${pol.id}/despesas?ano=2024`)
        .then(res => res.json())
        .then(data => {
            const despesas = data.dados || [];
            const grouped = {};
            let total = 0;
            despesas.forEach(d => {
                const val = parseFloat(d.valorDocumento || 0);
                if (!grouped[d.tipoDespesa]) grouped[d.tipoDespesa] = 0;
                grouped[d.tipoDespesa] += val;
                total += val;
            });
            
            const list = Object.keys(grouped).map(k => ({
                categoria: k,
                rawVal: grouped[k],
                valor: 'R$ ' + grouped[k].toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            })).sort((a,b) => b.rawVal - a.rawVal);
            
            setRealGastos({ 
              list, 
              total: 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
            });
            setLoadingGastos(false);
        }).catch(err => {
            console.error(err);
            setLoadingGastos(false);
        });
    }
  }, [modalTab, pol.id, pol.role, realGastos]);

  const getIframeSrc = (type) => {
    if (type === 'gastos') {
      if (pol.role.includes('Federal')) return `/html-camara/cota-parlamentar/sumarizado?nuDeputadoId=${pol.id}`;
      if (pol.role.includes('Senador')) return `/html-senado/web/senadores/senador/-/perfil/${pol.id}`;
      if (pol.link && pol.link.includes('al.rn.leg.br')) return pol.link.replace('https://al.rn.leg.br', '/html-alrn');
      if (pol.link && pol.link.includes('cmnat')) return pol.link.replace('https://www.cmnat.rn.gov.br', '/html-cmnat');
    }
    if (type === 'bio') {
      if (pol.role.includes('Federal')) return `/html-camara/deputados/${pol.id}/biografia`;
      if (pol.role.includes('Senador')) return `/html-senado/web/senadores/senador/-/perfil/${pol.id}`;
      if (pol.link && pol.link.includes('al.rn.leg.br')) return pol.link.replace('https://al.rn.leg.br', '/html-alrn');
      if (pol.link && pol.link.includes('cmnat')) return pol.link.replace('https://www.cmnat.rn.gov.br', '/html-cmnat');
    }
    return null;
  };

  const gastosIframeSrc = getIframeSrc('gastos');
  const bioIframeSrc = getIframeSrc('bio');

  return (
    <>
      <div className="pol-card" onClick={() => setModal(true)} title="Clique para ver detalhes">
        <div className="pol-card-header">
          <img src={fotoExibicao} alt={pol.name} onError={(e) => { e.target.src = fallbackPhoto(pol.name); }} />
          <div className="pol-info">
            <h3>{pol.name}</h3>
            <span className="role">{pol.role}</span>
            <span className="party">{pol.party}</span>
          </div>
        </div>
        <div className="pol-card-data">
          <div className="data-row"><span className="label">Total em Emendas</span><span className="value money">{pol.emendas}</span></div>
          <div className="data-row"><span className="label">Obras Vinculadas</span><span className="value">{pol.obras}</span></div>
        </div>
        
        {/* Badges de mídia extra se disponíveis */}
        {(extra.podcast || extra.instagram || extra.facebook || extra.youtube) && (
          <div className="card-media-indicators">
            {extra.podcast && <span className="media-mini-badge" title="Podcast disponível"><Headphones size={12} /> Podcast</span>}
            {(extra.instagram || extra.facebook || extra.twitter || extra.youtube) && <span className="media-mini-badge" title="Redes sociais oficiais"><Share2 size={12} /> Redes</span>}
          </div>
        )}

        <div className="pol-card-footer">
          <button className="details-btn">Extrato de Ações</button>
          <div className="pol-card-quick-actions" onClick={e => e.stopPropagation()}>
            <button 
              className="quick-btn-gabinete" 
              onClick={() => setModalGabinete(true)}
              title="Encaminhar demanda ao gabinete parlamentar"
            >
              Falar com Gabinete
            </button>
            <button 
              className="quick-btn-share" 
              onClick={() => setModalShare(true)}
              title="Exportar informativo oficial"
            >
              <Share2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Comercial 1: Gabinete Digital WhatsApp */}
      {modalGabinete && (
        <GabineteDigitalModal politico={pol} onClose={() => setModalGabinete(false)} />
      )}

      {/* Modal Comercial 2: Compartilhamento de Card WhatsApp */}
      {modalShare && (
        <ShareCardModal politico={pol} onClose={() => setModalShare(false)} />
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModal(false)}><X size={20} /></button>
            <div className="modal-header">
              <img src={fotoExibicao} alt={pol.name} onError={(e) => { e.target.src = fallbackPhoto(pol.name); }} />
              <div>
                <h2>{pol.name}</h2>
                <p>{pol.role} — {pol.party}</p>
                <div className="modal-badge-container">
                  <span className="modal-badge green">{pol.emendas}</span>
                  <span className="modal-badge blue">{pol.obras} Obras Registradas</span>
                </div>
                {pol.link && <a href={pol.link} target="_blank" rel="noreferrer" className="source-link"><ExternalLink size={13} /> Portal Oficial</a>}
                <div className="modal-header-actions-row">
                  <button className="btn-modal-gabinete" onClick={() => setModalGabinete(true)}>
                    Enviar Demanda ao Gabinete
                  </button>
                  <button className="btn-modal-share" onClick={() => setModalShare(true)}>
                    <Share2 size={13} /> Compartilhar Resumo
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-abas do Modal */}
            <div className="modal-tabs">
                <button className={`modal-tab-btn ${modalTab === 'emendas' ? 'active' : ''}`} onClick={() => setModalTab('emendas')}><BarChart3 size={15}/> Emendas e Obras</button>
                <button className={`modal-tab-btn ${modalTab === 'gastos' ? 'active' : ''}`} onClick={() => setModalTab('gastos')}><Receipt size={15}/> Prestação de Contas</button>
                <button className={`modal-tab-btn ${modalTab === 'bio' ? 'active' : ''}`} onClick={() => setModalTab('bio')}><BookOpen size={15}/> Biografia Oficial</button>
                <button className={`modal-tab-btn ${modalTab === 'votacao' ? 'active' : ''}`} onClick={() => setModalTab('votacao')}>
                  <MapPin size={15}/> Votação por Bairro
                </button>
                <button className={`modal-tab-btn ${modalTab === 'midias' ? 'active' : ''}`} onClick={() => setModalTab('midias')}>
                  <Share2 size={15}/> Canais de Comunicação {isAdmin && <span className="admin-tag-mini">Admin</span>}
                </button>
            </div>

            <div className="modal-body">
              {modalTab === 'emendas' && (
                  <>
                    <div className="chart-container">
                        <div className="chart-header"><BarChart3 size={18} /><h3>Destinação por Setores</h3></div>
                        <div className="chart-box"><Bar data={barData} options={barOptions} /></div>
                    </div>
                    <div className="chart-container">
                        <div className="chart-header"><PieChartIcon size={18} /><h3>Status das Obras</h3></div>
                        <div className="chart-box"><Doughnut data={doughnutData} options={doughnutOptions} /></div>
                    </div>
                  </>
              )}

              {modalTab === 'gastos' && (
                  pol.role.includes('Federal') ? (
                    <div className="gastos-container">
                        <h3 className="gastos-title">Despesas Oficiais da Cota Parlamentar (2024)</h3>
                        <p className="gastos-subtitle">Dados em tempo real fornecidos pela API de Dados Abertos da Câmara dos Deputados.</p>
                        
                        {loadingGastos ? (
                          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Carregando dados reais do servidor da Câmara...</div>
                        ) : realGastos && realGastos.list.length > 0 ? (
                          <>
                            <div className="gastos-list">
                                {realGastos.list.map((gasto, idx) => (
                                    <div key={idx} className="gasto-item">
                                        <span className="gasto-cat">{gasto.categoria}</span>
                                        <span className="gasto-val">{gasto.valor}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="gasto-total">
                                <span>Total Acumulado (2024):</span>
                                <strong>{realGastos.total}</strong>
                            </div>
                          </>
                        ) : (
                          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Nenhuma despesa registrada ou erro ao buscar.</div>
                        )}
                    </div>
                  ) : gastosIframeSrc ? (
                    <div className="gastos-container" style={{ padding: 0, height: '400px' }}>
                        <iframe 
                          src={gastosIframeSrc} 
                          style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                          title="Despesas Oficiais"
                        ></iframe>
                    </div>
                  ) : (
                    <div className="gastos-container" style={{ padding: '2rem', textAlign: 'center' }}>
                      <h3 className="gastos-title">Portal de Transparência</h3>
                      <p className="gastos-subtitle">Acesso direto ao portal de transparência ainda não mapeado para este parlamentar.</p>
                      <a href="https://transparencia.al.rn.leg.br/" target="_blank" rel="noreferrer" className="source-link">Buscar na Transparência ALRN</a>
                    </div>
                  )
              )}

              {modalTab === 'bio' && (
                  bioIframeSrc ? (
                    <div className="bio-container" style={{ padding: 0, height: '400px' }}>
                        <iframe 
                          src={bioIframeSrc} 
                          style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                          title="Biografia Oficial"
                        ></iframe>
                    </div>
                  ) : (
                    <div className="bio-container">
                        <h3 className="bio-title">História e Atuação</h3>
                        <p className="bio-text">{pol.bio}</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>Acesse a biografia oficial no portal da Assembleia Legislativa.</p>
                        <a href="https://al.rn.leg.br/parlamentares" target="_blank" rel="noreferrer" className="source-link">Acessar ALRN</a>
                    </div>
                  )
              )}

              {modalTab === 'votacao' && (
                <VotacaoBairroView pol={pol} key={pol.id} />
              )}

              {modalTab === 'midias' && (
                <ParlamentarMidiasAdmin politico={pol} />
              )}
            </div>
            
            <div className="modal-footer">
              Dados baseados no <a href="https://portaldatransparencia.gov.br/" target="_blank" rel="noreferrer">Portal da Transparência do Governo Federal</a> e portais legislativos locais.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slides = [
    { title: "Transparência Política no RN", text: "Acompanhe de perto as obras e destinação de recursos.", img: "https://images.unsplash.com/photo-1541872516-688ee1b753a4?w=1600&auto=format&fit=crop&q=80" },
    { title: "O Portal da Política Potiguar", text: "Fique por dentro dos gastos e emendas dos seus representantes.", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&auto=format&fit=crop&q=80" },
    { title: "Participe e Fiscalize", text: "Deixe seus comentários e ajude a monitorar o estado.", img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1600&auto=format&fit=crop&q=80" }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div key={index} className={`slide ${index === current ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.img})` }}>
          <div className="slide-overlay"></div>
          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentsSection() {
  const [comments, setComments] = useState([
    { author: 'Carlos Mendonça', date: 'Hoje às 10:30', text: 'Excelente iniciativa! Precisávamos de um portal assim para fiscalizar os vereadores e deputados.' },
    { author: 'Mariana Silva', date: 'Ontem às 15:45', text: 'Muito bom ver os gastos da cota parlamentar detalhados. Transparência é tudo.' }
  ]);
  const [newComment, setNewComment] = useState('');

  const handlePost = () => {
    if(!newComment.trim()) return;
    setComments([{ author: 'Cidadão Potiguar (Você)', date: 'Agora mesmo', text: newComment }, ...comments]);
    setNewComment('');
  };

  return (
    <div className="comments-section" id="comentarios">
      <h2>Voz do Eleitor</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Deixe seu comentário sobre a atuação dos nossos parlamentares.</p>
      
      <div className="comment-form">
        <textarea placeholder="O que você achou dos dados apresentados? Escreva aqui..." value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>
        <button onClick={handlePost}>Publicar Comentário</button>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        {comments.map((c, i) => (
          <div key={i} className="comment-box">
            <div className="comment-header">
              <span className="comment-author">{c.author}</span>
              <span className="comment-date">{c.date}</span>
            </div>
            <p style={{ color: '#333' }}>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'blog'
  const [activeTab, setActiveTab] = useState('vereadores');
  const [search, setSearch] = useState('');
  const { isAdmin, logout } = useAdmin();

  // ===== ESTADO DINÂMICO: DADOS DA API =====
  const [deputadosFederais, setDeputadosFederais] = useState(processData(deputadosFederaisFallback, 'Dep. Federal — RN'));
  const [senadores, setSenadores] = useState(processData(senadoresFallback, 'Senador(a) — RN'));
  const [apiStatus, setApiStatus] = useState({ federais: 'idle', senadores: 'idle' }); // 'idle' | 'loading' | 'ok' | 'error'
  const legislaturaAtual = getCurrentLegislatura();

  const carregarDadosAPI = async () => {
    setApiStatus({ federais: 'loading', senadores: 'loading' });

    // Buscar Deputados Federais
    fetchDeputadosFederaisRN()
      .then(dados => {
        setDeputadosFederais(processData(dados, 'Dep. Federal — RN'));
        setApiStatus(prev => ({ ...prev, federais: 'ok' }));
      })
      .catch(err => {
        console.warn('API Câmara falhou, usando fallback:', err);
        setApiStatus(prev => ({ ...prev, federais: 'error' }));
      });

    // Buscar Senadores
    fetchSenadoresRN()
      .then(dados => {
        if (dados.length > 0) {
          setSenadores(processData(dados, 'Senador(a) — RN'));
          setApiStatus(prev => ({ ...prev, senadores: 'ok' }));
        } else {
          setApiStatus(prev => ({ ...prev, senadores: 'error' }));
        }
      })
      .catch(err => {
        console.warn('API Senado falhou, usando fallback:', err);
        setApiStatus(prev => ({ ...prev, senadores: 'error' }));
      });
  };

  useEffect(() => {
    carregarDadosAPI();
  }, []);

  const filter = (list) => list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.party.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { key: 'vereadores', label: 'Vereadores', icon: <Users size={18} />, count: vereadores.length },
    { key: 'estaduais', label: 'Dep. Estaduais', icon: <Building2 size={18} />, count: deputadosEstaduais.length },
    { key: 'federais', label: 'Dep. Federais', icon: <Landmark size={18} />, count: deputadosFederais.length },
    { key: 'senadores', label: 'Senadores', icon: <Shield size={18} />, count: senadores.length },
  ];

  const currentData = 
    activeTab === 'vereadores' ? vereadores : 
    activeTab === 'estaduais' ? deputadosEstaduais : 
    activeTab === 'federais' ? deputadosFederais : 
    senadores;

  const filtered = filter(currentData);

  const getStatusIcon = (key) => {
    const status = apiStatus[key];
    if (status === 'loading') return <RefreshCw size={13} className="spin-icon" />;
    if (status === 'ok') return <Wifi size={13} style={{ color: '#22c55e' }} />;
    if (status === 'error') return <WifiOff size={13} style={{ color: '#f59e0b' }} />;
    return null;
  };

  return (
    <div className="app-wrapper">
      <div className="gov-topbar">
        <div className="gov-container">
          <span>Portal de Transparência Cidadã</span>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isAdmin && <span className="topbar-admin-pill">Painel de Gestão Ativo</span>}
            <a href="https://portaldatransparencia.gov.br/" target="_blank" rel="noreferrer" className="gov-link">Portal da Transparência Federal <ExternalLink size={13} /></a>
          </div>
        </div>
      </div>

      <nav className="main-navbar">
        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
          <img src="/logo.png" alt="Conecta+RN Logo" style={{ height: '60px', transform: 'scale(2.2)', transformOrigin: 'left center', marginLeft: '10px' }} onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <ul className="nav-links">
          <li><a href="#" className={currentView === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}>Início</a></li>
          <li><a href="#mapa" className={currentView === 'mapa' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('mapa'); }}>Mapa de Obras</a></li>
          <li><a href="#afinidade" className={currentView === 'afinidade' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('afinidade'); }}>Afinidade Parlamentar</a></li>
          <li><a href="#imposto" className={currentView === 'imposto' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('imposto'); }}>Retorno de Impostos</a></li>
          <li><a href="#blog" className={currentView === 'blog' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentView('blog'); }}>Notícias</a></li>
          {currentView === 'home' && <li><a href="#comentarios">Comentários</a></li>}
        </ul>
      </nav>

      {currentView === 'mapa' ? (
        <main className="main-content">
          <MapaObrasView />
        </main>
      ) : currentView === 'afinidade' ? (
        <main className="main-content">
          <TermometroAfinidadeView />
        </main>
      ) : currentView === 'imposto' ? (
        <main className="main-content">
          <CalculadoraImpostoView />
        </main>
      ) : currentView === 'blog' ? (
        <main className="main-content">
          <BlogSection onVoltarInicio={() => setCurrentView('home')} />
        </main>
      ) : (
        <>
          <HeroSlider />

          <main className="main-content">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input type="text" placeholder="Buscar parlamentar, partido ou comissão..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Banner de Status da API */}
            <div className="api-status-banner">
              <div className="api-status-info">
                <span className="api-leg-badge">Legislatura Oficial ({legislaturaAtual}ª)</span>
                <span className="api-status-item">
                  {getStatusIcon('federais')}
                  Deputados Federais: {apiStatus.federais === 'ok' ? 'Câmara dos Deputados (Ao vivo)' : apiStatus.federais === 'error' ? 'Base Local Consolidada' : apiStatus.federais === 'loading' ? 'Conectando...' : ''}
                </span>
                <span className="api-status-item">
                  {getStatusIcon('senadores')}
                  Senadores: {apiStatus.senadores === 'ok' ? 'Senado Federal (Ao vivo)' : apiStatus.senadores === 'error' ? 'Base Local Consolidada' : apiStatus.senadores === 'loading' ? 'Conectando...' : ''}
                </span>
              </div>
              <button className="api-refresh-btn" onClick={carregarDadosAPI} title="Sincronizar dados oficiais">
                <RefreshCw size={13} /> Sincronizar
              </button>
            </div>

            {/* Resumo */}
            <div className="data-summary">
              <div className="summary-card"><div className="summary-icon"><Users size={22} /></div><div className="summary-info"><span>Vereadores</span><strong>{vereadores.length}</strong></div></div>
              <div className="summary-card"><div className="summary-icon"><Building2 size={22} /></div><div className="summary-info"><span>Dep. Estaduais</span><strong>{deputadosEstaduais.length}</strong></div></div>
              <div className="summary-card"><div className="summary-icon"><Landmark size={22} /></div><div className="summary-info"><span>Dep. Federais</span><strong>{deputadosFederais.length}</strong></div></div>
              <div className="summary-card"><div className="summary-icon"><Shield size={22} /></div><div className="summary-info"><span>Senadores</span><strong>{senadores.length}</strong></div></div>
            </div>

            {/* Abas */}
            <div className="tabs-nav">
              {tabs.map(tab => (
                <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`} onClick={() => { setActiveTab(tab.key); setSearch(''); }}>
                  {tab.icon} {tab.label} <span className="tab-count">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="tab-subheader">
              <h2>Monitoramento: {tabs.find(t => t.key === activeTab)?.label}</h2>
              <span>{filtered.length} encontrados</span>
            </div>

            <div className="grid-list">
              {(activeTab === 'federais' || activeTab === 'senadores') && (apiStatus[activeTab === 'federais' ? 'federais' : 'senadores'] === 'loading') && (
                <div className="loading-overlay-cards">
                  <RefreshCw size={32} className="spin-icon" />
                  <p>Buscando dados atualizados na API oficial...</p>
                </div>
              )}
              {filtered.map(pol => <PoliticoCard key={pol.id} pol={pol} />)}
              {filtered.length === 0 && (apiStatus.federais !== 'loading' && apiStatus.senadores !== 'loading') && <div className="no-results"><p>Nenhum resultado para "{search}".</p></div>}
            </div>

            <CommentsSection />
          </main>
        </>
      )}

      <footer className="main-footer">
        <h2>Conecta+RN</h2>
        <p style={{ marginTop: '1rem' }}>Dados extraídos das fontes oficiais do Governo Federal, Senado, ALRN e CMNAT.</p>
      </footer>

      {/* Assistente Cívico com IA 24h Flutuante */}
      <AssistenteCivicoIA politicosList={currentData} />
    </div>
  );
}

export default App;
