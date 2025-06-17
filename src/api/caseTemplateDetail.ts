// @ts-ignore
/* eslint-disable */
import request from '../request';
import type { AxiosResponse } from 'axios';

export interface TemplateDetailItem {
  word_code: string;
  word_name: string;
  value: string;
}

export interface TemplateDetailData {
  template_name: string;
  check_time: string;
  items: TemplateDetailItem[];
}

export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

/** 传入病例编号和模板编号，返回该病例下该模板的所有词条及其值、检查时间、模板名称。 POST /case-template-detail/ */
export async function caseTemplateDetailCreate(
  body: {
    /** 病例编号 */
    case_code: string;
    /** 模板编号 */
    template_code: string;
  },
  options?: { [key: string]: any }
): Promise<AxiosResponse<ApiResponse<TemplateDetailData>>> {
  return request<ApiResponse<TemplateDetailData>>('/case-template-detail/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
