// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 根据选择的X轴和Y轴，返回对应的数据值。 POST /case-visualization-data/ */
export async function caseVisualizationDataCreate(
  body: {
    /** 病例编号 */
    case_code: string;
    /** X轴词条编号数组，例如["TES000001"] */
    x_axis_word_code: string[];
    /** Y轴时间数组，例如["2025-06-18 04:36:00", "2025-06-19 04:41:00"] */
    y_axis_times: string[];
  },
  options?: { [key: string]: any }
) {
  return request<{ id?: number }>('/case-visualization-data/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
