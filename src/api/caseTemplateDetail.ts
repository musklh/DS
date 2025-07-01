// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 传入病例编号、模板编号和检查时间，返回该病例下该模板该次检查的所有词条及其值、检查时间、模板名称。

注意：check_time为必填，精确到时分秒。 POST /case-template-detail/ */
export async function caseTemplateDetailCreate(
  body: {
    /** 病例编号 */
    case_code: string;
    /** 模板编号 */
    template_code: string;
    /** 检查时间，格式YYYY-MM-DD HH:MM:SS */
    check_time: string;
  },
  options?: { [key: string]: any }
) {
  return request<{ id?: number }>('/case-template-detail/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
