import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { PlusCircle, Trash2, Edit3, Lock, LogIn, LogOut, ArrowLeft, Headphones, Calendar, User, Tag, Sparkles } from 'lucide-react';

export function BlogSection({ onVoltarInicio }) {
  const { isAdmin, blogPosts, addBlogPost, deleteBlogPost, updateBlogPost, login, logout } = useAdmin();
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Formulário de publicação estilo WordPress/CMS
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Notícias');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formPodcastUrl, setFormPodcastUrl] = useState('');

  const openNewPostForm = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormCategory('Notícias');
    setFormSummary('');
    setFormContent('');
    setFormImageUrl('');
    setFormPodcastUrl('');
    setShowEditor(true);
  };

  const openEditPostForm = (post) => {
    setEditingPostId(post.id);
    setFormTitle(post.title);
    setFormCategory(post.category || 'Notícias');
    setFormSummary(post.summary || '');
    setFormContent(post.content || '');
    setFormImageUrl(post.imageUrl || '');
    setFormPodcastUrl(post.podcastUrl || '');
    setShowEditor(true);
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert('Por favor, preencha o título e o conteúdo da matéria.');
      return;
    }

    const postData = {
      title: formTitle,
      category: formCategory,
      summary: formSummary || formContent.slice(0, 140) + '...',
      content: formContent,
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1541872516-688ee1b753a4?w=1200&auto=format&fit=crop&q=80',
      podcastUrl: formPodcastUrl
    };

    if (editingPostId) {
      updateBlogPost(editingPostId, postData);
      if (selectedPost && selectedPost.id === editingPostId) {
        setSelectedPost({ ...selectedPost, ...postData });
      }
    } else {
      addBlogPost(postData);
    }

    setShowEditor(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = login(loginPass);
    if (success) {
      setShowLoginModal(false);
      setLoginPass('');
      setLoginError('');
    } else {
      setLoginError('Senha incorreta! (Dica padrão: admin123)');
    }
  };

  return (
    <div className="blog-wrapper">
      {/* Barra superior de status do Blog e Painel Admin */}
      <div className="blog-header-bar">
        <div>
          <button className="blog-back-btn" onClick={onVoltarInicio}>
            <ArrowLeft size={16} /> Voltar ao Painel Parlamentar
          </button>
          <h1 className="blog-main-title">Publicações & Notícias Parlamentares</h1>
          <p className="blog-main-subtitle">Acompanhe reportagens, análises da conjuntura política potiguar e prestações de contas.</p>
        </div>

        <div className="blog-auth-actions">
          {isAdmin ? (
            <div className="admin-status-badge">
              <span className="admin-pill">
                Modo Editor Chefe
              </span>
              <button className="admin-btn-logout" onClick={logout} title="Encerrar sessão de editor">
                <LogOut size={13} /> Sair
              </button>
            </div>
          ) : (
            <button className="admin-btn-login" onClick={() => setShowLoginModal(true)}>
              <Lock size={13} /> Acesso de Redação
            </button>
          )}
        </div>
      </div>

      {/* Barra de controle exclusiva do Administrador (Igual WordPress) */}
      {isAdmin && (
        <div className="wordpress-admin-bar">
          <div className="wordpress-admin-bar-info">
            <strong>Painel de Gestão Editorial:</strong> Sessão ativa para redigir, editar e arquivar matérias do portal.
          </div>
          <button className="admin-create-post-btn" onClick={openNewPostForm}>
            <PlusCircle size={15} /> Nova Matéria
          </button>
        </div>
      )}

      {/* Modal de Login Administrativo */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="admin-login-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-login">
              <Lock size={24} style={{ color: 'var(--brasil-blue)' }} />
              <h3>Acesso de Administrador</h3>
              <p>Área restrita para redatores e administradores do portal gerenciarem postagens e mídias.</p>
            </div>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Senha de Acesso</label>
                <input 
                  type="password" 
                  placeholder="Digite a senha (padrão: admin123)" 
                  value={loginPass} 
                  onChange={e => setLoginPass(e.target.value)} 
                  autoFocus
                />
              </div>
              {loginError && <p className="admin-error-msg">{loginError}</p>}
              <div className="modal-actions-login">
                <button type="button" className="btn-cancel" onClick={() => setShowLoginModal(false)}>Cancelar</button>
                <button type="submit" className="btn-confirm-login"><LogIn size={16} /> Entrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editor estilo WordPress / Post Editor */}
      {showEditor && (
        <div className="modal-overlay" onClick={() => setShowEditor(false)}>
          <div className="editor-modal-container" onClick={e => e.stopPropagation()}>
            <div className="editor-header">
              <h2>{editingPostId ? 'Editar Publicação' : 'Criar Nova Publicação — Estilo WordPress'}</h2>
              <button className="editor-close-btn" onClick={() => setShowEditor(false)}>✕</button>
            </div>
            <form onSubmit={handleSavePost} className="editor-form">
              <div className="editor-row">
                <div className="form-group flex-2">
                  <label>Título do Post *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Novos investimentos aprovados para a Grande Natal..." 
                    value={formTitle} 
                    onChange={e => setFormTitle(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Categoria</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)}>
                    <option value="Notícias">Notícias</option>
                    <option value="Fiscalização">Fiscalização</option>
                    <option value="Natal/RN">Natal/RN</option>
                    <option value="Interior Potiguar">Interior Potiguar</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Opinião">Opinião</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Resumo Breve (Exibido no card)</label>
                <input 
                  type="text" 
                  placeholder="Uma linha explicativa sobre a matéria..." 
                  value={formSummary} 
                  onChange={e => setFormSummary(e.target.value)} 
                />
              </div>

              <div className="editor-row">
                <div className="form-group flex-1">
                  <label>URL da Imagem de Destaque</label>
                  <input 
                    type="url" 
                    placeholder="https://exemplo.com/foto.jpg" 
                    value={formImageUrl} 
                    onChange={e => setFormImageUrl(e.target.value)} 
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Link do Podcast / Áudio (Opcional)</label>
                  <input 
                    type="url" 
                    placeholder="Spotify, YouTube ou link de áudio..." 
                    value={formPodcastUrl} 
                    onChange={e => setFormPodcastUrl(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Conteúdo Completo da Matéria *</label>
                <textarea 
                  rows={8} 
                  placeholder="Escreva o texto completo da matéria aqui..." 
                  value={formContent} 
                  onChange={e => setFormContent(e.target.value)} 
                  required
                ></textarea>
              </div>

              <div className="editor-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowEditor(false)}>Descartar</button>
                <button type="submit" className="btn-publish">Publicar Matéria</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leitor de Post Único Aberto */}
      {selectedPost ? (
        <article className="single-post-view">
          <button className="post-back-link" onClick={() => setSelectedPost(null)}>
            ← Voltar para todos os posts
          </button>
          
          <div className="single-post-header">
            <span className="post-category-tag">{selectedPost.category || 'Geral'}</span>
            <h1 className="single-post-title">{selectedPost.title}</h1>
            <div className="single-post-meta">
              <span><User size={14} /> {selectedPost.author}</span>
              <span><Calendar size={14} /> {selectedPost.date}</span>
            </div>
          </div>

          {selectedPost.imageUrl && (
            <div className="single-post-featured-image">
              <img src={selectedPost.imageUrl} alt={selectedPost.title} />
            </div>
          )}

          {selectedPost.podcastUrl && (
            <div className="podcast-player-box">
              <Headphones size={24} />
              <div>
                <strong>Episódio de Podcast / Mídia Vinculada:</strong>
                <p>Ouça os comentários sobre esta matéria através do link do produtor.</p>
              </div>
              <a href={selectedPost.podcastUrl} target="_blank" rel="noreferrer" className="podcast-listen-btn">
                Ouvir Podcast
              </a>
            </div>
          )}

          <div className="single-post-body">
            {selectedPost.content.split('\n\n').map((paragrafo, idx) => (
              <p key={idx}>{paragrafo}</p>
            ))}
          </div>

          {isAdmin && (
            <div className="single-post-admin-controls">
              <button className="btn-edit-post" onClick={() => openEditPostForm(selectedPost)}>
                <Edit3 size={15} /> Editar Esta Matéria
              </button>
              <button className="btn-delete-post" onClick={() => {
                if (window.confirm('Tem certeza que deseja apagar esta matéria?')) {
                  deleteBlogPost(selectedPost.id);
                  setSelectedPost(null);
                }
              }}>
                <Trash2 size={15} /> Excluir Matéria
              </button>
            </div>
          )}
        </article>
      ) : (
        /* Grade de Posts do Blog */
        <div className="blog-posts-grid">
          {blogPosts.map(post => (
            <div key={post.id} className="blog-card" onClick={() => setSelectedPost(post)}>
              <div className="blog-card-media">
                <img src={post.imageUrl || 'https://images.unsplash.com/photo-1541872516-688ee1b753a4?w=600&auto=format&fit=crop&q=80'} alt={post.title} />
                <span className="blog-card-cat">{post.category || 'Notícias'}</span>
              </div>
              <div className="blog-card-body">
                <div className="blog-card-date">
                  <Calendar size={13} /> {post.date}
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.summary || post.content.slice(0, 110) + '...'}</p>
                
                <div className="blog-card-footer">
                  <span className="blog-read-more">Ler matéria completa →</span>
                  {post.podcastUrl && (
                    <span className="blog-has-audio" title="Inclui podcast">
                      <Headphones size={15} />
                    </span>
                  )}
                </div>
              </div>

              {/* Botões rápidos de admin em cada card */}
              {isAdmin && (
                <div className="blog-card-admin-actions" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEditPostForm(post)} title="Editar Matéria">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => {
                    if (window.confirm(`Deseja mesmo excluir o post "${post.title}"?`)) {
                      deleteBlogPost(post.id);
                    }
                  }} title="Excluir Matéria">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
