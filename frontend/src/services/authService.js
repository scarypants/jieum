import { fetchAPI } from "./axios/appClient"
import errorHandler from "./utils/errorHandler";

/**
 * 로그인 fetch 함수
 * - POST /auth
 * 
 * @param {String} loginId 로그인 아이디
 * @param {String} password 비밀번호
 * @returns 성공 시 토큰을 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function authenticate(loginId, password) {
    try {
        const response = await fetchAPI.post('/auth', {
            loginId,
            password
        })

        return {
            error: null,
            token: response.data.token
        }
    } catch (error) {
        return errorHandler(error, '로그인에 실패했습니다.')
    }
}