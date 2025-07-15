// 病人数据
export const scoreItemsData ={
    ratingGrading:"",  
    ratingLabels:"",
    list:[
    {
        label: '总胆红素',
        required: true,
        score: null,
        value: '1.5',
        // 历史检查数据
        values: ['1.5', '2.5', '3.5'],
    },
    {
        label: '白蛋白',
        required: true,
        score: null,
        value: '2.8',
        // 历史检查数据
        values: ['3.2', '2.8', '2.5'],
    },
    {
        label: 'PT',
        required: true,
        score: null,
        value: '20',
        // 历史检查数据
        values: ['16', '20', '25'],
    },
    {
        label: '腹水',
        required: true,
        score: null,
        value: '25',
        // 历史检查数据
        values: ['16', '20', '25'],
    },
    {
        label: '肝性脑病',
        required: true,
        score: null,
        value: '20',
        // 历史检查数据
        values: ['16', '20', '25'],
    },  
]

} 




// 模拟历史检查数据
export const getHistoryData = {
    总胆红素: [
        { date: '2025-03-02 15:12', testName: '总胆红素', value: '1.5' },
        { date: '2025-03-15 12:10', testName: '总胆红素', value: '1.2' },
        { date: '2025-03-22 20:33', testName: '总胆红素', value: '1.5' },
        { date: '2025-04-01 11:29', testName: '总胆红素', value: '1.0' },
    ],
    白蛋白: [
        { date: '2025-03-02 15:12', testName: '白蛋白', value: '3.2' },
        { date: '2025-03-15 12:10', testName: '白蛋白', value: '2.8' },
        { date: '2025-03-22 20:33', testName: '白蛋白', value: '3.0' },
        { date: '2025-04-01 11:29', testName: '白蛋白', value: '2.5' },
    ],
    PT: [
        { date: '2025-03-02 15:12', testName: 'PT', value: '16' },
        { date: '2025-03-15 12:10', testName: 'PT', value: '18' },
        { date: '2025-03-22 20:33', testName: 'PT', value: '20' },
        { date: '2025-04-01 11:29', testName: 'PT', value: '15' },
    ],
};
//模板规则数据
export const rulesData = [
    { id: 1, attr: '总胆红素', type: '范围编码', ruleAttrsDdta: ['总胆红素', '白蛋白', 'PT', '腹水', '肝性脑病', '评分分级', '评分标签'] },
    { id: 2, attr: '白蛋白', type: '数字编码', ruleAttrsDdta: ['总胆红素', '白蛋白', 'PT', '腹水', '肝性脑病', '评分分级', '评分标签'] },
    { id: 3, attr: 'PT', type: '公式计算', ruleAttrsDdta: ['总胆红素', '白蛋白', 'PT', '腹水', '肝性脑病', '评分分级', '评分标签'] },
    { id: 4, attr: '腹水', type: '数字编码', ruleAttrsDdta: ['总胆红素', '白蛋白', 'PT', '腹水', '肝性脑病', '评分分级', '评分标签'] },
    { id: 5, attr: '肝性脑病', type: '数字编码', ruleAttrsDdta: ['总胆红素', '白蛋白', 'PT', '腹水', '肝性脑病', '评分分级', '评分标签'] },
    { id: 6, attr: '评分分级', type: '', ruleAttrsDdta: ['总胆红素', '白蛋白', 'PT', '腹水', '肝性脑病', '评分分级', '评分标签'] },
    { id: 7, attr: '评分分级', type: '', ruleAttrsDdta: ['总胆红素', '白蛋白', 'PT', '腹水', '肝性脑病', '评分分级', '评分标签'] },
];

// 固定模板数据
// export const eRules = [
//     { "id": 12, "attr": "总胆红素", "type": "范围编码", "ruleAttrsDdta": ["总胆红素"], "ruleTypes": ["范围编码", "数字编码"], "rule": { "name": "范围编码", "rules": [{ "minValue": "0", "maxValue": "2", "score": "1" }, { "minValue": "2", "maxValue": "3", "score": "2" }, { "minValue": "3", "maxValue": "999", "score": "3" }] } },
//      { "id": 11, "attr": "白蛋白", "type": "数字编码", "ruleAttrsDdta": ["白蛋白"], "ruleTypes": ["范围编码", "数字编码"], "rule": { "name": "数字编码",  "numberRuleItems":[{"originValue":"2.8","scoreValue":'1'}] } },
//      { "id": 10, "attr": "PT", "type": "范围编码", "ruleAttrsDdta": ["PT"], "ruleTypes": ["范围编码", "数字编码"], "rule": { "name": "范围编码", "rules": [{ "minValue": "0", "maxValue": "2", "score": "1" }, { "minValue": "20", "maxValue": "29", "score": "2" }, { "minValue": "30", "maxValue": "999", "score": "3" }] } }, 
//      { "id": 9, "attr": "腹水", "type": "数字编码", "ruleAttrsDdta": ["腹水"], "ruleTypes": ["范围编码", "数字编码"], "rule": { "name": "数字编码", "numberRuleItems":[{"originValue":"25","scoreValue":'1'}] } },
//       { "id": 8, "attr": "肝性脑病", "type": "数字编码", "ruleAttrsDdta": ["肝性脑病"], "ruleTypes": ["范围编码", "数字编码"], "rule": { "name": "数字编码",  "numberRuleItems":[{"originValue":"20","scoreValue":'1'}]} },
//        { "id": 6, "attr": "评分分级", "type": "公式计算", "ruleAttrsDdta": [], "ruleTypes": ["公式计算"],"formulaAttrs":['总胆红素', '白蛋白', 'PT',   '肝性脑病'] },
//         { "id": 7, "attr": "评分标签", "type": "范围标签", "ruleAttrsDdta": [], "ruleTypes": ["范围标签"], "rule": { "name": "范围标签", "rules":[{ "minValue": "0", "maxValue": "4", "score": "健康" }, { "minValue": "5", "maxValue": "10", "score": "B级:中度肝硬化" }, { "minValue": "30", "maxValue": "999", "score": "3" }]} }
//     ];
// 固定模板数据
// export const eRules = [
//     { id: 6, attr: '评分分级', type: '公式计算', ruleAttrsDdta: ['总胆红素', '白蛋白', 'PT', '腹水', '肝性脑病', '评分分级', '评分标签'] },
//     { id: 7, attr: '评分标签', type: '范围标签', ruleAttrsDdta: ['总胆红素', '白蛋白', 'PT', '腹水', '肝性脑病', '评分分级', '评分标签'] },
// ];
// 固定模板数据
export const eRules =  [ 
    { "attr": "凝血酶原时间", "type": "范围编码", "ruleAttrsDdta": [ "总胆红素" ], "ruleTypes": [ "范围编码", "数字编码" ], "rule": { "name": "范围编码", "rules": [ { "minValue": "1", "maxValue": "5", "score": "1" }, { "minValue": "6", "maxValue": "10", "score": "2" } ] } },
     { "attr": "总胆红素", "type": "数字编码", "ruleAttrsDdta": [ "白蛋白" ], "ruleTypes": [ "范围编码", "数字编码" ], "rule": { "name": "数字编码", "rules": [ { "originValue": "2.8", "scoreValue": "3" } ] } }, 
     { "attr": "白蛋白", "type": "范围编码", "ruleAttrsDdta": [ "PT" ], "ruleTypes": [ "范围编码", "数字编码" ], "rule": { "name": "范围编码", "rules": [ { "minValue": "10", "maxValue": "20", "score": "5" } ] } }, 
     { "attr": "腹水", "type": "范围编码", "ruleAttrsDdta": [ "腹水" ], "ruleTypes": [ "范围编码", "数字编码" ], "rule": { "name": "范围编码", "rules": [ { "minValue": "1", "maxValue": "5", "score": "2" } ] } }, { "attr": "肝性脑病", "type": "数字编码", "ruleAttrsDdta": [ "肝性脑病" ], "ruleTypes": [ "范围编码", "数字编码" ], "rule": { "name": "数字编码", "rules": [ { "originValue": "8", "scoreValue": "9" } ] } },
     { "id": 6, "attr": "评分分级", "type": "公式计算", "ruleAttrsDdta": [], "ruleTypes": [ "公式计算" ], "formulaAttrs": [ "总胆红素", "白蛋白", "PT", "腹水", "肝性脑病" ], "rule": { "name": "公式计算", "rules": "总胆红素+白蛋白+PT+腹水+肝性脑病" } },
      { "id": 7, "attr": "评分标签", "type": "范围标签", "ruleAttrsDdta": [], "ruleTypes": [ "范围标签" ], "rule": { "name": "范围标签", "rules": [ { "minValue": "1", "maxValue": "2", "score": " 严重" }, { "minValue": "3", "maxValue": "5", "score": "中等" }, { "minValue": "6", "maxValue": "12", "score": "超严重" } ] } } ]

 
 
// [
//     {
//         "id": 63,
//         "word_code": "INF000030",
//         "input_type": null,
//         "word_name": "腹水",
//         "word_eng": null,
//         "word_short": null,
//         "word_class": "信息名称",
//         "word_apply": "基本信息",
//         "word_belong": null,
//         "data_type": "数值类型",
//         "options": null,
//         "followup_options": null
//     },
//     {
//         "id": 65,
//         "word_code": "INF000032",
//         "input_type": null,
//         "word_name": "肝性脑病",
//         "word_eng": null,
//         "word_short": null,
//         "word_class": "信息名称",
//         "word_apply": "基本信息",
//         "word_belong": null,
//         "data_type": "数值类型",
//         "options": null,
//         "followup_options": null
//     },
//     {
//         "id": 120,
//         "word_code": "TES000019",
//         "input_type": null,
//         "word_name": "白蛋白",
//         "word_eng": null,
//         "word_short": "ALB",
//         "word_class": "检验名称",
//         "word_apply": "检验指标",
//         "word_belong": null,
//         "data_type": "数值类型",
//         "options": null,
//         "followup_options": null
//     },
//     {
//         "id": 123,
//         "word_code": "TES000022",
//         "input_type": null,
//         "word_name": "总胆红素",
//         "word_eng": null,
//         "word_short": "TBIL",
//         "word_class": "检验名称",
//         "word_apply": "检验指标",
//         "word_belong": null,
//         "data_type": "数值类型",
//         "options": null,
//         "followup_options": null
//     },
//     {
//         "id": 148,
//         "word_code": "TES000047",
//         "input_type": "text",
//         "word_name": "凝血酶原时间",
//         "word_eng": null,
//         "word_short": "PT",
//         "word_class": "检验名称",
//         "word_apply": "检验指标",
//         "word_belong": null,
//         "data_type": "数值类型",
//         "options": null,
//         "followup_options": {}
//     }
// ]