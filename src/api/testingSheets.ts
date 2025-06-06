// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /testing-sheets/ */
export async function testingSheetsList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testingSheetsListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.TestingSheet[];
  }>("/testing-sheets/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /testing-sheets/ */
export async function testingSheetsCreate(
  body: API.TestingSheet,
  options?: { [key: string]: any }
) {
  return request<API.TestingSheet>("/testing-sheets/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /testing-sheets/${param0}/ */
export async function testingSheetsRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testingSheetsReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.TestingSheet>(`/testing-sheets/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /testing-sheets/${param0}/ */
export async function testingSheetsUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testingSheetsUpdateParams,
  body: API.TestingSheet,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.TestingSheet>(`/testing-sheets/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /testing-sheets/${param0}/ */
export async function testingSheetsDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testingSheetsDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/testing-sheets/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /testing-sheets/${param0}/ */
export async function testingSheetsPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testingSheetsPartialUpdateParams,
  body: API.TestingSheet,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.TestingSheet>(`/testing-sheets/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
