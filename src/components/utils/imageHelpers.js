/**
 * Categorias para imagens de projeto
 */
export const imageCategories = {
  UI_DESIGN: 'UI Design',
  WIREFRAMES: 'Wireframes',
  PROTOTYPES: 'Prototypes',
  FINAL_PRODUCT: 'Final Product',
  GAMEPLAY: 'Gameplay',
  FEATURES: 'Features',
  ECOMMERCE: 'E-commerce',
  CONCEPT_ART: 'Concept Art',
  RESPONSIVE: 'Responsive Design'
};

/**
 * Função para obter caminhos de imagens para um projeto
 * 
 * @param {string} projectId - ID do projeto (usado como nome da pasta)
 * @param {Object} options - Opções adicionais
 * @returns {Object} Objeto com os caminhos das imagens
 */
export const getProjectImages = (projectId, options = {}) => {
  // Base URL para as imagens do projeto - adiciona o prefixo correto
  const baseUrl = `/public/work/${projectId}/`;
  
  // Imagem de fallback para casos de erro
  const FALLBACK_IMAGE = "/public/work/placeholder.jpg";
  
  // Determinar se usamos png ou jpg para o background (tratando caso especial)
  const bgExtension = projectId === 'clojel' ? 'png' : 'jpg';
  
  // Imagens principais
  const mainImages = {
    thumbnail: `${baseUrl}thumbnail.jpg`,
    cover: `${baseUrl}cover.jpg`,
    backgroundImage: `${baseUrl}background.${bgExtension}`
  };
  
  // Se o projeto não tiver galeria, retorna apenas as imagens principais
  if (options.noGallery) {
    return mainImages;
  }
  
  // Galeria de imagens
  let gallery = [];
  
  // Se galleryItems for fornecido, usa-o para criar a galeria
  if (options.galleryItems && Array.isArray(options.galleryItems)) {
    gallery = options.galleryItems.map(item => ({
      url: `${baseUrl}gallery/${item.filename}`,
      title: item.title || 'Project Image',
      caption: item.caption || '',
      category: item.category || imageCategories.FINAL_PRODUCT,
      tags: item.tags || []
    }));
  }
  
  // Retorna todas as imagens
  return {
    ...mainImages,
    gallery,
    // Função para verificar erros e usar fallback
    getFallbackUrl: (url) => {
      if (!url) return FALLBACK_IMAGE;
      return url;
    }
  };
};

/**
 * Função para verificar se uma imagem existe e retornar um fallback se necessário
 * @param {string} imageUrl - URL da imagem a ser verificada
 * @returns {Promise<string>} URL válida ou fallback
 */
export const verifyImageOrFallback = async (imageUrl) => {
  const FALLBACK_IMAGE = "/public/work/placeholder.jpg";
  
  if (!imageUrl) return FALLBACK_IMAGE;
  
  // Adicionar prefixo se ainda não estiver lá
  let correctedUrl = imageUrl;
  if (!imageUrl.startsWith('/public') && imageUrl.includes('/work/')) {
    correctedUrl = `/public${imageUrl}`;
  }
  
  try {
    const response = await fetch(correctedUrl, { method: 'HEAD' });
    if (response.ok) {
      return correctedUrl;
    }
    
    // Se falhar com o prefixo, tenta sem o prefixo
    if (correctedUrl.startsWith('/public')) {
      const withoutPrefix = correctedUrl.replace('/public', '');
      const fallbackResponse = await fetch(withoutPrefix, { method: 'HEAD' });
      if (fallbackResponse.ok) {
        return withoutPrefix;
      }
    }
    
    return FALLBACK_IMAGE;
  } catch (error) {
    console.error(`Erro verificando imagem ${correctedUrl}:`, error);
    
    // Tenta sem o prefixo como último recurso
    if (correctedUrl.startsWith('/public')) {
      try {
        const withoutPrefix = correctedUrl.replace('/public', '');
        const fallbackResponse = await fetch(withoutPrefix, { method: 'HEAD' });
        if (fallbackResponse.ok) {
          return withoutPrefix;
        }
      } catch (e) {
        // Silenciosamente falha e retorna o fallback
      }
    }
    
    return FALLBACK_IMAGE;
  }
};

/**
 * Obtém todas as tags únicas presentes nos projetos
 * 
 * @param {Array} projects - Array de objetos de projeto
 * @returns {Array} Array de strings com as tags únicas
 */
export const getAllProjectTags = (projects) => {
  const tagsSet = new Set();
  
  if (!projects || !Array.isArray(projects)) return [];
  
  projects.forEach(project => {
    if (project.tags && Array.isArray(project.tags)) {
      project.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet);
};

/**
 * Obtém todas as categorias de imagem únicas presentes nos projetos
 * 
 * @param {Array} projects - Array de objetos de projeto
 * @returns {Array} Array de strings com as categorias únicas
 */
export const getAllImageCategories = (projects) => {
  const categoriesSet = new Set();
  
  if (!projects || !Array.isArray(projects)) return [];
  
  projects.forEach(project => {
    if (project.imageCategories && Array.isArray(project.imageCategories)) {
      project.imageCategories.forEach(category => categoriesSet.add(category));
    }
  });
  
  return Array.from(categoriesSet);
};