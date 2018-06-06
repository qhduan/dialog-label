
function entitySort (a, b) {
    if (a.entity.length !== b.entity.length) {
        return a.entitye.length - b.entity.length;
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

export function getEntities () {
    let entities = sessionStorage.getItem("entities");
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
            return t;
        } catch (e) {
            return [];
        }
    }
}

export function setEntities (entities) {
    entities.sort(entitySort);
    for (const tt of entities) {
        if (tt.data) {
            tt.data.sort(entitiyInnerSort);
        }
    }
    sessionStorage.setItem("entities", JSON.stringify(entities));
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

setEntities(EntitiesSample);
