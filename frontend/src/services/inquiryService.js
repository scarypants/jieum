import { authFetchAPI } from "./axios/appClient";
import errorHandler from "./utils/errorHandler";

/**
 * 모든 문의사항 목록 fetch 함수
 * - GET /inquiries
 * 
 * @returns 성공 시 문의사항 배열 (inquiries) 을 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function getAllInquiries() {
    try {
        const response = await authFetchAPI.get('http://localhost:8080/api/inquiries')
        return {
            error: null,
            inquiries: response.data
        }
    } catch (error) {
        return errorHandler(error, '문의사항 목록를 가져오는데 실패했습니다.')
    }    
}

/**
 * 새 문의사항 생성 fetch 함수
 * - POST /inquiries
 * 
 * @returns 성공 시 생성 문의사항 ID와 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function createInquiry() {
    try {
        const response = await authFetchAPI.post('http://localhost:8080/api/inquiries')
        return {
            error: null,
            id: response.data.id,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '문의사항을 생성할 수 없습니다.')
    }    
}

/**
 * 문의사항 상태 수정 fetch 함수
 * - PATCH /inquiries/:id
 * 
 * @param {Number} id 문의사항 ID
 * @param {"processing" | "completed"} status 문의사항 상태
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function updateInquiryStatus(id, status) {
    try {
        const response = await authFetchAPI.patch(`http://localhost:8080/api/inquiries/${id}`, {
            status
        })
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '문의사항 상태를 수정할 수 없습니다.')
    }    
}

/**
 * 특정 문의사항 삭제 fetch 함수
 * - DELETE /inquiries/:id
 * 
 * @param {Number} id 문의사항 ID
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function deleteInquiry(id) {
    try {
        const response = await authFetchAPI.delete(`http://localhost:8080/api/inquiries/${id}`)
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '문의사항을 삭제할 수 없습니다.')
    }    
}