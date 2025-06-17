// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 根据选择的X轴和Y轴，返回对应的数据值。 POST /case-visualization-data/ */
export async function caseVisualizationDataCreate(
  body: {
    /** 病例编号 */
    case_code: string;
    /** X轴词条编号列表，例如["2024-06-01", "2024-06-02"] */
    x_axis_word_codes: string[];
    /** Y轴词条编号列表，例如["A000001", "A000002"] */
    y_axis_word_codes: string[];
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
