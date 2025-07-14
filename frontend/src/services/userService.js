import axios from "axios";
import authAxios from "./axios/authAxios";
import errorHandler from "./utils/errorHandler";

/**
 * 모든 사용자 목록 fetch 함수
 * - GET /users
 * 
 * @returns 성공 시 사용자 배열 (users)을 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function getAllUsers() {
    try {
        const response = await authAxios.get('http://localhost:8080/api/users')
        return {
            error: null,
            users: response.data
        }
    } catch (error) {
        return errorHandler(error, '사용자 목록를 가져오는데 실패했습니다.')
    }    
}

/**
 * 새 사용자 생성 (회원가입) fetch 함수
 * - POST /users
 * 
 * @param {String} nickname 닉네임
 * @param {String} loginId 로그인 아이디
 * @param {String} password 비밀번호
 * @returns 성공 시 생성 사용자 ID와 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function createUser(nickname, loginId, password) {
    try {
        const response = await axios.post('http://localhost:8080/api/users', {
            nickname,
            loginId,
            password
        })
        return {
            error: null,
            id: response.data.id,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '회원가입에 실패했습니다.')
    }
}

/**
 * 특정 사용자 정보 fetch 함수
 * - GET /users/:id
 * 
 * @param {Number} id 사용자 ID
 * @returns 성공 시 사용자 객체 (user), 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function getUser(id) {
    try {
        const response = await authAxios.get(`http://localhost:8080/api/users/${id}`)
        return {
            error: null,
            user: response.data
        }
    } catch (error) {
        return errorHandler(error, '사용자 데이터를 가져오는데 실패했습니다.')
    }    
}

/**
 * 특정 사용자 정보 수정 fetch 함수
 * - PATCH /users/:id
 * 
 * @param {String} nickname 닉네임
 * @param {String} loginId 로그인 아이디
 * @param {String} password 비밀번호
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function updateUser(nickname, loginId, password) {
    try {
        const response = await authAxios.patch('http://localhost:8080/api/users', {
            nickname,
            loginId,
            password
        })
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '사용자 정보를 수정할 수 없습니다.')
    }
}

/**
 * 특정 사용자 삭제 fetch 함수
 * - DELETE /users/:id
 * 
 * @param {Number} id 사용자 ID
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function deleteUser(id) {
    try {
        const response = await authAxios.delete(`http://localhost:8080/api/users/${id}`)
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '사용자를 삭제할 수 없습니다.')
    }    
}

/**
 * 내 정보 fetch 함수
 * - GET /users/me
 * 
 * @returns 성공 시 사용자 객체 (user), 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function getMyUserDetails() {
    try {
        const response = await authAxios.get('http://localhost:8080/api/users/me')
        return {
            error: null,
            user: response.data
        }
    } catch (error) {
        return errorHandler(error, '내 프로필 정보를 가져오는데 실패했습니다.')
    }    
}

/**
 * 특정 사용자 역할 수정 (관리자 전용)
 * - PATCH /users/:id/role
 * 
 * @param {Number} id 사용자 ID
 * @param {"admin" | "member"} role 역할
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function updateUser(id, role) {
    try {
        const response = await authAxios.patch(`http://localhost:8080/api/users/${id}/role`, {
            role
        })
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '사용자 역할을 수정할 수 없습니다.')
    }
}