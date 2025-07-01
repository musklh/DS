// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 根据病例编号查询X轴选项（所有有数据的时间点，精确到秒） POST /case-visualization-xaxis-options/ */
export async function caseVisualizationXaxisOptionsCreate(
  body: {
    /** 病例编号 */
    case_code: string;
    /** Y轴选中的词条编号 */
    y_axis_word_code: string;
  },
  options?: { [key: string]: any }
) {
  return request<{ id?: number }>('/case-visualization-xaxis-options/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
