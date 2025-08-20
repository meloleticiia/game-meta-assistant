# Game Meta Assistant

Aplicação web que utiliza a _API Gemini_ para responder perguntas sobre estratégias, builds e dicas de jogos como _League of Legends, \*\*Valorant_ e _Warcraft III: The Frozen Throne_.

---

## Funcionalidades

- Perguntas sobre builds e estratégias de jogos.
- Sugestões rápidas de perguntas (chips).
- Respostas em Markdown renderizadas na tela.
- Botão para copiar a resposta da IA.
- Suporte a múltiplos jogos.

---

## Tecnologias utilizadas

- _HTML5_
- _CSS3_
- _JavaScript (ES6+)_
- _API Gemini (Google AI)_
- _Showdown.js_ (para converter Markdown em HTML)

---

## Ambiente e versões utilizadas

| Ferramenta | Versão/Observação                                 |
| ---------- | ------------------------------------------------- |
| Navegador  | Chrome/Edge/Firefox recentes                      |
| Node.js    | 18+ (apenas se quiser subir um servidor estático) |
| Showdown   | 2.x (via CDN)                                     |
| Gemini API | v1beta                                            |

---

## Instalação local

Pré-requisitos:

- Navegador atualizado (Chrome, Edge, etc).
- Chave de API do Gemini (Google AI Studio).

### Pré-requisitos

- Navegador atualizado
- (Opcional) Node.js 18+ se quiser rodar um servidor estático
- Servidor estático opcional

# usando npx serve

npx serve .
ou com a extensão Live Server (VS Code)

### Passo a passo

escreva: bash

> Clone o repositório
> git clone https://github.com/seu-usuario/game-meta-assistant
> cd game-meta-assistant

- Abra o index.html no navegador
- (ou use um servidor estático para evitar bloqueios de CORS em alguns ambientes)

---

# Uso

- Informe sua API KEY do Gemini.
- Escolha o jogo.
- Clique em um preset ou escreva sua pergunta.
- Clique em Perguntar.
- Use Copiar Resposta para copiar o texto gerado.

# Exemplos de perguntas

- LoL: “Melhor build para ADC no patch atual”

- Valorant: “Composição de agentes para Ascent”

- Warcraft III (TFT): “Principais heróis por raça e quando escolher”

---

## Chave de API (Gemini)

- As chamadas à IA usam _sua chave da API Gemini_, digitada no campo “API KEY”.
- A chave _não fica no código_ e _não é salva_ (boa prática para portfólio).
- Para criar uma chave, acesse: [Google AI Studio - API Keys](https://aistudio.google.com/app/apikey)

### Como a chave é usada

O front-end faz uma requisição POST para o endpoint do Gemini:
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=SUA_CHAVE_AQUI
Essa chamada retorna o texto da IA, que é renderizado na tela.

## Estrutura do projeto

```text
NLW/
├── index.html      # Estrutura principal da aplicação
├── style.css       # Estilos da aplicação
├── script.js       # Lógica em JavaScript
└── assets/         # Imagens e ícones

game-meta-assistant/
├── assets/         # Imagens (logo, background)
├── index.html      # Estrutura da página
├── style.css       # Estilos (layout, animações, chips)
└── script.js       # Lógica (presets, prompts, chamada Gemini, copiar)

# Roadmap

- Acessibilidade: <label> para inputs e aria-live na resposta
- Tema dark/light
- Modo demo (respostas simuladas sem API Key)
- Histórico local (últimas perguntas e respostas)
