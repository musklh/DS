// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 获取患者列表，每个患者只展示一行，字段为所有病例中最新非空值。支持分页和档案编号筛选。 GET /patient-merged-case/ */
export async function patientMergedCaseList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patientMergedCaseListParams,
  options?: { [key: string]: any }
) {
  return request<{ id?: number }>('/patient-merged-case/', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 10
      page_size: '10',
      ...params,
    },
    ...(options || {}),
  });
}
