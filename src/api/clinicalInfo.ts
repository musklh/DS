// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /clinical-info/ */
export async function clinicalInfoList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.clinicalInfoListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.ClinicalInfo[];
  }>("/clinical-info/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /clinical-info/ */
export async function clinicalInfoCreate(
  body: API.ClinicalInfo,
  options?: { [key: string]: any }
) {
  return request<API.ClinicalInfo>("/clinical-info/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /clinical-info/${param0}/ */
export async function clinicalInfoRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.clinicalInfoReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ClinicalInfo>(`/clinical-info/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /clinical-info/${param0}/ */
export async function clinicalInfoUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.clinicalInfoUpdateParams,
  body: API.ClinicalInfo,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ClinicalInfo>(`/clinical-info/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /clinical-info/${param0}/ */
export async function clinicalInfoDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.clinicalInfoDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/clinical-info/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /clinical-info/${param0}/ */
export async function clinicalInfoPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.clinicalInfoPartialUpdateParams,
  body: API.ClinicalInfo,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ClinicalInfo>(`/clinical-info/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
