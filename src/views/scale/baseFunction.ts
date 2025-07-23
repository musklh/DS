import { ElMessage } from 'element-plus';

/**
 * 应用规则方法进行左边计算包括词条
 * @param scoreItems 评分项目数组
 * @param rules 规则数组
 * @param ratingLabels 评分标签ref
 */
export const applyRules = (scoreItems: any, rules: any, ratingLabels: any) => {
  scoreItems.value.forEach((scoreItem: any) => {
    // 首先检查 word_name 是否包含"评分"
    if (scoreItem.word_name.includes('评分')) {
      return;
    }
    
    if (!scoreItem.value) {
      ElMessage.error(`请填写${scoreItem.word_name}`);
      return;
    }
    scoreItem.value = Number(scoreItem.value);
    const matchedRule = rules.value.find((rule: any) => rule.word_name === scoreItem.word_name);

    // 代数换算 - 对数
    if (
      matchedRule &&
      matchedRule.type &&
      matchedRule.type === '代数换算' &&
      matchedRule.rule &&
      matchedRule.rule.function &&
      matchedRule.rule.function === '对数'
    ) {
      if (scoreItem.value > 0) {
        scoreItem.score = Number(Math.log(scoreItem.value).toFixed(3));
      } else {
        ElMessage.error(`${scoreItem.word_name}的值必须大于0才能进行对数换算`);
        return;
      }
    }

    // 代数换算 - 平方
    if (
      matchedRule &&
      matchedRule.type &&
      matchedRule.type === '代数换算' &&
      matchedRule.rule &&
      matchedRule.rule.function &&
      matchedRule.rule.function === '平方'
    ) {
      scoreItem.score = Number(Math.pow(scoreItem.value, 2).toFixed(3));
    }

    // 代数换算 - 指数
    if (
      matchedRule &&
      matchedRule.type &&
      matchedRule.type === '代数换算' &&
      matchedRule.rule &&
      matchedRule.rule.function &&
      matchedRule.rule.function === '指数'
    ) {
      scoreItem.score = Number(Math.exp(scoreItem.value).toFixed(3));
    }

    // 代数换算 - 倒数
    if (
      matchedRule &&
      matchedRule.type &&
      matchedRule.type === '代数换算' &&
      matchedRule.rule &&
      matchedRule.rule.function &&
      matchedRule.rule.function === '倒数'
    ) {
      if (scoreItem.value !== 0) {
        scoreItem.score = Number((1 / scoreItem.value).toFixed(3));
      } else {
        ElMessage.error(`${scoreItem.word_name}的值不能为0，无法进行倒数换算`);
        return;
      }
    }

    // 范围编码
    if (
      matchedRule &&
      matchedRule.type &&
      matchedRule.type === '范围编码' &&
      matchedRule.rule &&
      matchedRule.rule.rules
    ) {
      const ruleItems = matchedRule.rule.rules;
      const itemValue = parseFloat(scoreItem.value);
      if (!scoreItem.value || isNaN(itemValue)) {
        return;
      }

      const matchedRuleItem = ruleItems.find((ruleItem: any) => {
        const minValue = parseFloat(ruleItem.minValue);
        const maxValue = parseFloat(ruleItem.maxValue);
        return itemValue >= minValue && itemValue <= maxValue;
      });

      if (matchedRuleItem) {
        scoreItem.score = matchedRuleItem.score;
      }
    }

    // 数字编码
    if (
      matchedRule &&
      matchedRule.type &&
      matchedRule.type === '数字编码' &&
      matchedRule.rule &&
      matchedRule.rule.rules
    ) {
      const ruleItems = matchedRule.rule.rules;
      const itemValue = parseFloat(scoreItem.value);
      if (!scoreItem.value || isNaN(itemValue)) {
        return;
      }

      const matchedRuleItem = ruleItems.find((ruleItem: any) => {
        const originValue = parseFloat(ruleItem.originValue);
        return itemValue === originValue;
      });
      if (matchedRuleItem) {
        scoreItem.score = matchedRuleItem.scoreValue;
      }
    }
  });

  // 处理评分分级和评分标签
  rules.value.forEach((item: any) => {
    // 检查是否包含"评分"且不包含"标签" - 评分分级
    if (item.word_name.includes('评分') && !item.word_name.includes('标签')) {
      if (item.rule.selectedAttrs) {
        let totalScore = 0;

        item.rule.selectedAttrs.forEach((code: string) => {
          const matchedScoreItem = scoreItems.value.find((score: any) => score.word_code === code);
          if (matchedScoreItem && matchedScoreItem.score) {
            totalScore += Number(matchedScoreItem.score);
          }
        });
        const gradingItem = scoreItems.value.find((item: any) => item.word_name.includes('评分') && !item.word_name.includes('标签'));
        if (gradingItem) {
          gradingItem.score = totalScore;
          gradingItem.value = totalScore;
        }
      }
    }

    // 检查是否包含"评分"且包含"标签" - 评分标签
    if (item.word_name.includes('评分') && item.word_name.includes('标签')) {
      const labelRule = rules.value.find((rule: any) => rule.word_name.includes('评分') && rule.word_name.includes('标签'));

      if (labelRule && labelRule.rule && labelRule.rule.rules) {
        const ruleItems = labelRule.rule.rules;
        const gradingItem = scoreItems.value.find((item: any) => item.word_name.includes('评分') && !item.word_name.includes('标签'));

        const matchedRuleItem = ruleItems.find((ruleItem: any) => {
          const minValue = parseFloat(ruleItem.minValue);
          const maxValue = parseFloat(ruleItem.maxValue);
          return gradingItem.score >= minValue && gradingItem.score <= maxValue;
        });
        if (matchedRuleItem) {
          ratingLabels.value = matchedRuleItem.score;
          const labelItem = scoreItems.value.find((item: any) => item.word_name.includes('评分') && item.word_name.includes('标签'));
          if (labelItem) {
            labelItem.score = matchedRuleItem.score;
            labelItem.value = matchedRuleItem.score;
          }
        }
      }
    }
  });
  ElMessage.success('规则应用成功');
};