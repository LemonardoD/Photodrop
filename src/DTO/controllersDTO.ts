export interface regPhRequest {
    body: { login: string; password: string; fullname?: string; email?: string };
}

export interface AlCreationReq {
    body: { albumName: string; albumLocation: string; date: Date };
}

export interface MulterReq {
    files?: Express.Multer.File[];
    body: { album: string; users?: string };
}
