
import * as md5encode from "js-md5";

/**
 * 根据输入字符串的md5的哈希值，返回某个特定颜色
 */
export function getRandomColor (anyString) {
    const encoded = md5encode(anyString);
    const n = Number.parseInt(encoded, 16);
    return COLORS[(n % COLORS.length)];
}

const COLORS = [
    "#ff8a80",
    "#ef5350",
    "#ef9a9a",
    "#ff80ab",
    "#ec407a",
    "#f48fb1",
    "#ce93d8",
    "#ea80fc",
    "#b388ff",
    "#b39ddb",
    "#8c9eff",
    "#9fa8da",
    "#82b1ff",
    "#42a5f5",
    "#90caf9",
    "#00b0ff",
    "#80d8ff",
    "#29b6f6",
    "#81d4fa",
    "#00b8d4",
    "#18ffff",
    "#26c6da",
    "#80deea",
    "#00bfa5",
    "#64ffda",
    "#26a69a",
    "#80cbc4",
    "#00c853",
    "#69f0ae",
    "#66bb6a",
    "#a5d6a7",
    "#64dd17",
    "#b2ff59",
    "#689f38",
    "#8bc34a",
    "#aed581",
    "#dcedc8",
    "#aeea00",
    "#eeff41",
    "#9e9d24",
    "#c0ca33",
    "#d4e157",
    "#e6ee9c",
    "#ffd600",
    "#ffff00",
    "#f57f17",
    "#fbc02d",
    "#ffeb3b",
    "#fff176",
    "#fff9c4",
    "#bcaaa4",
    "#9e9e9e",
    "#e0e0e0",
    "#90a4ae",
    "#cfd8dc"
]