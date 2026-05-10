import APIClient from "./apiClient";

export interface StartResponse {
    session_id: string
    message: string
}

export interface TranslateResponse {
    answer: string
}

export interface TranslateRequest {
    question: string
}

export default new APIClient('/translate')