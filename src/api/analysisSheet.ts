// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 获取所有分析表 & 创建分析表 GET /analysis-sheet/ */
export async function analysisSheetList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.analysisSheetListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.AnalysisSheet[];
  }>("/analysis-sheet/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取所有分析表 & 创建分析表 POST /analysis-sheet/ */
export async function analysisSheetCreate(
  body: API.AnalysisSheet,
  options?: { [key: string]: any }
) {
  return request<API.AnalysisSheet>("/analysis-sheet/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的分析表 GET /analysis-sheet/${param0}/ */
export async function analysisSheetRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.analysisSheetReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.AnalysisSheet>(`/analysis-sheet/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的分析表 PUT /analysis-sheet/${param0}/ */
export async function analysisSheetUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.analysisSheetUpdateParams,
  body: API.AnalysisSheet,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.AnalysisSheet>(`/analysis-sheet/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的分析表 DELETE /analysis-sheet/${param0}/ */
export async function analysisSheetDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.analysisSheetDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/analysis-sheet/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的分析表 PATCH /analysis-sheet/${param0}/ */
export async function analysisSheetPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.analysisSheetPartialUpdateParams,
  body: API.AnalysisSheet,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.AnalysisSheet>(`/analysis-sheet/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
