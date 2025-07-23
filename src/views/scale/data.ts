 export const childRatingLists = [
  {
    id: 1,
    scaleDescription: '用于评估患者抑郁程度的标准化量表',
    template_code: 'SCALE001',
    name: '抑郁自评量表',
    description: '',
    rulesList: [ { "id": 1, "word_name": "阴离子间隙", "type": "范围编码", "ruleTypes": [ "范围编码", "数字编码", "公式计算", "范围标签", "代数换算" ], "word_code": "TES000060", "word_short": "AG", "rule": { "type": "范围编码", "rules": [ { "minValue": "0", "maxValue": "1.2", "score": "1" }, { "minValue": "1.2", "maxValue": "1.5", "score": "2" }, { "minValue": "1.5", "maxValue": "999", "score": "3" } ] } }, { "id": 2, "word_name": "标准碳酸氢盐", "type": "数字编码", "ruleTypes": [ "范围编码", "数字编码", "公式计算", "范围标签", "代数换算" ], "word_code": "TES000061", "word_short": "SB", "rule": { "type": "数字编码", "rules": [ { "originValue": "2.5", "scoreValue": "1" }, { "originValue": "2.8", "scoreValue": "2" }, { "originValue": "3.2", "scoreValue": "3" } ] } }, { "id": 3, "word_name": "乳酸", "type": "范围编码", "ruleTypes": [ "范围编码", "数字编码", "公式计算", "范围标签", "代数换算" ], "word_code": "C000007", "word_short": "Lac", "rule": { "type": "范围编码", "rules": [ { "minValue": "0", "maxValue": "2.8", "score": "1" }, { "minValue": "2.8", "maxValue": "3.2", "score": "2" }, { "minValue": "3.2", "maxValue": "999", "score": "3" } ] } }, { "id": 4, "word_name": "实际碳酸氢盐", "type": "范围编码", "ruleTypes": [ "范围编码", "数字编码", "公式计算", "范围标签", "代数换算" ], "word_code": "TES000144", "word_short": "", "rule": { "type": "范围编码", "rules": [ { "minValue": "0", "maxValue": "2.8", "score": "1" }, { "minValue": "2.8", "maxValue": "3.2", "score": "2" }, { "minValue": "3.2", "maxValue": "999", "score": "3" } ] } }, { "word_code": "tj01", "word_name": "评分分级", "type": "公式计算", "rule": { "type": "公式计算", "selectedAttrs": [ "TES000060", "TES000061", "C000007", "TES000144" ], "formula": "TES000060 + TES000061 + C000007 + TES000144" } }, { "word_code": "tj02", "word_name": "评分标签", "type": "范围标签", "rule": { "type": "范围标签", "rules": [ { "minValue": "1", "maxValue": "50", "score": "严重.超级严重" } ] } } ],
  },
  {
    id: 2,
    scaleDescription: '用于评估患者焦虑程度的标准化量表',
    template_code: 'SCALE002',
    name: '焦虑自评量表',
    description: '',
    rulesList: [
      {
        id: 1,
        word_name: '11总胆红素',
        type: '范围编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000022',
        word_short: 'TBIL',
        rule: {
          type: '范围编码',
          rules: [
            { minValue: '0', maxValue: '2', score: '1' },
            { minValue: '2', maxValue: '3', score: '2' },
            { minValue: '3', maxValue: '999', score: '3' },
          ],
        },
      },
      {
        id: 2,
        word_name: '白蛋白',
        type: '数字编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000019',
        word_short: 'ALB',
        rule: {
          type: '数字编码',
          rules: [
            { originValue: '2.8', scoreValue: '1' },
            { originValue: '3.5', scoreValue: '2' },
          ],
        },
      },
      {
        id: 3,
        word_name: '凝血酶原时间',
        type: '范围编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000047',
        word_short: 'PT',
        rule: {
          type: '范围编码',
          rules: [
            { minValue: '0', maxValue: '4', score: '1' },
            { minValue: '4', maxValue: '6', score: '2' },
            { minValue: '6', maxValue: '999', score: '3' },
          ],
        },
      },
    ],
  },
  {
    id: 3,
    scaleDescription: '综合评估患者生活质量各个维度的量表',
    template_code: 'SCALE003',
    name: '生活质量评估量表',
    description: '',
    rulesList: [
      {
        id: 1,
        word_name: '总胆红素',
        type: '范围编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000022',
        word_short: 'TBIL',
        rule: {
          type: '范围编码',
          rules: [
            { minValue: '0', maxValue: '2', score: '1' },
            { minValue: '2', maxValue: '3', score: '2' },
            { minValue: '3', maxValue: '999', score: '3' },
          ],
        },
      },
      {
        id: 2,
        word_name: '白蛋白',
        type: '数字编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000019',
        word_short: 'ALB',
        rule: {
          type: '数字编码',
          rules: [
            { originValue: '2.8', scoreValue: '1' },
            { originValue: '3.5', scoreValue: '2' },
          ],
        },
      },
      {
        id: 3,
        word_name: '凝血酶原时间',
        type: '范围编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000047',
        word_short: 'PT',
        rule: {
          type: '范围编码',
          rules: [
            { minValue: '0', maxValue: '4', score: '1' },
            { minValue: '4', maxValue: '6', score: '2' },
            { minValue: '6', maxValue: '999', score: '3' },
          ],
        },
      },
    ],
  },
  {
    id: 4,
    scaleDescription: '简易精神状态检查量表，用于认知功能评估',
    template_code: 'SCALE004',
    name: 'MMSE认知功能量表',
    description: '',
    rulesList: [
      {
        id: 1,
        word_name: '总胆红素',
        type: '范围编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000022',
        word_short: 'TBIL',
        rule: {
          type: '范围编码',
          rules: [
            { minValue: '0', maxValue: '2', score: '1' },
            { minValue: '2', maxValue: '3', score: '2' },
            { minValue: '3', maxValue: '999', score: '3' },
          ],
        },
      },
      {
        id: 2,
        word_name: '白蛋白',
        type: '数字编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000019',
        word_short: 'ALB',
        rule: {
          type: '数字编码',
          rules: [
            { originValue: '2.8', scoreValue: '1' },
            { originValue: '3.5', scoreValue: '2' },
          ],
        },
      },
      {
        id: 3,
        word_name: '凝血酶原时间',
        type: '范围编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000047',
        word_short: 'PT',
        rule: {
          type: '范围编码',
          rules: [
            { minValue: '0', maxValue: '4', score: '1' },
            { minValue: '4', maxValue: '6', score: '2' },
            { minValue: '6', maxValue: '999', score: '3' },
          ],
        },
      },
    ],
  },
  {
    id: 5,
    scaleDescription: '数字评分法疼痛强度评估量表',
    template_code: 'SCALE005',
    name: '疼痛评估量表',
    description: '',
    rulesList: [
      {
        id: 1,
        word_name: '总胆红素',
        type: '范围编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000022',
        word_short: 'TBIL',
        rule: {
          type: '范围编码',
          rules: [
            { minValue: '0', maxValue: '2', score: '1' },
            { minValue: '2', maxValue: '3', score: '2' },
            { minValue: '3', maxValue: '999', score: '3' },
          ],
        },
      },
      {
        id: 2,
        word_name: '白蛋白',
        type: '数字编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000019',
        word_short: 'ALB',
        rule: {
          type: '数字编码',
          rules: [
            { originValue: '2.8', scoreValue: '1' },
            { originValue: '3.5', scoreValue: '2' },
          ],
        },
      },
      {
        id: 3,
        word_name: '凝血酶原时间',
        type: '范围编码',
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
        word_code: 'TES000047',
        word_short: 'PT',
        rule: {
          type: '范围编码',
          rules: [
            { minValue: '0', maxValue: '4', score: '1' },
            { minValue: '4', maxValue: '6', score: '2' },
            { minValue: '6', maxValue: '999', score: '3' },
          ],
        },
      },
    ],
  },
];


// const historyData = ref({
//   TES000060: [
//     { date: '2025-03-02 15:12', word_name: '阴离子间隙', value: '1.5' },
//     { date: '2025-03-15 12:10', word_name: '阴离子间隙', value: '1.2' },
//     { date: '2025-03-22 20:33', word_name: '阴离子间隙', value: '1.5' },
//     { date: '2025-04-01 11:29', word_name: '阴离子间隙', value: '1.0' },
//   ],
//   TES000061: [
//     { date: '2025-03-02 15:12', word_name: '标准碳酸氢盐', value: '3.2' },
//     { date: '2025-03-15 12:10', word_name: '标准碳酸氢盐', value: '2.8' },
//     { date: '2025-03-22 20:33', word_name: '标准碳酸氢盐', value: '3.0' },
//     { date: '2025-04-01 11:29', word_name: '标准碳酸氢盐', value: '2.5' },
//   ],
//   C000007: [
//     { date: '2025-03-02 15:12', word_name: '乳酸', value: '3.2' },
//     { date: '2025-03-15 12:10', word_name: '乳酸', value: '2.8' },
//     { date: '2025-03-22 20:33', word_name: '乳酸', value: '3.0' },
//     { date: '2025-04-01 11:29', word_name: '乳酸', value: '2.5' },
//   ],
//   TES000144: [
//     { date: '2025-03-02 15:12', word_name: '实际碳酸氢盐', value: '3.2' },
//     { date: '2025-03-15 12:10', word_name: '实际碳酸氢盐', value: '2.8' },
//     { date: '2025-03-22 20:33', word_name: '实际碳酸氢盐', value: '3.0' },
//     { date: '2025-04-01 11:29', word_name: '实际碳酸氢盐', value: '2.5' },
//   ],
// });

