// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /data-tables/ */
export async function dataTablesList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTablesListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.DataTable[];
  }>("/data-tables/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /data-tables/ */
export async function dataTablesCreate(
  body: API.DataTable,
  options?: { [key: string]: any }
) {
  return request<API.DataTable>("/data-tables/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /data-tables/${param0}/ */
export async function dataTablesRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTablesReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTable>(`/data-tables/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /data-tables/${param0}/ */
export async function dataTablesUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTablesUpdateParams,
  body: API.DataTable,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTable>(`/data-tables/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /data-tables/${param0}/ */
export async function dataTablesDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTablesDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/data-tables/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /data-tables/${param0}/ */
export async function dataTablesPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTablesPartialUpdateParams,
  body: API.DataTable,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTable>(`/data-tables/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
