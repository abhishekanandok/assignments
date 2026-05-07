const axios = require("axios");

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    try {
        const res = await axios.get(url);
        console.log("Models:", res.data.models.map(m => m.name).join(", "));
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}

listModels();
