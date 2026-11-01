const apiKey = 'FAKE_KEY';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
const payload = {
  contents: [{ role: "user", parts: [{ text: "hello" }] }],
  systemInstruction: { parts: [{ text: "you are helpful" }] },
  generationConfig: { responseMimeType: "application/json" }
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
.then(({ status, ok, data }) => {
  if (!ok) {
    console.error('Failed API:', status, data.error?.message);
  } else {
    console.log('Success:', data.candidates?.[0]?.content?.parts?.[0]?.text);
  }
})
.catch(err => console.error('Fetch error:', err));
