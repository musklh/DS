// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /cases/ */
export async function casesList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.casesListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.Cases[];
  }>("/cases/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /cases/ */
export async function casesCreate(
  body: API.Cases,
  options?: { [key: string]: any }
) {
  return request<API.Cases>("/cases/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /cases/${param0}/ */
export async function casesRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.casesReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Cases>(`/cases/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /cases/${param0}/ */
export async function casesUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.casesUpdateParams,
  body: API.Cases,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Cases>(`/cases/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /cases/${param0}/ */
export async function casesDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.casesDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/cases/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /cases/${param0}/ */
export async function casesPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.casesPartialUpdateParams,
  body: API.Cases,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Cases>(`/cases/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
