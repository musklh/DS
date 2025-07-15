// @ts-ignore
/* eslint-disable */
import request from '../request';

/** API endpoint for 系统词条 (System Dictionary). - **Create**: POST /api/dictionary/
  - `word_code` is auto-generated.
  - Required fields: `word_name`, `word_class`, `word_apply`.
  - Optional fields: `word_eng`, `word_short`, `word_belong`, `data_type`.
- **List**: GET /api/dictionary/
  - 支持分页: ?page=1&page_size=10
- **Retrieve**: GET /api/dictionary/{word_code}/
- **Update**: PUT /api/dictionary/{word_code}/ (all fields except word_code)
- **Partial Update**: PATCH /api/dictionary/{word_code}/ (specified fields except word_code)
- **Delete**: DELETE /api/dictionary/{word_code}/ GET /dictionary/ */
export async function dictionaryList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryListParams,
  options?: { [key: string]: any }
) {
  return request<{ count: number; next?: string; previous?: string; results: API.Dictionary[] }>(
    '/dictionary/',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 创建词条 POST /dictionary/ */
export async function dictionaryCreate(
  body: {
    /** 中文名称 */
    word_name: string;
    /** 英文名称 */
    word_eng?: string;
    /** 英文缩写 */
    word_short?: string;
    /** 词条类型 */
    word_class: string;
    /** 词条应用 */
    word_apply: string;
    /** 从属别名 */
    word_belong?: string;
    /** 数据类型 */
    data_type?: string;
    /** 填写方式 */
    input_type: string;
    /** 主选项 */
    options: string;
    /** 后续选项 */
    followup_options?: Record<string, any>;
    /** 是否有单位 0-无 1-有 */
    has_unit?: number;
    /** 词条单位 */
    unit?: string;
    /** 是否为评分词条 0-不是 1-是 */
    is_score?: number;
    /** 评分计算方式 */
    score_func?: string;
  },
  options?: { [key: string]: any }
) {
  return request<{
    word_name: string;
    word_eng?: string;
    word_short?: string;
    word_class: string;
    word_apply: string;
    word_belong?: string;
    data_type?: string;
    input_type: string;
    options: string;
    followup_options?: Record<string, any>;
    has_unit?: number;
    unit?: string;
    is_score?: number;
    score_func?: string;
  }>('/dictionary/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 系统词条 (System Dictionary). - **Create**: POST /api/dictionary/
  - `word_code` is auto-generated.
  - Required fields: `word_name`, `word_class`, `word_apply`.
  - Optional fields: `word_eng`, `word_short`, `word_belong`, `data_type`.
- **List**: GET /api/dictionary/
  - 支持分页: ?page=1&page_size=10
- **Retrieve**: GET /api/dictionary/{word_code}/
- **Update**: PUT /api/dictionary/{word_code}/ (all fields except word_code)
- **Partial Update**: PATCH /api/dictionary/{word_code}/ (specified fields except word_code)
- **Delete**: DELETE /api/dictionary/{word_code}/ GET /dictionary/${param0}/ */
export async function dictionaryRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryReadParams,
  options?: { [key: string]: any }
) {
  const { word_code: param0, ...queryParams } = params;
  return request<API.Dictionary>(`/dictionary/${param0}/`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 系统词条 (System Dictionary). - **Create**: POST /api/dictionary/
  - `word_code` is auto-generated.
  - Required fields: `word_name`, `word_class`, `word_apply`.
  - Optional fields: `word_eng`, `word_short`, `word_belong`, `data_type`.
- **List**: GET /api/dictionary/
  - 支持分页: ?page=1&page_size=10
- **Retrieve**: GET /api/dictionary/{word_code}/
- **Update**: PUT /api/dictionary/{word_code}/ (all fields except word_code)
- **Partial Update**: PATCH /api/dictionary/{word_code}/ (specified fields except word_code)
- **Delete**: DELETE /api/dictionary/{word_code}/ PUT /dictionary/${param0}/ */
export async function dictionaryUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryUpdateParams,
  body: {
    word_name: string;
    word_eng?: string;
    word_short?: string;
    word_class: string;
    word_apply: string;
    word_belong?: string;
    data_type?: string;
    input_type: string;
    options: string;
    followup_options?: Record<string, any>;
    has_unit?: number;
    unit?: string;
    is_score?: number;
    score_func?: string;
  },
  options?: { [key:string]: any }
) {
  const { word_code: param0, ...queryParams } = params;
  return request<API.Dictionary>(`/dictionary/${param0}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 系统词条 (System Dictionary). - **Create**: POST /api/dictionary/
  - `word_code` is auto-generated.
  - Required fields: `word_name`, `word_class`, `word_apply`.
  - Optional fields: `word_eng`, `word_short`, `word_belong`, `data_type`.
- **List**: GET /api/dictionary/
  - 支持分页: ?page=1&page_size=10
- **Retrieve**: GET /api/dictionary/{word_code}/
- **Update**: PUT /api/dictionary/{word_code}/ (all fields except word_code)
- **Partial Update**: PATCH /api/dictionary/{word_code}/ (specified fields except word_code)
- **Delete**: DELETE /api/dictionary/{word_code}/ DELETE /dictionary/${param0}/ */
export async function dictionaryDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryDeleteParams,
  options?: { [key: string]: any }
) {
  const { word_code: param0, ...queryParams } = params;
  return request<any>(`/dictionary/${param0}/`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 系统词条 (System Dictionary). - **Create**: POST /api/dictionary/
  - `word_code` is auto-generated.
  - Required fields: `word_name`, `word_class`, `word_apply`.
  - Optional fields: `word_eng`, `word_short`, `word_belong`, `data_type`.
- **List**: GET /api/dictionary/
  - 支持分页: ?page=1&page_size=10
- **Retrieve**: GET /api/dictionary/{word_code}/
- **Update**: PUT /api/dictionary/{word_code}/ (all fields except word_code)
- **Partial Update**: PATCH /api/dictionary/{word_code}/ (specified fields except word_code)
- **Delete**: DELETE /api/dictionary/{word_code}/ PATCH /dictionary/${param0}/ */
export async function dictionaryPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryPartialUpdateParams,
  body: API.Dictionary,
  options?: { [key: string]: any }
) {
  const { word_code: param0, ...queryParams } = params;
  return request<API.Dictionary>(`/dictionary/${param0}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
