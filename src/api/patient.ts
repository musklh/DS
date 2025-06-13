// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** API endpoint for 患者管理. 只支持患者信息的查询和更新，不支持创建和删除。
患者信息会在创建病例时自动创建或更新。

- **List**: GET /api/patient/
  - 支持分页和搜索：?search=xxx（可搜索：身份证号、姓名）

- **Retrieve**: GET /api/patient/{identity_id}/
  - 返回患者详情及其所有病例

- **Update**: PUT /api/patient/{identity_id}/
  - 可更新患者的基本信息 GET /patient/ */
export async function patientList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patientListParams,
  options?: { [key: string]: any }
) {
  return request<{ count: number; next?: string; previous?: string; results: API.Identity[] }>(
    '/patient/',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** API endpoint for 患者管理. 只支持患者信息的查询和更新，不支持创建和删除。
患者信息会在创建病例时自动创建或更新。

- **List**: GET /api/patient/
  - 支持分页和搜索：?search=xxx（可搜索：身份证号、姓名）

- **Retrieve**: GET /api/patient/{identity_id}/
  - 返回患者详情及其所有病例

- **Update**: PUT /api/patient/{identity_id}/
  - 可更新患者的基本信息 GET /patient/${param0}/ */
export async function patientRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patientReadParams,
  options?: { [key: string]: any }
) {
  const { identity_id: param0, ...queryParams } = params;
  return request<API.PatientDetail>(`/patient/${param0}/`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 患者管理. 只支持患者信息的查询和更新，不支持创建和删除。
患者信息会在创建病例时自动创建或更新。

- **List**: GET /api/patient/
  - 支持分页和搜索：?search=xxx（可搜索：身份证号、姓名）

- **Retrieve**: GET /api/patient/{identity_id}/
  - 返回患者详情及其所有病例

- **Update**: PUT /api/patient/{identity_id}/
  - 可更新患者的基本信息 PUT /patient/${param0}/ */
export async function patientUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patientUpdateParams,
  body: API.Identity,
  options?: { [key: string]: any }
) {
  const { identity_id: param0, ...queryParams } = params;
  return request<API.Identity>(`/patient/${param0}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 患者管理. 只支持患者信息的查询和更新，不支持创建和删除。
患者信息会在创建病例时自动创建或更新。

- **List**: GET /api/patient/
  - 支持分页和搜索：?search=xxx（可搜索：身份证号、姓名）

- **Retrieve**: GET /api/patient/{identity_id}/
  - 返回患者详情及其所有病例

- **Update**: PUT /api/patient/{identity_id}/
  - 可更新患者的基本信息 PATCH /patient/${param0}/ */
export async function patientPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patientPartialUpdateParams,
  body: API.Identity,
  options?: { [key: string]: any }
) {
  const { identity_id: param0, ...queryParams } = params;
  return request<API.Identity>(`/patient/${param0}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取患者所有病例的数据 GET /patient/${param0}/case-data/ */
export async function patientCaseData(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patientCaseDataParams,
  options?: { [key: string]: any }
) {
  const { identity_id: param0, ...queryParams } = params;
  return request<API.Identity>(`/patient/${param0}/case-data/`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
