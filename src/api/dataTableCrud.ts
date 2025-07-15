// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 根据病例编号、模板编号、词条编号、检查时间查询数据 GET /data-table-crud/ */
export async function dataTableCrudList(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.dataTableCrudListParams,
    options?: { [key: string]: any }
) {
    return request<{ id?: number }>('/data-table-crud/', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/** 更新数据 PUT /data-table-crud/ */
export async function dataTableCrudUpdate(
    body: {
        /** 病例编号 */
        case_code: string;
        /** 模板编号 */
        template_code: string;
        /** 词条编号 */
        word_code: string;
        /** 检查时间，格式YYYY-MM-DD HH:MM:SS */
        check_time: string;
        /** 新的数据值 */
        value: string;
    },
    options?: { [key: string]: any }
) {
    return request<{ id?: number }>('/data-table-crud/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 创建新数据 POST /data-table-crud/ */
export async function dataTableCrudCreate(
    body: {
        /** 病例编号 */
        case_code: string;
        /** 模板编号 */
        template_code: string;
        /** 词条编号 */
        word_code: string;
        /** 检查时间，格式YYYY-MM-DD HH:MM:SS */
        check_time: string;
        /** 数据值 */
        value: string;
    },
    options?: { [key: string]: any }
) {
    return request<{ id?: number }>('/data-table-crud/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 删除数据 DELETE /data-table-crud/ */
export async function dataTableCrudDelete(
    body: {
        /** 病例编号 */
        case_code: string;
        /** 模板编号 */
        template_code: string;
        /** 词条编号 */
        word_code: string;
        /** 检查时间，格式YYYY-MM-DD HH:MM:SS */
        check_time: string;
    },
    options?: { [key: string]: any }
) {
    return request<{ id?: number }>('/data-table-crud/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
