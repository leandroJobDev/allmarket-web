#!/bin/bash

# Script para preparar o build para deploy no Vercel monolítico

echo "Preparando estrutura para Vercel..."

# Cria diretório de saída
mkdir -p dist/apps

# Copia os builds para a estrutura correta
echo "Copiando arquivos..."

# Verifica se os builds existem
if [ ! -d "dist/apps/allmarket" ]; then
  echo "Erro: Build do allmarket não encontrado!"
  exit 1
fi

echo "✓ Estrutura preparada para Vercel"
echo "  - Shell: /apps/allmarket"
echo "  - Notas MFE: /apps/notas_mfe"
echo "  - Análise MFE: /apps/analise_mfe"
echo "  - Comparador MFE: /apps/comparador_mfe"
echo "  - Listas MFE: /apps/listas_mfe"
