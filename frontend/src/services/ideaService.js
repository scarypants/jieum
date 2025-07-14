import { fetchAPI, authFetchAPI } from "./axios/appClient";
import errorHandler from "./utils/errorHandler";

/**
 * 모든 아이디어 목록 fetch 함수
 * - GET /ideas?category=&search=&sort=
 * 
 * @param {String} category 카테고리 이름
 * @param {String} search 검색 단어
 * @param {"latest" | "views" | "scraps" | "comments"} sort 정렬 기준
 * @returns 성공 시 아이디어 배열 (ideas) 을 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function getAllIdeas(category, search, sort) {
    try {
        const params = {
        ...(category && { category }),
        ...(search && { search }),
        ...(sort && { sort }),
        }

        const response = await fetchAPI.get('http://localhost:8080/api/ideas', { params })
        return {
            error: null,
            ideas: response.data
        }
    } catch (error) {
        return errorHandler(error, '아이디어 목록을 가져오는데 실패했습니다.')
    }    
}

/**
 * 새 아이디어 생성 fetch 함수
 * - POST /ideas
 * 
 * @param {{ categoryId: number, title: string, content: string }} idea 아이디어 객체
 * @param {Array<{ name: string }>} tags 태그 배열
 * @returns 성공 시 생성 아이디어 ID와 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function createIdea(idea, tags) {
    try {
        const response = await authFetchAPI.post('http://localhost:8080/api/ideas', { 
            idea, // 아이디어 객체
            tags // 태그 배열
        })
        return {
            error: null,
            id: response.data.id,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '아이디어를 생성할 수 없습니다.')
    }    
}

/**
 * 특정 아이디어 fetch 함수
 * - GET /ideas/:id
 * 
 * @param {Number} id 아이디어 ID
 * @returns 성공 시 아이디어 객체 (idea), 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function getIdea(id) {
    try {
        const response = await fetchAPI.get(`http://localhost:8080/api/ideas/${id}`)
        return {
            error: null,
            idea: response.data
        }
    } catch (error) {
        return errorHandler(error, '아이디어를 가져오는데 실패했습니다.')
    }    
}

/**
 * 특정 아이디어 수정 fetch 함수
 * - PATCH /ideas/:id
 * 
 * @param {Number} id 아이디어 ID
 * @param {{ categoryId: number, title: string, content: string }} idea 아이디어 객체
 * @param {Array<{ name: string }>} tags 태그 배열
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function updateIdea(id, idea, tags) {
    try {
        const response = await authFetchAPI.patch(`http://localhost:8080/api/ideas/${id}`, {
            idea, // 아이디어 객체
            tags // 태그 배열
        })
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '아이디어를 수정할 수 없습니다.')
    }    
}

/**
 * 특정 아이디어 삭제 fetch 함수
 * - DELETE /ideas/:id
 * 
 * @param {Number} id 아이디어 ID
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function deleteIdea(id) {
    try {
        const response = await authFetchAPI.delete(`http://localhost:8080/api/ideas/${id}`)
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '아이디어를 삭제할 수 없습니다.')
    }    
}

/**
 * 내 아이디어 목록 fetch 함수
 * - GET /ideas/me
 * 
 * @param {"latest" | "views" | "scraps" | "comments"} sort 정렬 기준
 * @returns 성공 시 아이디어 배열 (ideas) 을 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function getMyIdeas(sort) {
    try {
        const response = await authFetchAPI.get(`http://localhost:8080/api/ideas/me?sort=${sort}`)
        return {
            error: null,
            ideas: response.data
        }
    } catch (error) {
        return errorHandler(error, '내 아이디어를 가져오는데 실패했습니다.')
    }    
}

/**
 * 특정 아이디어 조회수 증가 fetch 함수
 * - PATCH /ideas/:id/views
 * 
 * @param {Number} id 아이디어 ID
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function updateIdeaViews(id) {
    try {
        const response = await fetchAPI.patch(`http://localhost:8080/api/ideas/${id}/views`)
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '아이디어 조회수를 수정할 수 없습니다.')
    }    
}

/**
 * 특정 아이디어 스크랩수 증가/감소 fetch 함수
 * - PATCH /ideas/:id/scraps
 * 
 * @param {Number} id 아이디어 ID
 * @param {"add" | "sub"} action add일 경우 증가, sub일 경우 감소
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function updateIdeaScraps(id, action) {
    try {
        const response = await authFetchAPI.patch(`http://localhost:8080/api/ideas/${id}/scraps`, {
            action
        })
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '아이디어 스크랩수를 수정할 수 없습니다.')
    }    
}

/**
 * 특정 아이디어 댓글수 증가/감소 fetch 함수
 * - PATCH /ideas/:id/comments
 * 
 * @param {Number} id 아이디어 ID
 * @param {"add" | "sub"} action add일 경우 증가, sub일 경우 감소
 * @returns 성공 시 메세지를 포함한 객체, 실패 시 에러 메시지를 포함한 객체를 반환합니다.
 */
export async function updateIdeaComments(id, action) {
    try {
        const response = await authFetchAPI.patch(`http://localhost:8080/api/ideas/${id}/comments`, {
            action // add 또는 sub
        })
        return {
            error: null,
            message: response.data.message
        }
    } catch (error) {
        return errorHandler(error, '아이디어 댓글수를 수정할 수 없습니다.')
    }    
}



