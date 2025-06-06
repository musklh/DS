// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /examination-sheets/ */
export async function examinationSheetsList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationSheetsListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.ExaminationSheet[];
  }>("/examination-sheets/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /examination-sheets/ */
export async function examinationSheetsCreate(
  body: API.ExaminationSheet,
  options?: { [key: string]: any }
) {
  return request<API.ExaminationSheet>("/examination-sheets/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /examination-sheets/${param0}/ */
export async function examinationSheetsRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationSheetsReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ExaminationSheet>(`/examination-sheets/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /examination-sheets/${param0}/ */
export async function examinationSheetsUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationSheetsUpdateParams,
  body: API.ExaminationSheet,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ExaminationSheet>(`/examination-sheets/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /examination-sheets/${param0}/ */
export async function examinationSheetsDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationSheetsDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/examination-sheets/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /examination-sheets/${param0}/ */
export async function examinationSheetsPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationSheetsPartialUpdateParams,
  body: API.ExaminationSheet,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ExaminationSheet>(`/examination-sheets/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
