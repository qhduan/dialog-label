
function sentenceSort (a, b) {
    if (a.domain.length !== b.domain.length) {
        return a.domain.length - b.domain.length;
    }
    if (a.intent.length !== b.intent.length) {
        return a.intent.length - b.intent.length;
    }
    const sa = a.data.map(i => i.text).join();
    const sb = b.data.map(i => i.text).join();
    if (sa.length !== sb.length) {
        return sa.length - sb.length;
    }
    if (sa > sb) {
        return 1;
    } else if (sa < sb) {
        return -1;
    }
    return 0;
}

export function getSentences () {
    let sentences = sessionStorage.getItem("sentences");
    if (typeof sentences !== "string") {
        return [];
    } else {
        try {
            const t = JSON.parse(sentences);
            t.sort(sentenceSort);
            return t;
        } catch (e) {
            return [];
        }
    }
}

export function setSentences (sentences) {
    sentences.sort(sentenceSort);
    sessionStorage.setItem("sentences", JSON.stringify(sentences));
}


const SentencesSample = [
    {
        "domain": "flight",
        "intent": "orderTicket",
        "data": [
            {
                "text": "我要"
            },
            {
                "text": "北京",
                "name": "departCity",
                "start": 2,
                "end": 4,
            },
            {
                "text": "到"
            },
            {
                "text": "上海",
                "name": "arriveCity",
                "start": 5,
                "end": 7,
            },
            {
                "text": "的机票"
            },
        ]
    }
];

setSentences(SentencesSample);
