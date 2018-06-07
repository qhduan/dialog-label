
import { message } from "antd";

function entitySort (a, b) {
    if (a.entity.length !== b.entity.length) {
        return a.entity.length - b.entity.length;
    }
    if (a.entity > b.entity) {
        return 1;
    } else if (a.entity < b.entity) {
        return -1;
    }
    return 0;
}

export function entitiyInnerSort (a, b) {
    if (typeof a !== "string") {
        a = a[0];
    }
    if (typeof b !== "string") {
        b = b[0];
    }
    if (a.length !== b.length) {
        return a.length - b.length;
    }
    if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    }
    return 0;
}

export let entityNames = [];

export function getEntities () {
    let entities = localStorage.getItem("entities");
    if (typeof entities !== "string") {
        return [];
    } else {
        try {
            const t = JSON.parse(entities);
            t.sort(entitySort);
            for (const tt of t) {
                if (tt.data) {
                    tt.data.sort(entitiyInnerSort);
                }
            }
            entityNames = t.map(i => i.entity);
            return t;
        } catch (e) {
            return [];
        }
    }
}

export function setEntities (entities: any[]) {
    entityNames = entities.map(i => i.entity);
    entities.sort(entitySort);
    for (const tt of entities) {
        if (tt.data) {
            tt.data.sort(entitiyInnerSort);
        }3
    }
    localStorage.setItem("entities", JSON.stringify(entities));
}

const EntitiesSample = [
    {
        "entity": "city",
        "data": [
            "上海市",
            ["西安市", "西安"],
            ["北京", "首都", "北京市"],
        ]
    }
];

if (getEntities().length <= 0) {
    setEntities(EntitiesSample);
    message.info("当前没有 实体 语料，已经载入默认实体样例");
} else {
    message.info(`已经载入了 ${getEntities().length}条 实体样例`);
}
