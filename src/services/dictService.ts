import type { DictItem } from '../types/dict' // 假设有一个类型定义文件

import api from "../request.ts"
// 获取词条列表
export const fetchDictList = async (): Promise<DictItem[]> => {
  try {
    const response = await api.get('/dict')
    return response.data
  } catch (error) {
    console.error('获取词条列表失败:', error)
    throw error
  }
}

// 添加词条
export const addDictItem = async (item: DictItem): Promise<DictItem> => {
  try {
    const response = await api.post('/dict', item)
    return response.data
  } catch (error) {
    console.error('添加词条失败:', error)
    throw error
  }
}

// 编辑词条
export const updateDictItem = async (id: number, item: DictItem): Promise<DictItem> => {
  try {
    const response = await api.put(`/dict/${id}`, item)
    return response.data
  } catch (error) {
    console.error('编辑词条失败:', error)
    throw error
  }
}

// 删除词条
export const deleteDictItem = async (id: number): Promise<void> => {
  try {
    await api.delete(`/dict/${id}`)
  } catch (error) {
    console.error('删除词条失败:', error)
    throw error
  }
}
