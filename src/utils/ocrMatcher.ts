/**
 * OCR识别结果智能匹配工具
 */

export interface TemplateField {
  word_code: string;
  word_name: string;
  word_short?: string;
}

export interface OcrItem {
  seq: string;
  item: string;
  result: string;
  reference_range: string;
  unit: string;
}

export interface MatchResult {
  word_code: string;
  word_name: string;
  ocr_item: string;
  result: string;
  confidence: number; // 匹配置信度 0-1
}

/**
 * 计算两个字符串的相似度（使用编辑距离算法）
 */
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  const matrix: number[][] = [];
  
  // 初始化矩阵
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // 计算编辑距离
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // 删除
        matrix[i][j - 1] + 1,     // 插入
        matrix[i - 1][j - 1] + cost // 替换
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return (maxLen - matrix[len1][len2]) / maxLen;
}

/**
 * 检查是否包含关键词匹配
 */
function hasKeywordMatch(templateName: string, ocrItem: string): boolean {
  // 移除常见的后缀词
  const cleanTemplate = templateName.replace(/(计数|比值|含量|体积|浓度|分布宽度|压积|指数)$/, '');
  const cleanOcr = ocrItem.replace(/(计数|比值|含量|体积|浓度|分布宽度|压积|指数)$/, '');
  
  // 检查核心关键词是否匹配
  const templateKeywords = cleanTemplate.split('').filter(char => /[\u4e00-\u9fa5]/.test(char));
  const ocrKeywords = cleanOcr.split('').filter(char => /[\u4e00-\u9fa5]/.test(char));
  
  // 计算关键词重叠度
  const overlap = templateKeywords.filter(keyword => ocrKeywords.includes(keyword)).length;
  const totalKeywords = Math.max(templateKeywords.length, ocrKeywords.length);
  
  return totalKeywords > 0 && (overlap / totalKeywords) >= 0.6;
}

/**
 * 特殊匹配规则（针对医学术语的特殊处理）
 */
function getSpecialMatchScore(templateName: string, ocrItem: string): number {
  // 血常规特殊匹配规则
  const specialRules: { [key: string]: string[] } = {
    '白细胞': ['WBC', '白细胞计数', '白细胞总数'],
    '红细胞': ['RBC', '红细胞计数', '红细胞总数'],
    '血红蛋白': ['HGB', 'Hb', '血红蛋白浓度'],
    '血小板': ['PLT', '血小板计数', '血小板总数'],
    '中性粒细胞': ['NEUT', '中性粒细胞', '中性细胞'],
    '淋巴细胞': ['LYM', '淋巴细胞', '淋巴细胞'],
    '单核细胞': ['MONO', '单核细胞', '单个核细胞'],
    '嗜酸性粒细胞': ['EOS', '嗜酸性粒细胞', '嗜酸细胞'],
    '嗜碱性粒细胞': ['BASO', '嗜碱性粒细胞', '嗜碱细胞'],
    '红细胞压积': ['HCT', 'Hct', '血细胞比容'],
    '平均红细胞体积': ['MCV', '平均红细胞体积'],
    '平均红细胞血红蛋白含量': ['MCH', '平均红细胞血红蛋白含量'],
    '平均红细胞血红蛋白浓度': ['MCHC', '平均红细胞血红蛋白浓度'],
    '红细胞分布宽度': ['RDW', '红细胞分布宽度'],
    '血小板平均体积': ['MPV', '血小板平均体积'],
    '血小板分布宽度': ['PDW', '血小板分布宽度'],
    '血小板压积': ['PCT', '血小板压积'],
  };
  
  // 检查模板名称是否匹配特殊规则
  for (const [key, aliases] of Object.entries(specialRules)) {
    if (templateName.includes(key)) {
      for (const alias of aliases) {
        if (ocrItem.includes(alias) || ocrItem.includes(key)) {
          return 0.9; // 高置信度匹配
        }
      }
    }
  }
  
  return 0;
}

/**
 * 智能匹配OCR结果与模板字段
 */
export function matchOcrWithTemplate(
  templateFields: TemplateField[],
  ocrResults: OcrItem[],
  minConfidence: number = 0.6
): MatchResult[] {
  const matches: MatchResult[] = [];
  const usedOcrItems = new Set<string>();
  
  // 为每个模板字段寻找最佳匹配
  for (const field of templateFields) {
    let bestMatch: MatchResult | null = null;
    
    for (const ocrItem of ocrResults) {
      // 跳过已经使用的OCR项目
      if (usedOcrItems.has(ocrItem.seq)) continue;
      
      // 计算多种匹配分数
      const directSimilarity = calculateSimilarity(field.word_name, ocrItem.item);
      const keywordMatch = hasKeywordMatch(field.word_name, ocrItem.item);
      const specialScore = getSpecialMatchScore(field.word_name, ocrItem.item);
      
      // 综合计算置信度
      let confidence = Math.max(directSimilarity, specialScore);
      
      // 如果有关键词匹配，提升置信度
      if (keywordMatch) {
        confidence = Math.max(confidence, 0.7);
      }
      
      // 如果置信度达到阈值，考虑作为候选匹配
      if (confidence >= minConfidence) {
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = {
            word_code: field.word_code,
            word_name: field.word_name,
            ocr_item: ocrItem.item,
            result: ocrItem.result,
            confidence: confidence
          };
        }
      }
    }
    
    // 如果找到最佳匹配，添加到结果中并标记OCR项目为已使用
    if (bestMatch) {
      matches.push(bestMatch);
      // 找到对应的OCR项目并标记为已使用
      const matchedOcrItem = ocrResults.find(item => item.item === bestMatch!.ocr_item);
      if (matchedOcrItem) {
        usedOcrItems.add(matchedOcrItem.seq);
      }
    }
  }
  
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * 将匹配结果转换为表单数据格式
 */
export function convertMatchesToFormData(matches: MatchResult[]): { [key: string]: string } {
  const formData: { [key: string]: string } = {};
  
  for (const match of matches) {
    formData[match.word_code] = match.result;
  }
  
  return formData;
}

/**
 * 获取匹配统计信息
 */
export function getMatchStatistics(
  templateFields: TemplateField[],
  matches: MatchResult[]
): {
  totalFields: number;
  matchedFields: number;
  matchRate: number;
  averageConfidence: number;
} {
  const totalFields = templateFields.length;
  const matchedFields = matches.length;
  const matchRate = totalFields > 0 ? matchedFields / totalFields : 0;
  const averageConfidence = matches.length > 0 
    ? matches.reduce((sum, match) => sum + match.confidence, 0) / matches.length 
    : 0;
  
  return {
    totalFields,
    matchedFields,
    matchRate,
    averageConfidence
  };
} 