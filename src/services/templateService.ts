import type { TemplateItem } from '../types/template' // 假设有一个类型定义文件

import api from "../request.ts"

// 获取模板列表
export const fetchTemplateList = async (): Promise<TemplateItem[]> => {
  try {
    const response = await api.get('/templates')
    return response.data
  } catch (error) {
    console.error('获取模板列表失败:', error)
    throw error
  }
}

// 添加模板
export const addTemplateItem = async (item: TemplateItem): Promise<TemplateItem> => {
  try {
    const response = await api.post('/templates', item)
    return response.data
  } catch (error) {
    console.error('添加模板失败:', error)
    throw error
  }
}

// 编辑模板
export const updateTemplateItem = async (id: number, item: TemplateItem): Promise<TemplateItem> => {
  try {
    const response = await api.put(`/templates/${id}`, item)
    return response.data
  } catch (error) {
    console.error('编辑模板失败:', error)
    throw error
  }
}

// 删除模板
export const deleteTemplateItem = async (id: number): Promise<void> => {
  try {
    await api.delete(`/templates/${id}`)
  } catch (error) {
    console.error('删除模板失败:', error)
    throw error
  }
}
