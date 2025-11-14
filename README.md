# Multi-Service Marketplace

## Visão Geral
Aplicação web construída com Next.js que centraliza comerciantes, produtos e prestadores de serviço em uma experiência única de marketplace para Moçambique. A página inicial destaca seções de destaque, carrossel de estabelecimentos e convites para cadastro, engajando clientes e parceiros logo no primeiro acesso.

## Principais Funcionalidades
- **Catálogo omnicanal de merchants e produtos** – páginas listam estabelecimentos com avaliações, taxas de entrega em Metical (MZN) e vitrines completas com preços promocionais e logística detalhada.
- **Descoberta e filtro de prestadores de serviço** – módulos de serviços disponibilizam filtros por categoria, avaliação e faixa de preço, além de cartões de profissionais com disponibilidade e ação para agendar.
- **Carrinho e checkout completos** – telas de carrinho e checkout consolidam itens, calculam subtotal/taxa/total em MZN e coletam dados do cliente até a confirmação do pedido.
- **Fluxo de agendamento de serviços** – diálogo dedicado permite selecionar serviço, horário e dados do cliente antes de registrar o agendamento.
- **Dashboards operacionais** – telas de merchant e prestador oferecem gestão de catálogo, agenda e pedidos com ações para editar itens e acompanhar receitas.
- **Camada de dados baseada em Redux Toolkit** – slices centralizam estado global de carrinho, pedidos e catálogos, enquanto RTK Query facilita o consumo de APIs multitenant com cabeçalhos dinâmicos.

## Tecnologias
- **Next.js 15 / React 19 / TypeScript** para renderização híbrida e componentes client-side.
- **Redux Toolkit e RTK Query** para gerenciamento de estado e chamadas HTTP tipadas.
- **Radix UI, Tailwind CSS e shadcn/ui** compondo a base de design system e interações.
- **Formatação regional** com Intl para moeda Metical (MZN), datas e números.

## Pré-requisitos
- Node.js 18 ou superior.
- Gerenciador de pacotes (npm, pnpm ou yarn).

## Como executar localmente
1. Instale as dependências: `npm install`
2. Copie o arquivo `.env.example` (quando disponível) e configure as variáveis necessárias.
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis
- `npm run dev` – inicia o modo de desenvolvimento com Fast Refresh.
- `npm run build` – gera o build otimizado da aplicação.
- `npm run start` – sobe o build em modo produção.
- `npm run lint` – executa as verificações de lint do projeto.

## Variáveis de Ambiente
| Variável | Descrição | Padrão |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base das APIs públicas consumidas pelo front-end. | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_TENANT_ID` / `NEXT_PUBLIC_TENANT_SLUG` | Identificador do tenant enviado em cada requisição. | `lisboa` |
| `NEXT_PUBLIC_AUTH_TOKEN_ENDPOINT` | Endpoint opcional para autenticação de token. | Derivado de `NEXT_PUBLIC_API_BASE_URL` |
| `NEXT_PUBLIC_AUTH_PROFILE_ENDPOINT` | Endpoint opcional para recuperar o perfil autenticado. | Derivado de `NEXT_PUBLIC_API_BASE_URL` |
| `POSTGREST_URL` | URL do serviço PostgREST. | *(sem padrão)* |
| `POSTGREST_SCHEMA` | Esquema do PostgREST utilizado nas consultas. | `public` |
| `POSTGREST_API_KEY` | Chave utilizada para autenticar as requisições PostgREST. | *(sem padrão)* |

Execute `validateEnv()` nas rotas Next para garantir que as variáveis críticas do PostgREST estejam definidas durante o build ou execução.

## Estrutura de Pastas
- `src/app` – rotas do Next.js (páginas públicas, dashboards, APIs internas).
- `src/components` – componentes compartilhados, UI e seções reutilizáveis da home.
- `src/lib` – utilitários de formatação, cliente HTTP e integrações externas.
- `src/store` – configuração Redux, slices e hooks RTK Query.
- `src/types` – contratos TypeScript das entidades do marketplace.
- `docs/architecture.md` – visão arquitetural detalhada, diagramas e fluxos de negócio.

## Documentação Adicional
Consulte [`docs/architecture.md`](docs/architecture.md) para diagramas de classes, fluxo de dados e atividades principais do marketplace.
