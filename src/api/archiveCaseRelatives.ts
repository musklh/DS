// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /archive-case-relatives/ */
export async function archiveCaseRelativesList(options?: {
  [key: string]: any;
}) {
  return request<API.ArchiveCaseRelative[]>("/archive-case-relatives/", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /archive-case-relatives/ */
export async function archiveCaseRelativesCreate(
  body: API.ArchiveCaseRelative,
  options?: { [key: string]: any }
) {
  return request<API.ArchiveCaseRelative>("/archive-case-relatives/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /archive-case-relatives/${param0}/ */
export async function archiveCaseRelativesRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archiveCaseRelativesReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ArchiveCaseRelative>(
    `/archive-case-relatives/${param0}/`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 PUT /archive-case-relatives/${param0}/ */
export async function archiveCaseRelativesUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archiveCaseRelativesUpdateParams,
  body: API.ArchiveCaseRelative,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ArchiveCaseRelative>(
    `/archive-case-relatives/${param0}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 DELETE /archive-case-relatives/${param0}/ */
export async function archiveCaseRelativesDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archiveCaseRelativesDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/archive-case-relatives/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /archive-case-relatives/${param0}/ */
export async function archiveCaseRelativesPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archiveCaseRelativesPartialUpdateParams,
  body: API.ArchiveCaseRelative,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ArchiveCaseRelative>(
    `/archive-case-relatives/${param0}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}
