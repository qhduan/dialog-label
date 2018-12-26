
import { message } from "antd";

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

export let intentNames = [];
export let domainNames = [];

export function getSentences () {
    let sentences = localStorage.getItem("sentences");
    if (typeof sentences !== "string") {
        return [];
    } else {
        try {
            const t = JSON.parse(sentences);
            // t.sort(sentenceSort);

            intentNames = []
            t.filter(i => i.intent).forEach(i => intentNames.indexOf(i.intent) === -1 ? intentNames.push(i.intent) : null);
            domainNames = []
            t.filter(i => i.domain).map(i => domainNames.indexOf(i.domain) === -1 ? domainNames.push(i.domain) : null);
            const sort = (a, b) => {
                if (a.length !== b.length) {
                    return a.length - b.length;
                }
                if (a > b) {
                    return 1;
                } else if (a < b) {
                    return -1;
                } else {
                    return 0;
                }
            };
            intentNames.sort(sort);
            domainNames.sort(sort);

            return t;
        } catch (e) {
            return [];
        }
    }
}

export function setSentences (sentences: any[]) {

    intentNames = []
    sentences.filter(i => i.intent).forEach(i => intentNames.indexOf(i.intent) === -1 ? intentNames.push(i.intent) : null);
    domainNames = []
    sentences.filter(i => i.domain).map(i => domainNames.indexOf(i.domain) === -1 ? domainNames.push(i.domain) : null);
    const sort = (a, b) => {
        if (a.length !== b.length) {
            return a.length - b.length;
        }
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        } else {
            return 0;
        }
    };
    intentNames.sort(sort);
    domainNames.sort(sort);

    // sentences.sort(sentenceSort);
    localStorage.setItem("sentences", JSON.stringify(sentences));
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

if (getSentences().length <= 0) {
    setSentences(SentencesSample);
    message.info("当前没有 意图 语料，已经载入默认意图样例");
} else {
    message.info(`已经载入了 ${getSentences().length}条 意图样例`);
}
