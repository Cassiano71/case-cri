# Mini Sistema de Captação de Leads

## Sobre o projeto

Este repositório é o case técnico de um mini sistema de captação de leads imobiliários. Ele cobre o fluxo de armazenamento dos leads, análise dos dados, consulta em um painel e geração de uma sugestão de primeira mensagem com IA.

O sistema lê os leads no Supabase, exibe listagem, filtro e resumo na interface e, a partir do nome e do imóvel de interesse, pede ao Google Gemini uma mensagem personalizada de primeiro contato.

Os registros são fictícios, criados para o desafio. Não há login, cadastro de usuários, CRUD de leads nem integração com WhatsApp.

---

## Etapa 1 — Banco de Dados

Os dados estão no **Supabase** (PostgreSQL). A tabela usada pelo código é `public.leads` (consulta em `.from('leads')`).

O tipo `Lead` em `src/database/types.ts` e o `select` de `getLeads()` em `src/database/leadsRepository.ts` usam estas colunas:

| Coluna | Conteúdo |
| --- | --- |
| `id` | Identificador |
| `nome` | Nome do lead |
| `telefone` | Telefone |
| `imovel_interesse` | Imóvel de interesse |
| `origem` | Origem do lead |
| `status` | Status |
| `data_criacao` | Data de criação |

Há **20 registros fictícios**, com origens e status variados (`site`, `whatsapp`, `indicação`; `novo`, `em contato`, `qualificado`, `perdido`).

A aplicação só **lê** os leads. O cliente é criado com `createClient` de `@supabase/supabase-js` em `src/database/client.ts`, usando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (`src/config/index.ts`).

---

## Etapa 2 — Interpretação dos Dados

Análise feita sobre os 20 registros de `public.leads`. Os resultados abaixo são da amostra fictícia do case. As consultas constam neste README porque o case pede que a query utilizada seja mostrada; **elas não aparecem na interface**.

### 1. Qual origem gerou mais leads?

`site` e `whatsapp` empataram, com **7 leads** cada. `indicação` gerou **6**.

### 2. Qual o percentual de leads qualificados em cada origem?

| Origem | Qualificados | Total | Percentual |
| --- | --- | --- | --- |
| indicação | 3 de 6 | 6 | 50,00% |
| whatsapp | 2 de 7 | 7 | 28,57% |
| site | 1 de 7 | 7 | 14,29% |

### 3. Qual outro padrão relevante foi observado?

- Status: `novo` 5, `em contato` 6, `qualificado` 6, `perdido` 3.
- A origem `indicação` tem menos volume que site e WhatsApp, mas a maior taxa de qualificação (50%).
- No total, **6 de 20** leads estão qualificados (**30%** da amostra).

### Consultas utilizadas

```sql
-- 1. Leads por origem
SELECT
    origem,
    COUNT(*) AS quantidade_leads
FROM public.leads
GROUP BY origem
ORDER BY quantidade_leads DESC;
```

```sql
-- 2. Percentual de qualificados por origem
SELECT
    origem,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE status = 'qualificado') AS qualificados,
    ROUND(
        COUNT(*) FILTER (WHERE status = 'qualificado') * 100.0 / COUNT(*),
        2
    ) AS percentual_qualificados
FROM public.leads
GROUP BY origem
ORDER BY percentual_qualificados DESC;
```

```sql
-- 3. Distribuição por status
SELECT
    status,
    COUNT(*) AS quantidade_leads
FROM public.leads
GROUP BY status
ORDER BY quantidade_leads DESC;
```

---

## Etapa 3 — Interface

Há uma única tela, montada por `App` → `LeadsList` (`src/components/LeadsList.tsx`). Stack da interface: **React** + **TypeScript** + **Vite**. Sem autenticação.

O painel inclui:

- cabeçalho (`Header`) e título **CRI Leads**;
- resumo visual (`SummaryCards`): total, novos, em contato, qualificados e perdidos;
- filtro por status (`StatusFilter`): Todos, Novo, Em contato, Qualificado e Perdido;
- listagem (`LeadsTable`): nome, telefone, imóvel de interesse, origem, status (`StatusBadge`) e data de criação;
- estados de carregamento, erro ao buscar no Supabase e lista vazia.

`LeadsList` chama `getLeads()`. O filtro (`filterLeadsByStatus`) e o resumo (`summarizeLeads`) estão em `src/queries/leads.ts`.

A geração de mensagem com IA está na mesma tela (`MessageSuggestion`) e é descrita na Etapa 4.

---

## Etapa 4 — Agente de Automação com IA

A automação gera uma sugestão de primeira mensagem a partir do **nome** e do **imóvel de interesse** (texto livre) do lead selecionado.

Fluxo implementado:

1. O usuário escolhe um lead em `MessageSuggestion` (`src/components/MessageSuggestion.tsx`).
2. O frontend chama `requestSuggestFirstMessage` (`src/ai/requestSuggestFirstMessage.ts`) e envia `nome` e `imovelInteresse` em `POST /api/suggest-message`.
3. O Vite, no Node, atende a rota com `handleSuggestMessageRequest` (`src/ai/handleSuggestMessage.ts`), registrada em `vite.config.ts`.
4. É executada `suggestFirstMessage` (`src/ai/suggestFirstMessage.ts`), usando `@google/genai` e o modelo **Google Gemini** `gemini-3.8-flash`.
5. A mensagem é exibida na própria interface.

A chave fica em `GEMINI_API_KEY` (sem prefixo `VITE_`), lida no Node. O frontend não recebe e não envia a chave.

A função foi testada isoladamente com `npm run test:gemini` (`src/ai/testGemini.ts`) e, depois, ligada à interface. Há estado de carregamento e mensagem de erro se a geração falhar.

Não há envio da mensagem por WhatsApp nem por outro canal.

---

## Ferramentas e tecnologias

- **Cursor** — ferramenta usada no desenvolvimento; já faz parte do fluxo do desenvolvedor em projetos de sites e sistemas.
- **Google Gemini** — modelo usado para gerar a sugestão de primeira mensagem pedida pelo case.
- **React** e **TypeScript** — interface.
- **Vite** — build, servidor de desenvolvimento e rota Node da IA.
- **Supabase** / PostgreSQL e **`@supabase/supabase-js`** — banco e leitura dos leads.
- **`@google/genai`** — SDK da integração com o Gemini.

---

## Dificuldades encontradas

A dificuldade foi integrar o Gemini **sem expor a chave no frontend**.

A chave foi colocada em `GEMINI_API_KEY`. A chamada permanece no Node (`suggestFirstMessage`, via `POST /api/suggest-message`). O frontend envia só nome e imóvel de interesse. A integração foi testada de forma independente e, em seguida, conectada à interface.

---

## Evoluções futuras

Não implementado neste case: integração com **WhatsApp**, para que, após a criação de um lead, a mensagem pudesse ser gerada e depois enviada ao cliente.

---

## Como executar

1. Instalar dependências:

```bash
npm install
```

2. Copiar `.env.example` para `.env` e preencher (o arquivo `.env` não é versionado):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

Não use prefixo `VITE_` em `GEMINI_API_KEY`.

3. Executar o painel e a rota da IA:

```bash
npm run dev
```

4. Testar o Gemini sem a interface (opcional):

```bash
npm run test:gemini
```

5. Build:

```bash
npm run build
```

O script `npm run preview` também sobe o servidor do Vite com a rota da IA. A geração de mensagem não funciona só com arquivos estáticos, sem esse servidor.

---

## Observações

- Os 20 leads são fictícios e servem apenas ao desafio.
- A interface não cadastra, edita nem exclui leads.
- Este README não contém chaves de API.

---

## Organização do código

```
src/
├── App.tsx
├── main.tsx
├── components/     # Header, LeadsList, SummaryCards, StatusFilter,
│                   # LeadsTable, StatusBadge, MessageSuggestion
├── database/       # client.ts, types.ts, leadsRepository.ts (getLeads)
├── queries/        # filterLeadsByStatus, summarizeLeads
├── ai/             # suggestFirstMessage, handleSuggestMessageRequest,
│                   # requestSuggestFirstMessage, testGemini
├── config/         # VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
└── styles/         # estilos globais
```
