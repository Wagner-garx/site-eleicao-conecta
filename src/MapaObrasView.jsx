import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Building, Filter, CheckCircle, Clock, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';

// Correção dos ícones padrão do Leaflet no Vite
const createCustomIcon = (tipo) => {
  const cor = tipo === 'concluida' ? '#16a34a' : tipo === 'andamento' ? '#2563eb' : '#d97706';
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background-color: ${cor};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 13px;
      font-weight: bold;
    ">📍</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
};

// Dados de Obras e Emendas Geolocalizadas (Natal e RN)
const mockObrasGeolocalizadas = [
  {
    id: 1,
    titulo: 'Reforma e Ampliação da UBS Alecrim',
    parlamentar: 'Camila Araújo',
    cargo: 'Dep. Estadual',
    cidade: 'Natal',
    bairro: 'Alecrim',
    lat: -5.7983,
    lng: -35.2255,
    valor: 'R$ 650.000',
    status: 'concluida',
    statusLabel: 'Concluída',
    ano: '2024',
    setor: 'Saúde'
  },
  {
    id: 2,
    titulo: 'Pavimentação Asfáltica e Drenagem no Bairro Nordeste',
    parlamentar: 'Nina Souza',
    cargo: 'Vereadora',
    cidade: 'Natal',
    bairro: 'Bairro Nordeste',
    lat: -5.8115,
    lng: -35.2341,
    valor: 'R$ 480.000',
    status: 'andamento',
    statusLabel: 'Em Andamento',
    ano: '2025',
    setor: 'Infraestrutura'
  },
  {
    id: 3,
    titulo: 'Modernização da Iluminação em LED na Orla de Ponta Negra',
    parlamentar: 'Robson Carvalho',
    cargo: 'Vereador',
    cidade: 'Natal',
    bairro: 'Ponta Negra',
    lat: -5.8824,
    lng: -35.1764,
    valor: 'R$ 320.000',
    status: 'concluida',
    statusLabel: 'Concluída',
    ano: '2024',
    setor: 'Iluminação'
  },
  {
    id: 4,
    titulo: 'Construção da Nova Creche Comunitária em Felipe Camarão',
    parlamentar: 'Divaneide Basílio',
    cargo: 'Dep. Estadual',
    cidade: 'Natal',
    bairro: 'Felipe Camarão',
    lat: -5.8347,
    lng: -35.2530,
    valor: 'R$ 890.000',
    status: 'andamento',
    statusLabel: 'Em Andamento',
    ano: '2025',
    setor: 'Educação'
  },
  {
    id: 5,
    titulo: 'Reforma do Mercado Público de Mossoró',
    parlamentar: 'Rogério Marinho',
    cargo: 'Senador',
    cidade: 'Mossoró',
    bairro: 'Centro',
    lat: -5.1878,
    lng: -37.3441,
    valor: 'R$ 2.400.000',
    status: 'andamento',
    statusLabel: 'Em Andamento',
    ano: '2024',
    setor: 'Infraestrutura'
  },
  {
    id: 6,
    titulo: 'Aquisição de Tomógrafo para Hospital Regional de Caicó',
    parlamentar: 'Zenaide Maia',
    cargo: 'Senadora',
    cidade: 'Caicó',
    bairro: 'Penedo',
    lat: -6.4589,
    lng: -37.0984,
    valor: 'R$ 1.800.000',
    status: 'concluida',
    statusLabel: 'Concluída',
    ano: '2024',
    setor: 'Saúde'
  },
  {
    id: 7,
    titulo: 'Saneamento e Calçamento no Bairro Boa Passagem',
    parlamentar: 'Ezequiel Ferreira',
    cargo: 'Dep. Estadual',
    cidade: 'Caicó',
    bairro: 'Boa Passagem',
    lat: -6.4475,
    lng: -37.0850,
    valor: 'R$ 750.000',
    status: 'licitacao',
    statusLabel: 'Em Licitação',
    ano: '2025',
    setor: 'Saneamento'
  },
  {
    id: 8,
    titulo: 'Recapeamento da Av. João Medeiros Filho (Zona Norte)',
    parlamentar: 'General Girão',
    cargo: 'Dep. Federal',
    cidade: 'Natal',
    bairro: 'Potengi',
    lat: -5.7530,
    lng: -35.2580,
    valor: 'R$ 1.500.000',
    status: 'concluida',
    statusLabel: 'Concluída',
    ano: '2024',
    setor: 'Mobilidade'
  }
];

// Componente para recentralizar o mapa suavemente ao clicar numa cidade
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function MapaObrasView() {
  const [cidadeFiltro, setCidadeFiltro] = useState('TODAS');
  const [bairroFiltro, setBairroFiltro] = useState('TODOS');
  const [setorFiltro, setSetorFiltro] = useState('TODOS');
  const [selectedObra, setSelectedObra] = useState(null);

  // Centros de mapa padrão
  const coordenadasCentros = {
    TODAS: { center: [-5.79448, -35.211], zoom: 8 },
    Natal: { center: [-5.815, -35.21], zoom: 12 },
    Mossoró: { center: [-5.1878, -37.3441], zoom: 13 },
    Caicó: { center: [-6.4589, -37.0984], zoom: 13 }
  };

  const obrasFiltradas = mockObrasGeolocalizadas.filter(obra => {
    if (cidadeFiltro !== 'TODAS' && obra.cidade !== cidadeFiltro) return false;
    if (bairroFiltro !== 'TODOS' && obra.bairro !== bairroFiltro) return false;
    if (setorFiltro !== 'TODOS' && obra.setor !== setorFiltro) return false;
    return true;
  });

  const bairrosDisponiveis = Array.from(new Set(
    mockObrasGeolocalizadas
      .filter(o => cidadeFiltro === 'TODAS' || o.cidade === cidadeFiltro)
      .map(o => o.bairro)
  ));

  const totalInvestido = obrasFiltradas.reduce((acc, curr) => {
    const limpo = parseFloat(curr.valor.replace('R$ ', '').replace('.', '').replace('.', '').replace(',', '.'));
    return acc + limpo;
  }, 0);

  const centerConfig = coordenadasCentros[cidadeFiltro] || coordenadasCentros.TODAS;

  return (
    <div className="mapa-obras-wrapper">
      <div className="mapa-header-box">
        <div>
          <span className="badge-comercial-pro">Distribuição Georreferenciada</span>
          <h2>Mapeamento de Obras e Emendas</h2>
          <p>Localização auditada das intervenções públicas e recursos destinados aos municípios do Rio Grande do Norte.</p>
        </div>

        <div className="mapa-stats-box">
          <div className="mapa-stat-item">
            <span>Obras Mapeadas</span>
            <strong>{obrasFiltradas.length}</strong>
          </div>
          <div className="mapa-stat-item highlight">
            <span>Recursos Destinados</span>
            <strong>R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</strong>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Inteligentes */}
      <div className="mapa-filtros-bar">
        <div className="filtro-campo">
          <label><MapPin size={14} /> Cidade / Região:</label>
          <select 
            value={cidadeFiltro} 
            onChange={e => {
              setCidadeFiltro(e.target.value);
              setBairroFiltro('TODOS');
            }}
          >
            <option value="TODAS">Todo o RN (Visão Geral)</option>
            <option value="Natal">Natal / Capital</option>
            <option value="Mossoró">Mossoró / Oeste</option>
            <option value="Caicó">Caicó / Seridó</option>
          </select>
        </div>

        <div className="filtro-campo">
          <label><Building size={14} /> Bairro / Comunidade:</label>
          <select value={bairroFiltro} onChange={e => setBairroFiltro(e.target.value)}>
            <option value="TODOS">Todos os Bairros</option>
            {bairrosDisponiveis.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="filtro-campo">
          <label><Filter size={14} /> Setor de Destinação:</label>
          <select value={setorFiltro} onChange={e => setSetorFiltro(e.target.value)}>
            <option value="TODOS">Todos os Setores</option>
            <option value="Saúde">Saúde</option>
            <option value="Infraestrutura">Infraestrutura</option>
            <option value="Educação">Educação</option>
            <option value="Iluminação">Iluminação</option>
            <option value="Mobilidade">Mobilidade</option>
            <option value="Saneamento">Saneamento</option>
          </select>
        </div>
      </div>

      {/* Conteúdo: Mapa + Painel Lateral */}
      <div className="mapa-grid-layout">
        <div className="leaflet-container-wrapper">
          <MapContainer 
            center={centerConfig.center} 
            zoom={centerConfig.zoom} 
            scrollWheelZoom={false}
            style={{ height: '560px', width: '100%', borderRadius: '12px' }}
          >
            <ChangeMapView center={centerConfig.center} zoom={centerConfig.zoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {obrasFiltradas.map(obra => (
              <Marker 
                key={obra.id} 
                position={[obra.lat, obra.lng]}
                icon={createCustomIcon(obra.status)}
                eventHandlers={{
                  click: () => setSelectedObra(obra)
                }}
              >
                <Popup>
                  <div className="map-popup-custom">
                    <strong>{obra.titulo}</strong>
                    <p style={{ margin: '4px 0', fontSize: '12px' }}>
                      <strong>{obra.parlamentar}</strong> ({obra.cargo})
                    </p>
                    <p style={{ color: '#16a34a', fontWeight: 'bold' }}>{obra.valor}</p>
                    <span className={`status-pill ${obra.status}`}>{obra.statusLabel}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Lista Lateral de Obras */}
        <div className="mapa-lista-lateral">
          <h3>Localidades com Obras ({obrasFiltradas.length})</h3>
          <div className="lista-obras-scroll">
            {obrasFiltradas.map(obra => (
              <div 
                key={obra.id} 
                className={`obra-item-card ${selectedObra?.id === obra.id ? 'active' : ''}`}
                onClick={() => setSelectedObra(obra)}
              >
                <div className="obra-item-header">
                  <span className="obra-local"><MapPin size={12} /> {obra.bairro}, {obra.cidade}</span>
                  <span className={`status-pill ${obra.status}`}>{obra.statusLabel}</span>
                </div>
                <h4 className="obra-item-title">{obra.titulo}</h4>
                <div className="obra-item-footer">
                  <span className="obra-autor">{obra.parlamentar}</span>
                  <strong className="obra-valor">{obra.valor}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
