import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { Camera, Headphones, Share2, Save, Check, Lock, Edit3, Globe, Video, MessageCircle } from 'lucide-react';

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
);

const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
);

export function ParlamentarMidiasAdmin({ politico }) {
  const { isAdmin, parlamentarExtras, updateParlamentarExtra } = useAdmin();
  const extra = parlamentarExtras[politico.id] || {};

  const [isEditing, setIsEditing] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(extra.foto || '');
  const [podcastUrl, setPodcastUrl] = useState(extra.podcast || '');
  const [podcastTitulo, setPodcastTitulo] = useState(extra.podcastTitulo || '');
  const [instagram, setInstagram] = useState(extra.instagram || '');
  const [facebook, setFacebook] = useState(extra.facebook || '');
  const [twitter, setTwitter] = useState(extra.twitter || '');
  const [youtube, setYoutube] = useState(extra.youtube || '');
  const [salvoMsg, setSalvoMsg] = useState(false);

  const handleSalvar = (e) => {
    e.preventDefault();
    updateParlamentarExtra(politico.id, {
      foto: fotoUrl,
      podcast: podcastUrl,
      podcastTitulo: podcastTitulo,
      instagram,
      facebook,
      twitter,
      youtube
    });
    setSalvoMsg(true);
    setTimeout(() => setSalvoMsg(false), 3000);
    setIsEditing(false);
  };

  const hasMidias = extra.foto || extra.podcast || extra.instagram || extra.facebook || extra.twitter || extra.youtube;

  return (
    <div className="midias-parlamentar-section">
      <div className="midias-header">
        <div>
          <h3 className="midias-title">Mídias, Podcasts & Redes Sociais</h3>
          <p className="midias-subtitle">
            Informações complementares do parlamentar {politico.name}.
          </p>
        </div>

        {isAdmin && (
          <button 
            className="admin-edit-toggle-btn" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 size={15} /> {isEditing ? 'Fechar Edição' : 'Editar Dados (Admin)'}
          </button>
        )}
      </div>

      {/* Formulário visível APENAS para o Administrador quando ativado */}
      {isAdmin && isEditing && (
        <form onSubmit={handleSalvar} className="parlamentar-admin-form">
          <div className="admin-form-alert">
            <Lock size={15} /> <strong>Área do Administrador:</strong> Preencha os campos abaixo para alimentar as mídias deste parlamentar.
          </div>

          <div className="admin-form-group">
            <label><Camera size={15} /> URL da Foto Personalizada:</label>
            <input 
              type="url" 
              placeholder="https://exemplo.com/foto-oficial.jpg" 
              value={fotoUrl} 
              onChange={e => setFotoUrl(e.target.value)} 
            />
            <small>Substitui a imagem padrão deste parlamentar no portal.</small>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group flex-1">
              <label><Headphones size={15} /> Link do Podcast / Episódio:</label>
              <input 
                type="url" 
                placeholder="https://spotify.com/... ou YouTube" 
                value={podcastUrl} 
                onChange={e => setPodcastUrl(e.target.value)} 
              />
            </div>
            <div className="admin-form-group flex-1">
              <label>Nome / Tema do Podcast:</label>
              <input 
                type="text" 
                placeholder="Ex: Entrevista sobre Saúde no RN - Ep 14" 
                value={podcastTitulo} 
                onChange={e => setPodcastTitulo(e.target.value)} 
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label><Share2 size={15} /> Redes Sociais:</label>
            <div className="social-inputs-grid">
              <div className="social-input-item">
                <InstagramIcon size={16} />
                <input 
                  type="text" 
                  placeholder="Instagram (@usuario ou link)" 
                  value={instagram} 
                  onChange={e => setInstagram(e.target.value)} 
                />
              </div>
              <div className="social-input-item">
                <FacebookIcon size={16} />
                <input 
                  type="text" 
                  placeholder="Facebook (link do perfil)" 
                  value={facebook} 
                  onChange={e => setFacebook(e.target.value)} 
                />
              </div>
              <div className="social-input-item">
                <TwitterIcon size={16} />
                <input 
                  type="text" 
                  placeholder="Twitter / X (@usuario)" 
                  value={twitter} 
                  onChange={e => setTwitter(e.target.value)} 
                />
              </div>
              <div className="social-input-item">
                <YoutubeIcon size={16} />
                <input 
                  type="text" 
                  placeholder="Canal no YouTube (link)" 
                  value={youtube} 
                  onChange={e => setYoutube(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancelar</button>
            <button type="submit" className="btn-save-admin">
              <Save size={15} /> Salvar Alterações
            </button>
          </div>
        </form>
      )}

      {salvoMsg && (
        <div className="admin-success-toast">
          <Check size={16} /> Dados salvos com sucesso!
        </div>
      )}

      {/* Visualização pública (Para os visitantes normais e admins) */}
      <div className="midias-display-container">
        {/* Bloco de Podcast */}
        {extra.podcast ? (
          <div className="midia-podcast-card">
            <div className="podcast-icon-bubble">
              <Headphones size={24} />
            </div>
            <div className="podcast-details">
              <h4>🎙️ {extra.podcastTitulo || 'Podcast com o Parlamentar'}</h4>
              <p>Ouça as propostas, entrevistas e posicionamentos em áudio/vídeo.</p>
              <a href={extra.podcast} target="_blank" rel="noreferrer" className="btn-ouvir-podcast">
                Acessar Podcast / Entrevista →
              </a>
            </div>
          </div>
        ) : (
          !isAdmin && (
            <div className="midia-empty-hint">
              <Headphones size={18} /> Nenhum podcast vinculado até o momento.
            </div>
          )
        )}

        {/* Bloco de Redes Sociais */}
        {(extra.instagram || extra.facebook || extra.twitter || extra.youtube) ? (
          <div className="midias-social-box">
            <h4>Canais e Redes Oficiais</h4>
            <div className="social-buttons-list">
              {extra.instagram && (
                <a 
                  href={extra.instagram.startsWith('http') ? extra.instagram : `https://instagram.com/${extra.instagram.replace('@', '')}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-btn instagram"
                >
                  <InstagramIcon size={17} /> Instagram
                </a>
              )}
              {extra.facebook && (
                <a 
                  href={extra.facebook.startsWith('http') ? extra.facebook : `https://facebook.com/${extra.facebook}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-btn facebook"
                >
                  <FacebookIcon size={17} /> Facebook
                </a>
              )}
              {extra.twitter && (
                <a 
                  href={extra.twitter.startsWith('http') ? extra.twitter : `https://twitter.com/${extra.twitter.replace('@', '')}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-btn twitter"
                >
                  <TwitterIcon size={17} /> X / Twitter
                </a>
              )}
              {extra.youtube && (
                <a 
                  href={extra.youtube.startsWith('http') ? extra.youtube : `https://youtube.com/${extra.youtube}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-btn youtube"
                >
                  <YoutubeIcon size={17} /> YouTube
                </a>
              )}
            </div>
          </div>
        ) : (
          !isAdmin && (
            <div className="midia-empty-hint">
              <Share2 size={18} /> Redes sociais oficiais em processo de homologação.
            </div>
          )
        )}

        {/* Caso seja admin e não tenha dados ainda */}
        {isAdmin && !hasMidias && !isEditing && (
          <div className="admin-empty-cta">
            <p>Nenhuma mídia ou podcast cadastrado para este parlamentar.</p>
            <button onClick={() => setIsEditing(true)}>Clique aqui para inserir fotos, podcasts e redes</button>
          </div>
        )}
      </div>
    </div>
  );
}
