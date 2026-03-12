# 🛒 AllM@rket - Escaneia Examina Economiza

> **Plataforma escalável de gestão de consumo e inteligência de dados fiscais.**

O **AllM@rket** é uma solução de alta performance que automatiza a extração de dados de notas fiscais (SEFAZ) via QR Code. O sistema foi projetado sob a arquitetura de **Micro-frontends (MFE)** dentro de um **Nx Monorepo**, garantindo isolamento de domínios, escalabilidade horizontal e entregas independentes.

---

## ✨ Demonstração

<p align="center">
<img src="./assets/img/demo.gif" alt="AllMarket MFE Demo" width="380">
</p>

---

💡 O Conceito 3E: Do Papel à Inteligência
A arquitetura do AllM@rket foi projetada para resolver o ciclo de vida do consumo através de três pilares fundamentais, onde cada um é materializado por um Micro-frontend independente:

Escaneia (notas_mfe): O ponto de entrada. Utiliza integração com a SEFAZ para transformar cupons fiscais físicos em dados digitais estruturados em milissegundos, eliminando a digitação manual.

Examina (analise_mfe): O cérebro do sistema. Processa o histórico de compras para identificar padrões de consumo, variações de preços de itens específicos e métricas de inflação pessoal.

Economiza (comparador_mfe & listas_mfe): O resultado prático.

O Comparador cruza dados de diferentes estabelecimentos para encontrar o melhor custo-benefício.

O Criador de Listas utiliza o histórico examinado para gerar listas de compras inteligentes e preditivas, garantindo que o usuário compre apenas o necessário no lugar mais barato.

---

## 🏗️ Arquitetura de Software

A aplicação rompe com o modelo tradicional, utilizando **Module Federation** para orquestrar verticais de negócio independentes:

### 1. Monorepo & Estrutura de Build

Utilização do **Nx** para gerenciamento de dependências, cache distribuído e governança de código.

* **Shell (allmarket):** Orquestrador principal. Responsável pelo *runtime*, autenticação centralizada (Google Identity Services) e gerenciamento de layout reativo.
* **Micro-frontends (Remotes):**
* `notas_mfe`: Core engine para parsing de QR Codes e gestão de registros fiscais.
* `analise_mfe`: Módulo de inteligência de dados e analytics de consumo.
* `comparador_mfe`: Algoritmo de comparação de preços entre estabelecimentos.
* `listas_mfe`: Gestão reativa de listas de compras e previsão de gastos.



---

## 🛠️ Stack Tecnológica

### Frontend de Última Geração

* **Angular 21:** Implementação moderna com *Standalone Components*, `ApplicationConfig` e novos padrões de injeção de dependência.
* **Angular Material:** UI consistente com componentes robustos (`MatTable`, `MatDialog`, `MatSnackBar`).
* **RxJS State Management:** Gerenciamento de estado reativo via `BehaviorSubject`, garantindo que o Shell e os MFEs reajam em tempo real a mudanças de dados.
* **Module Federation:** Carregamento dinâmico via `@nx/angular/mf`, otimizando o *First Contentful Paint*.

### Autenticação & UI

* **Google Identity Services:** Login seguro e simplificado.
* **Visualização:** Integração com `Chart.js` para relatórios e `SweetAlert2` para interações críticas.
* **Design System:** SCSS modularizado com suporte a variáveis globais para garantir unidade visual entre os micro-apps.

---

## 🚀 Engenharia de Operações (DevOps)

### Infraestrutura Multisite

Deploy automatizado via **Firebase Hosting**, utilizando múltiplos targets para permitir o ciclo de vida independente de cada módulo:

* **Host:** `shell-oficial`
* **Remotes:** `notas-mfe`, `analise-mfe`, `comparador-mfe`, `listas-mfe`

### Comandos de Operação

```bash
# Inicialização do ecossistema completo (Host + Remotes)
npx nx serve allmarket --devRemotes=notas_mfe,analise_mfe

# Build paralelo otimizado por cache de artefatos
npx nx run-many -t build --prod --parallel=3

# Deploy isolado de uma vertical de negócio
firebase deploy --only hosting:notas-mfe

```

---

## ✨ Diferenciais de Engenharia

1. **Lazy Loading Total:** O código de cada MFE só é transferido quando o usuário acessa a funcionalidade, reduzindo drasticamente o carregamento inicial.
2. **Independência de Deploy:** Correções no motor de parsing (`notas_mfe`) são publicadas sem necessidade de re-buildar o sistema de autenticação (`shell`).
3. **Consistência de Estado:** Uso de serviços compartilhados em `shared-libs` para garantir que o estado `temNotas$` seja propagado por todo o ecossistema.
4. **Mobile-First Design:** Interface otimizada para operação rápida em campo, focada na usabilidade em dispositivos móveis.

---
