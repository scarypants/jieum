export function handleError(error, fallbackMessage = '에러가 발생했습니다.') {
    return {
        error: error?.response?.data?.message || fallbackMessage
    }
}
