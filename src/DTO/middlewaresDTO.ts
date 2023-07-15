import { Response } from "express";
import { SpecificAlbum } from "./dbDTO";

export interface LoginReq {
    body: { login: string; password: string };
}

interface Locals extends Record<string, any> {
    login: string;
}

export interface ResponseDto extends Response {
    locals: Locals;
}

interface UsersOnImg extends Record<string, any> {
    users?: string[];
}

export interface ResponseUsersOnImg extends Response {
    locals: UsersOnImg;
}
interface LocalsAlbum extends Record<string, any> {
    album: SpecificAlbum;
}

export interface ResponseAlAdminDto extends Response {
    locals: LocalsAlbum;
}

export interface addUsersOnPhotoReq {
    params: { id: number };
    body: { users: string };
}

export interface paramsAlbumNameReq {
    params: { albumName: string };
}

export interface SetPriceReq extends paramsAlbumNameReq {
    body: { price: number };
}
