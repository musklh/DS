// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /shapes/ */
export async function shapesList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.shapesListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.Shape[];
  }>("/shapes/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /shapes/ */
export async function shapesCreate(
  body: API.Shape,
  options?: { [key: string]: any }
) {
  return request<API.Shape>("/shapes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /shapes/${param0}/ */
export async function shapesRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.shapesReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Shape>(`/shapes/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /shapes/${param0}/ */
export async function shapesUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.shapesUpdateParams,
  body: API.Shape,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Shape>(`/shapes/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /shapes/${param0}/ */
export async function shapesDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.shapesDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/shapes/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /shapes/${param0}/ */
export async function shapesPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.shapesPartialUpdateParams,
  body: API.Shape,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Shape>(`/shapes/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
