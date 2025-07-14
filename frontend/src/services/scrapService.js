import { authFetchAPI } from "./axios/appClient";
import errorHandler from "./utils/errorHandler";

/**
 * 모든 스크랩 목록 fetch 함수
 * - GET /scraps
 * 
 * @returns 성공 시 스크랩 배열 (scraps) 을 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function getAllScraps() {
    try {
        const response = await authFetchAPI.get('http://localhost:8080/api/scraps')
        return {
            error: null,
            scraps: response.data
        }
    } catch (error) {
        return errorHandler(error, '스크랩 목록를 가져오는데 실패했습니다.')
    }    
}

/**
 * 새 스크랩 생성 fetch 함수
 * - POST /scraps
 * 
 * @param {Number} ideaId 아이디어 ID
 * @returns 성공 시 생성 스크랩 ID와 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function createScrap(ideaId) {
    try {
        const response = await authFetchAPI.post('http://localhost:8080/api/scraps', {
            ideaId
        })
        return {
            error: null,
            id: response.data.id,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '스크랩을 생성할 수 없습니다.')
    }    
}

/**
 * 특정 스크랩 삭제 fetch 함수
 * - DELETE /scraps/:id
 * 
 * @param {Number} id 스크랩 ID
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function deleteScrap(id) {
    try {
        const response = await authFetchAPI.delete(`http://localhost:8080/api/scraps/${id}`)
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '스크랩을 삭제할 수 없습니다.')
    }    
}