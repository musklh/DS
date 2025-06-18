// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** API endpoint for 病例管理. - **Create**: POST /api/case/
  - `case_code` 自动生成
  - Required: `identity`, `name`, `gender`, `birth_date`
  - Optional: `opd_id`, `inhospital_id`, `phone_number`, `home_address`, `blood_type`, 
             `main_diagnosis`, `has_transplant_surgery`, `is_in_transplant_queue`, `archives`

- **List**: GET /api/case/
  - 支持分页: ?page=1&page_size=10
  - 支持模糊搜索: ?search=xxx（可模糊搜索档案编号、身份证号、门诊号、住院号、姓名）

- **Retrieve**: GET /api/case/{case_code}/
  - 返回病例详细信息，包括关联的档案

- **Update**: PUT /api/case/{case_code}/
  - 可更新除case_code外的所有字段

- **Delete**: DELETE /api/case/{case_code}/

- **Identity Cases**: GET /api/case/identity/{identity_id}/
  - 获取指定身份证号的所有病例 GET /case/ */
export async function caseList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.caseListParams,
  options?: { [key: string]: any }
) {
  return request<{ count: number; next?: string; previous?: string; results: API.CaseList[] }>(
    '/case/',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** API endpoint for 病例管理. - **Create**: POST /api/case/
  - `case_code` 自动生成
  - Required: `identity`, `name`, `gender`, `birth_date`
  - Optional: `opd_id`, `inhospital_id`, `phone_number`, `home_address`, `blood_type`, 
             `main_diagnosis`, `has_transplant_surgery`, `is_in_transplant_queue`, `archives`

- **List**: GET /api/case/
  - 支持分页: ?page=1&page_size=10
  - 支持模糊搜索: ?search=xxx（可模糊搜索档案编号、身份证号、门诊号、住院号、姓名）

- **Retrieve**: GET /api/case/{case_code}/
  - 返回病例详细信息，包括关联的档案

- **Update**: PUT /api/case/{case_code}/
  - 可更新除case_code外的所有字段

- **Delete**: DELETE /api/case/{case_code}/

- **Identity Cases**: GET /api/case/identity/{identity_id}/
  - 获取指定身份证号的所有病例 POST /case/ */
export async function caseCreate(body: API.CaseDetail, options?: { [key: string]: any }) {
  return request<API.CaseDetail>('/case/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 病例管理. - **Create**: POST /api/case/
  - `case_code` 自动生成
  - Required: `identity`, `name`, `gender`, `birth_date`
  - Optional: `opd_id`, `inhospital_id`, `phone_number`, `home_address`, `blood_type`, 
             `main_diagnosis`, `has_transplant_surgery`, `is_in_transplant_queue`, `archives`

- **List**: GET /api/case/
  - 支持分页: ?page=1&page_size=10
  - 支持模糊搜索: ?search=xxx（可模糊搜索档案编号、身份证号、门诊号、住院号、姓名）

- **Retrieve**: GET /api/case/{case_code}/
  - 返回病例详细信息，包括关联的档案

- **Update**: PUT /api/case/{case_code}/
  - 可更新除case_code外的所有字段

- **Delete**: DELETE /api/case/{case_code}/

- **Identity Cases**: GET /api/case/identity/{identity_id}/
  - 获取指定身份证号的所有病例 GET /case/${param0}/ */
export async function caseRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.caseReadParams,
  options?: { [key: string]: any }
) {
  const { case_code: param0, ...queryParams } = params;
  return request<API.CaseDetail>(`/case/${param0}/`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 病例管理. - **Create**: POST /api/case/
  - `case_code` 自动生成
  - Required: `identity`, `name`, `gender`, `birth_date`
  - Optional: `opd_id`, `inhospital_id`, `phone_number`, `home_address`, `blood_type`, 
             `main_diagnosis`, `has_transplant_surgery`, `is_in_transplant_queue`, `archives`

- **List**: GET /api/case/
  - 支持分页: ?page=1&page_size=10
  - 支持模糊搜索: ?search=xxx（可模糊搜索档案编号、身份证号、门诊号、住院号、姓名）

- **Retrieve**: GET /api/case/{case_code}/
  - 返回病例详细信息，包括关联的档案

- **Update**: PUT /api/case/{case_code}/
  - 可更新除case_code外的所有字段

- **Delete**: DELETE /api/case/{case_code}/

- **Identity Cases**: GET /api/case/identity/{identity_id}/
  - 获取指定身份证号的所有病例 PUT /case/${param0}/ */
export async function caseUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.caseUpdateParams,
  body: API.CaseDetail,
  options?: { [key: string]: any }
) {
  const { case_code: param0, ...queryParams } = params;
  return request<API.CaseDetail>(`/case/${param0}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 病例管理. - **Create**: POST /api/case/
  - `case_code` 自动生成
  - Required: `identity`, `name`, `gender`, `birth_date`
  - Optional: `opd_id`, `inhospital_id`, `phone_number`, `home_address`, `blood_type`, 
             `main_diagnosis`, `has_transplant_surgery`, `is_in_transplant_queue`, `archives`

- **List**: GET /api/case/
  - 支持分页: ?page=1&page_size=10
  - 支持模糊搜索: ?search=xxx（可模糊搜索档案编号、身份证号、门诊号、住院号、姓名）

- **Retrieve**: GET /api/case/{case_code}/
  - 返回病例详细信息，包括关联的档案

- **Update**: PUT /api/case/{case_code}/
  - 可更新除case_code外的所有字段

- **Delete**: DELETE /api/case/{case_code}/

- **Identity Cases**: GET /api/case/identity/{identity_id}/
  - 获取指定身份证号的所有病例 DELETE /case/${param0}/ */
export async function caseDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.caseDeleteParams,
  options?: { [key: string]: any }
) {
  const { case_code: param0, ...queryParams } = params;
  return request<any>(`/case/${param0}/`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 病例管理. - **Create**: POST /api/case/
  - `case_code` 自动生成
  - Required: `identity`, `name`, `gender`, `birth_date`
  - Optional: `opd_id`, `inhospital_id`, `phone_number`, `home_address`, `blood_type`, 
             `main_diagnosis`, `has_transplant_surgery`, `is_in_transplant_queue`, `archives`

- **List**: GET /api/case/
  - 支持分页: ?page=1&page_size=10
  - 支持模糊搜索: ?search=xxx（可模糊搜索档案编号、身份证号、门诊号、住院号、姓名）

- **Retrieve**: GET /api/case/{case_code}/
  - 返回病例详细信息，包括关联的档案

- **Update**: PUT /api/case/{case_code}/
  - 可更新除case_code外的所有字段

- **Delete**: DELETE /api/case/{case_code}/

- **Identity Cases**: GET /api/case/identity/{identity_id}/
  - 获取指定身份证号的所有病例 PATCH /case/${param0}/ */
export async function casePartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.casePartialUpdateParams,
  body: API.CaseDetail,
  options?: { [key: string]: any }
) {
  const { case_code: param0, ...queryParams } = params;
  return request<API.CaseDetail>(`/case/${param0}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取指定身份证号的所有病例 GET /case/identity/${param0}/ */
export async function caseIdentityCases(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.caseIdentityCasesParams,
  options?: { [key: string]: any }
) {
  const { identity_id: param0, ...queryParams } = params;
  return request<{ count: number; next?: string; previous?: string; results: API.CaseDetail[] }>(
    `/case/identity/${param0}/`,
    {
      method: 'GET',
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}
