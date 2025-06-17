// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 传入一个或多个病例编号（case_code），返回这些病例的所有数据模板下的数据，包含模板分类、模板名称、模板编号、检查时间。 POST /case-template-summary/ */
export async function caseTemplateSummaryCreate(
  body: {
    /** 病例编号列表，如["XA568942", "XA584523"] */
    case_codes: string[];
  },
  options?: { [key: string]: any }
) {
  return request<{ id?: number }>('/case-template-summary/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
