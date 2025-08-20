const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')
const presetsBox = document.getElementById('presets')
const copyButton = document.getElementById('copyButton')

const PRESETS = {
  lol: [
    'Melhor build para ADC no patch atual',
    'Melhores runas para Ahri mid',
    'Como sair do prata jogando sup?'
  ],
  valorant: [
    'Composição de agentes para Ascent',
    'Lineups simples de Sova em Haven',
    'Como jogar pós-plant no Bind?'
  ],
  war: [
    'Principais heróis por raça e quando escolher',
    'Build inicial padrão para Orc',
    'Como lidar com mass air dos Night Elves?'
  ]
}

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text ?? '')
}

function updatePlaceholder() {
  const map = {
    lol: 'Ex: Melhor build para ADC no patch atual',
    valorant: 'Ex: Composição e agentes para Ascent',
    war: 'Ex: Principais heróis por raça e quando escolher'
  }
  questionInput.placeholder = map[gameSelect.value] || 'Digite sua pergunta...'
}

function renderPresets() {
  const game = gameSelect.value
  presetsBox.innerHTML = '' 
  
  ;(PRESETS[game] || []).forEach(txt => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'chip'
    b.textContent = txt
    b.addEventListener('click', () => {
      questionInput.value = txt
      questionInput.focus()
    })
    presetsBox.appendChild(b)
  })
}


const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.0-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const perguntaGenerica = `
## Especialidade
Você é um assistente de meta para o jogo ${game}.

## Tarefa
Responder perguntas do usuário com base em estratégias, builds e dicas de ${game}.

## Regras
- Se não souber, responda "Não sei".
- Se a pergunta não estiver relacionada a ${game}, responda "Essa pergunta não está relacionada a ${game}".
- Considere a data atual ${new Date().toLocaleDateString('pt-BR')}.
- Responda direto, em Markdown, no máximo 500 caracteres.
- Não repita instruções (não diga "ok", "entendi"...).

---
**Pergunta do usuário:** ${question}
`.trim()

  const perguntaWar = `
## Especialidade
Você é estritamente especialista em *Warcraft III: The Frozen Throne (TFT)*.

## Tarefa
Responder apenas sobre heróis, unidades, builds e estratégias de TFT.

## Regras
- Somente sobre TFT. Ignore qualquer outro jogo com "War" no nome.
- Se não for sobre TFT, responda: "Essa pergunta não é sobre Warcraft III: The Frozen Throne".
- Se não souber, responda: "Não sei".
- Responda direto, em Markdown, máximo 600 caracteres.
- Não repita instruções.
- Data atual: ${new Date().toLocaleDateString('pt-BR')}

---
**Pergunta do usuário:** ${question}
`.trim()

  const prompt = game === 'war' ? perguntaWar : perguntaGenerica

  const body = {
    contents: [{
      role: 'user',
      parts: [{ text: prompt }]
    }]
  }

  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`Falha na API (${response.status}): ${errText || response.statusText}`)
  }

  const data = await response.json()
  console.log("Resposta da API:", data)

  return data?.candidates?.[0]?.content?.parts?.[0]?.text
    ?? 'Não foi possível gerar uma resposta agora.'
}


const enviarFormulario = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value.trim()
  const game = gameSelect.value
  const question = questionInput.value.trim()

  if (!apiKey || !game || !question) {
    alert('Por favor, preencha todos os campos')
    return
  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try {
    const text = await perguntarAI(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove('hidden')
    copyButton.classList.remove('hidden')
  } catch (error) {
    console.log('Error: ', error)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(`**Erro:** ${error.message}`)
    aiResponse.classList.remove('hidden')
  } finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove('loading')
  }
}

form.addEventListener('submit', enviarFormulario)


copyButton.addEventListener('click', () => {
  const text = aiResponse.querySelector('.response-content').innerText
  navigator.clipboard.writeText(text).then(() => {
    copyButton.textContent = "Copiado!"
    setTimeout(() => copyButton.textContent = "Copiar Resposta", 2000)
  })
})


updatePlaceholder()
renderPresets()