export interface SpecificAlbum {
    albumId: number;
    albumName: string;
    albumLocation: string;
    albumDate: Date;
    photo: string | null;
    clients: string | null;
    photoId: number | null;
}

export interface Albums {
    albumId: number;
    albumName: string;
    albumLocation: string;
    albumDate: Date;
    mainPhoto: string | null;
    price: number;
}

export interface PhotographersDB {
    login: string;
    fullName?: string | null;
    email?: string | null;
    approved: number | null;
}
