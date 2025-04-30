#!/bin/bash
# filepath: /Users/raigomes/Desktop/Portfolio/meu-portfolio/setup-images.sh

echo "🚀 Iniciando a criação da estrutura de imagens para o portfolio..."

# Garantir que a pasta work existe
mkdir -p public/work

# Criar imagem placeholder genérica
echo "📝 Criando imagem placeholder geral..."
touch public/work/placeholder.jpg

# Função para criar a estrutura básica do projeto
create_project_folder() {
  local project=$1
  local title=$2
  
  echo "🏗️  Criando estrutura para projeto: $title ($project)"
  
  # Criar diretórios
  mkdir -p public/work/$project/gallery
  
  # Criar placeholders para imagens principais
  for type in thumbnail cover background; do
    touch public/work/$project/$type.jpg
    echo "  ✓ $type.jpg"
  done
}

# Função para criar imagens de galeria
create_gallery_images() {
  local project=$1
  local title=$2
  shift 2
  
  echo "🖼️  Criando imagens da galeria para: $title"
  
  # Processar cada imagem passada como argumento
  while (( $# )); do
    local img_name=$1
    local img_title=$2
    local category=$3
    shift 3
    
    # Criar placeholder para cada imagem
    touch public/work/$project/gallery/$img_name
    echo "  ✓ $img_name - $img_title ($category)"
  done
}

# === Projeto 1: Clojel E-commerce ===
create_project_folder "clojel" "Clojel E-commerce"

# Nota: background.png já existe para clojel
create_gallery_images "clojel" "Clojel E-commerce" \
  "background.png" "Clojel Screenshot" "E-commerce" \
  "leveldesign.jpg" "Level Design" "E-commerce" \
  "characters.jpg" "Character Selection" "UI Design"

# === Projeto 2: Studant Ekonomi App ===
create_project_folder "studantEkonomiApp" "Studant Ekonomi App"

create_gallery_images "studantEkonomiApp" "Studant Ekonomi App" \
  "components.jpg" "Component Library" "UI Design" \
  "colors.jpg" "Color System" "UI Design" \
  "documentation.jpg" "Documentation" "Features"

# === Projeto 3: Travel Buddy ===
create_project_folder "travelBuddy" "Travel Buddy"

create_gallery_images "travelBuddy" "Travel Buddy" \
  "homepage.jpg" "Homepage" "Final Product" \
  "projects.jpg" "Projects Grid" "UI Design" \
  "chatbot.jpg" "AI Chatbot Interface" "Features" \
  "mobile-view.jpg" "Mobile Interface" "Responsive Design"

# === Projeto 4: Diana Landing Page ===
create_project_folder "dianaLandingPage" "Diana Landing Page"

create_gallery_images "dianaLandingPage" "Diana Landing Page" \
  "homepage.jpg" "Landing Page" "Final Product" \
  "mobile.jpg" "Mobile Version" "Responsive Design" \
  "features.jpg" "Features Section" "Features"

# === Projeto 5: Macke Up Institute ===
create_project_folder "mackeUpinstitute" "Macke Up Institute"

create_gallery_images "mackeUpinstitute" "Macke Up Institute" \
  "homepage.jpg" "Homepage" "Final Product" \
  "courses.jpg" "Courses Section" "Features" \
  "mobile.jpg" "Mobile View" "Responsive Design" \
  "contact.jpg" "Contact Form" "UI Design"

echo "✅ Estrutura de pastas e imagens criada com sucesso!"
echo ""
echo "📂 Estrutura criada para 5 projetos:"
echo "  - Clojel E-commerce"
echo "  - Studant Ekonomi App"
echo "  - Travel Buddy"
echo "  - Diana Landing Page"
echo "  - Macke Up Institute"
echo ""
echo "🖼️  Substitua os placeholders por suas imagens reais"
echo "🚀 Pronto para implementar no código!"