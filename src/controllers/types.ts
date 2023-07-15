import { Response } from "express";

interface LocalsPh extends Record<string, any> {
    phone: string;
}

export interface MyResponse extends Response {
    locals: LocalsPh;
}

interface LocalsNewUs extends Record<string, any> {
    newUser: boolean;
}

export interface ReqResponse extends Response {
    locals: LocalsNewUs;
}

export interface AlbumReq {
    params: { album: string };
}

export interface SelfieReq {
    params: { phone: string };
}

export interface SignInUpReq {
    body: { phone: string; code?: string };
}

export interface ChangeAddReq {
    body: {
        fullname?: string;
        email?: string;
        newPhone?: string;
        phoneNotif?: number;
        emailNotif?: number;
        unsubscribenotif?: number;
    };
}

export interface ChangeNotifReq {
    body: {
        phoneNotif: number;
        emailNotif: number;
        unsubscribenotif?: number;
    };
}

export interface ChangeNameController {
    body: {
        fullname: string;
    };
}
export interface ChangeEmailController {
    body: {
        email: string;
    };
}

export interface ChangePhoneController {
    body: {
        newPhone: string;
    };
}

export interface PhotosInfo {
    album: string;
    alDate?: Date | null;
    path: string | null;
    resizedPath: string | null;
    phId: number;
}

export interface AllPhotosFromDB {
    album: string;
    alDate?: Date | null;
    path: string | null;
    pathWtr: string | null;
    resizedPath: string | null;
    resizedPathWtr: string | null;
    PhId: number;
}

export interface UserInfoFromDB {
    avatarLink: string | null;
    userName: string | null;
    phoneNumber: string;
    userEmail: string | null;
    notificationSettings: {
        textMessages: number;
        email: number;
        unsubscribe: number;
    };
}

export interface Payment4AlReq {
    body: {
        card: number;
        month: number;
        year: number;
        cvc: number;
        album: string;
    };
}

export interface Payment4PhReq {
    body: {
        card: number;
        month: number;
        year: number;
        cvc: number;
        phId: number;
    };
}
