// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 数据管理接口，支持单条和批量录入临床数据。 ## 主要功能
1. 数据录入 - 支持两种模式：单条录入和批量录入
2. 数据查询 - 支持分页和按病例编号过滤
3. 数据详情查看

## 接口说明

### 1. 单条数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- word_code: 词条编号
- check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
- value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "word_code": "A000001",
    "check_time": "2025-05-25 14:30:00",
    "value": "检查值"
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 123,
        "case_code": "C000001",
        "template_category": "分类1",
        "template_name": "测试",
        "word_name": "string",
        "value": "检查值",
        "check_time": "2025-05-25 14:30:00"
    }
}
```

### 2. 批量数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- data_list: 数据列表，每项包含：
    - word_code: 词条编号
    - check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
    - value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "data_list": [
        {
            "word_code": "A000001",
            "check_time": "2025-05-25 14:30:00",
            "value": "值1"
        },
        {
            "word_code": "A000002",
            "check_time": "2025-05-25 15:30:00",
            "value": "值2"
        }
    ]
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "message": "成功创建 2 条数据记录",
        "data": [
            {
                "id": 123,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值1",
                "check_time": "2025-05-25 14:30:00"
            },
            {
                "id": 124,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值2",
                "check_time": "2025-05-25 15:30:00"
            }
        ]
    }
}
``` GET /data/ */
export async function dataList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.DataTableDetail[];
  }>('/data/', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 数据管理接口，支持单条和批量录入临床数据。 ## 主要功能
1. 数据录入 - 支持两种模式：单条录入和批量录入
2. 数据查询 - 支持分页和按病例编号过滤
3. 数据详情查看

## 接口说明

### 1. 单条数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- word_code: 词条编号
- check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
- value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "word_code": "A000001",
    "check_time": "2025-05-25 14:30:00",
    "value": "检查值"
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 123,
        "case_code": "C000001",
        "template_category": "分类1",
        "template_name": "测试",
        "word_name": "string",
        "value": "检查值",
        "check_time": "2025-05-25 14:30:00"
    }
}
```

### 2. 批量数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- data_list: 数据列表，每项包含：
    - word_code: 词条编号
    - check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
    - value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "data_list": [
        {
            "word_code": "A000001",
            "check_time": "2025-05-25 14:30:00",
            "value": "值1"
        },
        {
            "word_code": "A000002",
            "check_time": "2025-05-25 15:30:00",
            "value": "值2"
        }
    ]
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "message": "成功创建 2 条数据记录",
        "data": [
            {
                "id": 123,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值1",
                "check_time": "2025-05-25 14:30:00"
            },
            {
                "id": 124,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值2",
                "check_time": "2025-05-25 15:30:00"
            }
        ]
    }
}
``` POST /data/ */
export async function dataCreate(body: API.DataTable, options?: { [key: string]: any }) {
  return request<API.DataTable>('/data/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 数据管理接口，支持单条和批量录入临床数据。 ## 主要功能
1. 数据录入 - 支持两种模式：单条录入和批量录入
2. 数据查询 - 支持分页和按病例编号过滤
3. 数据详情查看

## 接口说明

### 1. 单条数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- word_code: 词条编号
- check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
- value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "word_code": "A000001",
    "check_time": "2025-05-25 14:30:00",
    "value": "检查值"
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 123,
        "case_code": "C000001",
        "template_category": "分类1",
        "template_name": "测试",
        "word_name": "string",
        "value": "检查值",
        "check_time": "2025-05-25 14:30:00"
    }
}
```

### 2. 批量数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- data_list: 数据列表，每项包含：
    - word_code: 词条编号
    - check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
    - value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "data_list": [
        {
            "word_code": "A000001",
            "check_time": "2025-05-25 14:30:00",
            "value": "值1"
        },
        {
            "word_code": "A000002",
            "check_time": "2025-05-25 15:30:00",
            "value": "值2"
        }
    ]
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "message": "成功创建 2 条数据记录",
        "data": [
            {
                "id": 123,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值1",
                "check_time": "2025-05-25 14:30:00"
            },
            {
                "id": 124,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值2",
                "check_time": "2025-05-25 15:30:00"
            }
        ]
    }
}
``` GET /data/${param0}/ */
export async function dataRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTableDetail>(`/data/${param0}/`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 数据管理接口，支持单条和批量录入临床数据。 ## 主要功能
1. 数据录入 - 支持两种模式：单条录入和批量录入
2. 数据查询 - 支持分页和按病例编号过滤
3. 数据详情查看

## 接口说明

### 1. 单条数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- word_code: 词条编号
- check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
- value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "word_code": "A000001",
    "check_time": "2025-05-25 14:30:00",
    "value": "检查值"
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 123,
        "case_code": "C000001",
        "template_category": "分类1",
        "template_name": "测试",
        "word_name": "string",
        "value": "检查值",
        "check_time": "2025-05-25 14:30:00"
    }
}
```

### 2. 批量数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- data_list: 数据列表，每项包含：
    - word_code: 词条编号
    - check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
    - value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "data_list": [
        {
            "word_code": "A000001",
            "check_time": "2025-05-25 14:30:00",
            "value": "值1"
        },
        {
            "word_code": "A000002",
            "check_time": "2025-05-25 15:30:00",
            "value": "值2"
        }
    ]
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "message": "成功创建 2 条数据记录",
        "data": [
            {
                "id": 123,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值1",
                "check_time": "2025-05-25 14:30:00"
            },
            {
                "id": 124,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值2",
                "check_time": "2025-05-25 15:30:00"
            }
        ]
    }
}
``` PUT /data/${param0}/ */
export async function dataUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataUpdateParams,
  body: API.DataTableDetail,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTableDetail>(`/data/${param0}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 数据管理接口，支持单条和批量录入临床数据。 ## 主要功能
1. 数据录入 - 支持两种模式：单条录入和批量录入
2. 数据查询 - 支持分页和按病例编号过滤
3. 数据详情查看

## 接口说明

### 1. 单条数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- word_code: 词条编号
- check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
- value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "word_code": "A000001",
    "check_time": "2025-05-25 14:30:00",
    "value": "检查值"
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 123,
        "case_code": "C000001",
        "template_category": "分类1",
        "template_name": "测试",
        "word_name": "string",
        "value": "检查值",
        "check_time": "2025-05-25 14:30:00"
    }
}
```

### 2. 批量数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- data_list: 数据列表，每项包含：
    - word_code: 词条编号
    - check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
    - value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "data_list": [
        {
            "word_code": "A000001",
            "check_time": "2025-05-25 14:30:00",
            "value": "值1"
        },
        {
            "word_code": "A000002",
            "check_time": "2025-05-25 15:30:00",
            "value": "值2"
        }
    ]
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "message": "成功创建 2 条数据记录",
        "data": [
            {
                "id": 123,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值1",
                "check_time": "2025-05-25 14:30:00"
            },
            {
                "id": 124,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值2",
                "check_time": "2025-05-25 15:30:00"
            }
        ]
    }
}
``` DELETE /data/${param0}/ */
export async function dataDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/data/${param0}/`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 数据管理接口，支持单条和批量录入临床数据。 ## 主要功能
1. 数据录入 - 支持两种模式：单条录入和批量录入
2. 数据查询 - 支持分页和按病例编号过滤
3. 数据详情查看

## 接口说明

### 1. 单条数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- word_code: 词条编号
- check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
- value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "word_code": "A000001",
    "check_time": "2025-05-25 14:30:00",
    "value": "检查值"
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 123,
        "case_code": "C000001",
        "template_category": "分类1",
        "template_name": "测试",
        "word_name": "string",
        "value": "检查值",
        "check_time": "2025-05-25 14:30:00"
    }
}
```

### 2. 批量数据录入
POST /api/data/

请求参数说明：
- case_code: 病例编号
- template_code: 模板编号
- data_list: 数据列表，每项包含：
    - word_code: 词条编号
    - check_time: 检查时间，格式：YYYY-MM-DD HH:MM:SS
    - value: 数据值

请求示例：
```json
{
    "case_code": "C000001",
    "template_code": "T000001",
    "data_list": [
        {
            "word_code": "A000001",
            "check_time": "2025-05-25 14:30:00",
            "value": "值1"
        },
        {
            "word_code": "A000002",
            "check_time": "2025-05-25 15:30:00",
            "value": "值2"
        }
    ]
}
```

响应示例：
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "message": "成功创建 2 条数据记录",
        "data": [
            {
                "id": 123,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值1",
                "check_time": "2025-05-25 14:30:00"
            },
            {
                "id": 124,
                "case_code": "C000001",
                "template_category": "分类1",
                "template_name": "测试",
                "word_name": "string",
                "value": "值2",
                "check_time": "2025-05-25 15:30:00"
            }
        ]
    }
}
``` PATCH /data/${param0}/ */
export async function dataPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataPartialUpdateParams,
  body: API.DataTableDetail,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTableDetail>(`/data/${param0}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
