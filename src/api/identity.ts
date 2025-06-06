// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /identity/ */
export async function identityList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.identityListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.Identity[];
  }>("/identity/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /identity/ */
export async function identityCreate(
  body: API.Identity,
  options?: { [key: string]: any }
) {
  return request<API.Identity>("/identity/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /identity/${param0}/ */
export async function identityRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.identityReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Identity>(`/identity/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /identity/${param0}/ */
export async function identityUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.identityUpdateParams,
  body: API.Identity,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Identity>(`/identity/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /identity/${param0}/ */
export async function identityDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.identityDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/identity/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /identity/${param0}/ */
export async function identityPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.identityPartialUpdateParams,
  body: API.Identity,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Identity>(`/identity/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
