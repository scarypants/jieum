import { authFetchAPI } from "./axios/appClient";
import errorHandler from "./utils/errorHandler";

/**
 * 새 댓글 생성 fetch 함수
 * - POST /comments
 * 
 * @param {Number} ideaId 아이디어 ID
 * @param {String} content 댓글 내용
 * @returns 성공 시 생성 댓글 ID와 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function createComment(ideaId, content) {
    try {
        const response = await authFetchAPI.post('http://localhost:8080/api/comments', { 
            ideaId: ideaId,
            content: content
        })
        return {
            error: null,
            id: response.data.id,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '댓글을 생성할 수 없습니다.')
    }    
}

/**
 * 특정 댓글 삭제 fetch 함수
 * - DELETE /comments/:id
 * 
 * @param {Number} id 댓글 ID
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function deleteComment(id) {
    try {
        const response = await authFetchAPI.delete(`http://localhost:8080/api/comments/${id}`)
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '카테고리를 삭제할 수 없습니다.')
    }    
}