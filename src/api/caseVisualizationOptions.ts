// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 根据病例编号查询X轴和Y轴的信息。 POST /case-visualization-options/ */
export async function caseVisualizationOptionsCreate(
  body: {
    /** 病例编号 */
    case_code: string;
  },
  options?: { [key: string]: any }
) {
  return request<{ id?: number }>('/case-visualization-options/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}



