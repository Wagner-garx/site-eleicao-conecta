import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('conecta_rn_is_admin') === 'true';
  });

  const [parlamentarExtras, setParlamentarExtras] = useState(() => {
    const saved = localStorage.getItem('conecta_rn_parlamentar_extras');
    return saved ? JSON.parse(saved) : {};
  });

  const [blogPosts, setBlogPosts] = useState(() => {
    const saved = localStorage.getItem('conecta_rn_blog_posts');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'post-1',
        title: 'Como as emendas parlamentares impactam a saúde e infraestrutura no RN',
        summary: 'Entenda os caminhos dos recursos públicos federais e estaduais destinados às prefeituras do Rio Grande do Norte.',
        content: `As emendas parlamentares são instrumentos fundamentais no orçamento brasileiro. Elas permitem que deputados federais, estaduais e senadores direcionem recursos diretos para hospitais, obras de pavimentação, compra de ambulâncias e fomento à agricultura familiar.

No Rio Grande do Norte, o monitoramento contínuo das emendas individuais e de bancada ajuda a sociedade civil a garantir que as verbas prometidas cheguem com eficiência às comunidades e não fiquem travadas em trâmites burocráticos.

Acompanhar a execução dessas emendas é um dever cívico e nosso portal oferece as ferramentas necessárias para dar transparência ao cidadão potiguar.`,
        author: 'Wagner Garcia (Administrador)',
        date: '07 de Outubro de 2026',
        category: 'Fiscalização',
        imageUrl: 'https://images.unsplash.com/photo-1541872516-688ee1b753a4?w=1200&auto=format&fit=crop&q=80',
        podcastUrl: 'https://open.spotify.com'
      },
      {
        id: 'post-2',
        title: 'Câmara Municipal de Natal e o novo plano de mobilidade urbana',
        summary: 'Projetos de lei em pauta debatem transporte público e ciclovias para os próximos quatro anos na capital.',
        content: `Os vereadores de Natal têm intensificado as sessões plenárias voltadas para a mobilidade urbana e licitação de transportes.

Com a participação ativa dos cidadãos e das associações de bairro, o objetivo é garantir linhas integradas, renovação de frotas e acessibilidade para pessoas com deficiência física.

Confira aqui as discussões e as propostas protocoladas pelos representantes municipais na Câmara de Natal.`,
        author: 'Redação Conecta+RN',
        date: '05 de Outubro de 2026',
        category: 'Natal/RN',
        imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('conecta_rn_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('conecta_rn_parlamentar_extras', JSON.stringify(parlamentarExtras));
  }, [parlamentarExtras]);

  useEffect(() => {
    localStorage.setItem('conecta_rn_blog_posts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  const login = (password) => {
    // Senha de administração simples e segura localmente
    if (password === 'admin123' || password === 'admin') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const updateParlamentarExtra = (id, data) => {
    setParlamentarExtras(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...data
      }
    }));
  };

  const addBlogPost = (post) => {
    const newPost = {
      ...post,
      id: 'post-' + Date.now(),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      author: 'Administrador'
    };
    setBlogPosts(prev => [newPost, ...prev]);
  };

  const updateBlogPost = (id, updatedFields) => {
    setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteBlogPost = (id) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      login,
      logout,
      parlamentarExtras,
      updateParlamentarExtra,
      blogPosts,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
