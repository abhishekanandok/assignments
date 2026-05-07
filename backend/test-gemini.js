const axios = require("axios");

async function testGemini() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
    try {
        const res = await axios.post(url, {
            contents: [{ role: "user", parts: [{ text: "Hello" }] }],
        });
        console.log("Success:", res.data);
    } catch (err) {
        if (err.response) {
            console.error("404 Error Data:", JSON.stringify(err.response.data, null, 2));
        } else {
            console.error("Error:", err.message);
        }
    }
}

testGemini();
