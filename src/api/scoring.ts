import request from '../request';

// 评分计算
export function calculateScoring(data: any) {
  return request.post('scoring-calculation/', data);
}

// 获取评分结果列表
export function getScoringResults(caseCode: string) {
  return request.get('scoring-result/', { params: { case_code: caseCode } });
}

// 获取评分系统
export function getScoringSystems() {
  return request.get('scoring-system/');
}

// 获取评分明细
export function getScoringResultDetail(id: number) {
  return request.get(`scoring-result/${id}/`);
} 