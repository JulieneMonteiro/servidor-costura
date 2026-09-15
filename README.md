#  CosturaPro — Assistente & Sincronizador de Gestão para Costureiras Autônomas

> **Status do Projeto:** MVP Concluído | Proposta de Expansão para Marketplace Two-Sided  
> **Papel:** Concepção de Produto, Definição de Requisitos e Desenvolvimento Backend  
> **Stack:** Node.js, Express, JWT, CORS, Arquitetura REST (Integrado a App Mobile Android / Room Database)

---

##  Contexto & Oportunidade de Mercado (Discovery)

A rotina de costureiras e ateliês autônomos no Brasil é predominantemente analógica ou descentralizada:
1. **Cálculo de Orçamento Ineficiente:** Dificuldade em precificar peças considerando margem de lucro real, custos fixos, insumos secundários (linhas, zíperes) e metragem necessária.
2. **Perda de Tempo e Dinheiro no Abastecimento:** Necessidade de deslocamento físico entre lojas de tecidos para pesquisar preços e disponibilidade antes de fechar orçamentos.
3. **Risco de Perda de Dados:** Medidas corporais e contatos de clientes anotados em cadernos ou papéis avulsos.

### O Problema Central
Costureiras perdem horas na fase de pré-venda (orçamento e cotação de tecido), reduzindo sua capacidade produtiva de confecção e errando a precificação por falta de cálculo automatizado.

---

##  A Solução (Visão do Produto)

O **CosturaPro** foi desenhado em uma abordagem de produto evolutiva:

* **Fase 1 (MVP Atual):** App mobile com persistência local (Room) para cálculo de metragem e precificação instantânea na frente da cliente + Servidor REST para sincronização segura e consolidação de carteira em nuvem.
* **Fase 2 (Visão de Marketplace Two-Sided):** Plataforma conectando costureiras a lojistas de tecidos locais (modelo similar a *iFood / Zé Delivery* de insumos têxteis), permitindo cotação instantânea de tecidos e compra sob demanda sem sair do ateliê.

---

##  Arquitetura do MVP (Backend & Sincronização)

Este repositório contém a **API RESTful** responsável por garantir o backup e a sincronização dos dados coletados pelo aplicativo móvel:

* **Offline-First:** O app móvel coleta dados e realiza os cálculos mesmo sem internet; quando a conexão é restabelecida, a sincronização é acionada.
* **Autenticação Segura (JWT):** Controle de sessão com tokens de expiração programada para tráfego seguro de dados de clientes.
* **Prevenção de Duplicidade:** Mecanismo de desduplicação na ingestão dos dados para integridade da base consolidada.
* **Consolidação em Nuvem (`/api/planilha`):** Endpoint que expõe os dados consolidados prontos para visualização e relatórios operacionais.

### Endpoints da API

| Método | Rota | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Emissão de token JWT para a profissional | Pública |
| `POST` | `/api/sincronizar` | Ingestão e unificação da lista de clientes enviada pelo mobile | `Bearer Token` |
| `GET` | `/api/planilha` | Consulta da base consolidada de clientes e medidas | Pública (Dev/Admin) |

---

##  Roadmap de Evolução do Produto

[ MVP Validado ] ─────────► [ V1: Cotação Local ] ─────────► [ V2: Marketplace ]

Calculadora de custos      - Catálogo de lojas cadastradas  - Pedido de tecido in-app

Gestão de clientes         - Comparador de preços por metro - Logística de entrega rápida

Sincronização em nuvem     - Estimativa no ato do orçamento - Monetização por transação (Take Rate)

### Métricas de Sucesso Previstas (Product Analytics)
* **Time-to-Quote:** Redução de 80% no tempo necessário para enviar um orçamento final à cliente.
* **Margem Garantida:** Eliminação de prejuízos causados por erro de cálculo manual de metragem.
* **GMV (Gross Merchandise Value):** Volume financeiro transacionado entre ateliês e lojistas parceiros na Fase 2.

---

##  Como Executar o Servidor

1. Clone o repositório:
```bash
git clone [https://github.com/JulieneMonteiro/servidor-costura.git](https://github.com/JulieneMonteiro/servidor-costura.git)
cd servidor-costura

##  Instale as dependências:

npm install

##  Inicie o servidor:
npm start
# ou
node server.js

O servidor iniciará na porta 3000.
