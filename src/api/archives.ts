// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /archives/ */
export async function archivesList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archivesListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.Archive[];
  }>("/archives/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /archives/ */
export async function archivesCreate(
  body: API.Archive,
  options?: { [key: string]: any }
) {
  return request<API.Archive>("/archives/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /archives/${param0}/ */
export async function archivesRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archivesReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Archive>(`/archives/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /archives/${param0}/ */
export async function archivesUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archivesUpdateParams,
  body: API.Archive,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Archive>(`/archives/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /archives/${param0}/ */
export async function archivesDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archivesDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/archives/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /archives/${param0}/ */
export async function archivesPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archivesPartialUpdateParams,
  body: API.Archive,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Archive>(`/archives/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
