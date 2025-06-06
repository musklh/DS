// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /documents/ */
export async function documentsList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentsListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.Documents[];
  }>("/documents/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /documents/ */
export async function documentsCreate(
  body: API.Documents,
  options?: { [key: string]: any }
) {
  return request<API.Documents>("/documents/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /documents/${param0}/ */
export async function documentsRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentsReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Documents>(`/documents/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /documents/${param0}/ */
export async function documentsUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentsUpdateParams,
  body: API.Documents,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Documents>(`/documents/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /documents/${param0}/ */
export async function documentsDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentsDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/documents/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /documents/${param0}/ */
export async function documentsPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentsPartialUpdateParams,
  body: API.Documents,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Documents>(`/documents/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
