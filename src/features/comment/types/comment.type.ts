export interface CommentResponse {
    id: string
    taskId: string
    content: string
    authorId: string
    authorName: string
    authorAvatarUrl: string | null
    createdAt: string
    updatedAt: string
}

export interface CreateCommentPayload {
    taskId: string
    content: string
}

export interface UpdateCommentPayload {
    id: string
    commentPayload: UpdateCommentContentPayload
}

export interface UpdateCommentContentPayload {
    content: string
}
