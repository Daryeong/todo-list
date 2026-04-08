import http from 'node:http'

const port = Number(process.env.STEP_TEMPLATE_PORT || process.env.PORT || 8787)
const model = process.env.OPENAI_STEP_TEMPLATE_MODEL || 'gpt-5.4-mini'

const sendJson = (res, statusCode, body) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(JSON.stringify(body))
}

const collectText = (value) => {
  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectText)
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectText)
  }

  return []
}

const parseSteps = (text) => {
  try {
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) {
      return parsed.filter((step) => typeof step === 'string' && step.trim().length > 0)
    }
  } catch {
    // fall through to line parsing
  }

  return text
    .split('\n')
    .map((line) => line.replace(/^\s*[-*•\d.]+\s*/, '').trim())
    .filter(Boolean)
}

const buildPrompt = ({ title, memo = '', importance = 'medium' }) =>
  [
    '너는 한국어 할 일 앱의 단계 템플릿 추천기다.',
    '입력된 할 일을 보고 바로 실행 가능한 3~5개의 짧은 단계만 JSON 배열로 반환한다.',
    '출력은 반드시 JSON 배열만 사용하고, 설명 문장은 넣지 않는다.',
    `할 일: ${title}`,
    memo ? `메모: ${memo}` : '',
    `중요도: ${importance}`,
    '예시 스타일: ["준비하기", "실행하기", "마무리하기"]',
  ]
    .filter(Boolean)
    .join('\n')

const handleRequest = async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  if (req.url !== '/api/step-templates' || req.method !== 'POST') {
    sendJson(res, 404, { error: 'Not found' })
    return
  }

  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 503, { error: 'OPENAI_API_KEY is not set' })
    return
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  let payload
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON body' })
    return
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: buildPrompt(payload),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    sendJson(res, response.status, { error: 'OpenAI request failed', details: errorText })
    return
  }

  const data = await response.json()
  const text = collectText(data).find((value) => value.trim().length > 0) ?? ''
  const steps = parseSteps(text)
  sendJson(res, 200, { steps })
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    sendJson(res, 500, {
      error: 'Unexpected server error',
      details: error instanceof Error ? error.message : String(error),
    })
  })
})

server.listen(port, () => {
  console.log(`Step template API listening on http://localhost:${port}`)
})
