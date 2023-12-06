const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());


app.post('/reverse-sentence', (req, res) => {
    try {
        let { sentence } = req.body;

        sentence = sentence.trim();

        const cleanedSentence = sentence.replace(/\s+/g, ' ');
        
        const reversedSentence = cleanedSentence
            .split(/\b/)
            .reverse()
            .join('');

        res.json({ reversedSentence });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
