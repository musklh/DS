// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /examination-images/ */
export async function examinationImagesList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationImagesListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.ExaminationImages[];
  }>("/examination-images/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /examination-images/ */
export async function examinationImagesCreate(
  body: API.ExaminationImages,
  options?: { [key: string]: any }
) {
  return request<API.ExaminationImages>("/examination-images/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /examination-images/${param0}/ */
export async function examinationImagesRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationImagesReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ExaminationImages>(`/examination-images/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /examination-images/${param0}/ */
export async function examinationImagesUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationImagesUpdateParams,
  body: API.ExaminationImages,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ExaminationImages>(`/examination-images/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /examination-images/${param0}/ */
export async function examinationImagesDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationImagesDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/examination-images/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /examination-images/${param0}/ */
export async function examinationImagesPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.examinationImagesPartialUpdateParams,
  body: API.ExaminationImages,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ExaminationImages>(`/examination-images/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
