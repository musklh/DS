// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /document-charts/ */
export async function documentChartsList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentChartsListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.DocumentChart[];
  }>("/document-charts/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /document-charts/ */
export async function documentChartsCreate(
  body: API.DocumentChart,
  options?: { [key: string]: any }
) {
  return request<API.DocumentChart>("/document-charts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /document-charts/${param0}/ */
export async function documentChartsRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentChartsReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DocumentChart>(`/document-charts/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /document-charts/${param0}/ */
export async function documentChartsUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentChartsUpdateParams,
  body: API.DocumentChart,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DocumentChart>(`/document-charts/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /document-charts/${param0}/ */
export async function documentChartsDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentChartsDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/document-charts/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /document-charts/${param0}/ */
export async function documentChartsPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.documentChartsPartialUpdateParams,
  body: API.DocumentChart,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DocumentChart>(`/document-charts/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
