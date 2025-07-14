import { fetchAPI, authFetchAPI } from "./axios/appClient";
import errorHandler from "./utils/errorHandler";

/**
 * 전체 카테고리 목록 fetch 함수
 * - GET /categories
 * 
 * @returns 성공 시 카테고리 배열 (categories) 을 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function getAllCategories() {
    try {
        const response = await fetchAPI.get('http://localhost:8080/api/categories')
        return {
            error: null,
            categories: response.data
        }
    } catch (error) {
        return errorHandler(error, '카테고리를 가져오는데 실패했습니다.')
    }    
}

/**
 * 새 카테고리 생성 fetch 함수
 * - POST /categories
 * 
 * @param {String} name 카테고리 이름
 * @returns 성공 시 생성 카테고리 ID와 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function createCategory(name) {
    try {
        const response = await authFetchAPI.post('http://localhost:8080/api/categories', { 
            name: name
        })
        return {
            error: null,
            id: response.data.id,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '카테고리를 생성할 수 없습니다.')
    }    
}

/**
 * 특정 카테고리 삭제 fetch 함수
 * - DELETE /categories/:id
 * 
 * @param {Number} id 카테고리 ID
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function deleteCategory(id) {
    try {
        const response = await authFetchAPI.delete(`http://localhost:8080/api/categories/${id}`)
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '카테고리를 삭제할 수 없습니다.')
    }    
}