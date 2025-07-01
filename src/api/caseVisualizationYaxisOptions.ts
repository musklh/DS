// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 根据病例编号查询Y轴选项（所有数值型词条） POST /case-visualization-yaxis-options/ */
export async function caseVisualizationYaxisOptionsCreate(
  body: {
    /** 病例编号 */
    case_code: string;
  },
  options?: { [key: string]: any }
) {
  return request<{ id?: number }>('/case-visualization-yaxis-options/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
