import { RequestHandler } from "express";
import { db } from "../db/db";
import { photograpers } from "../db/schema/photographers";
import { albums } from "../db/schema/albums";
import { eq } from 'drizzle-orm/expressions';
import { image } from "../db/schema/image";
import { LengthValidation } from "../utils/loginValid";
import { getImageById } from "../db/services/imageServices";
import { getAlbumInfo, getSpecificAl } from "../db/services/albumServ";
import { Photographers, getPhotograper, getPhotograpers } from "../db/services/photographerServ";
import { SpecificAlbum } from "../interfaces/interface";

export const  activatePhotographer: RequestHandler = async (req, res) => {
    const info: Photographers = req.body;
    if (!info.login) {
        return res.status(406).json({ 
            status: 406,
            message: "U must fill up login to activate the user."
        });
    }
    const result: Photographers[] = await getPhotograper(info.login);
    if (result.length) {
        return res.status(404).json({ 
            status: 404,
            message: `Sorry there is no Photographer with such login ${info.login}.`
        });
    }
    await db.update(photograpers).set({ aproved: 1}).where(eq(photograpers.login, info.login));  // aprove photorgapher status in DB
    return res.status(200).json({ 
        status: 200,
        message: `Photographer ${info.login} successfully activated!`
    });
};

export const PhotographersList: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ 
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    if (accessToken != "admin") {   //imitation of admin user
        return res.status(403).json({ 
            status: 403,
            message: "You do not have access rights."
        });
    }
    const allPhotographers: Photographers[]  = await getPhotograpers();
    return res.status(200).json({ 
        status: 200,
        message: allPhotographers.map(function(el:Photographers) {return {login: el.login , fullName: el.fullname, email: el.email, aproved: el.aproved}})
    });
};

export const getAlbum: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ 
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    if (accessToken != "admin") {   //imitation of admin user
        return res.status(403).json({ 
            status: 403,
            message: "You do not have access rights."
        });
        
    }
    const album: string = req.params.album;
    const result: SpecificAlbum[] = await getSpecificAl(album);
    if (!result.length) {
        return res.status(404).json({ 
            status: 404,
            message: `We don't have album ${album} at our database.`
        }); 
    }
    return res.status(200).json({ 
        status: 200,
        message: result.map(function(el: SpecificAlbum) {
            if(el.photo === null || el.photoid === null) {
                return null
            } else if(el.clients === null) {
                return {id: el.albumid, albumname: el.albumname, albumlocation: el.albumlocation, albumdate: el.albumdate,
                    photo: el.photo, idphoto: el.photoid}
            } else {
                return {id: el.albumid, albumname: el.albumname, albumlocation: el.albumlocation, albumdate: el.albumdate,
                    photo: el.photo, clients: el.clients, idphoto: el.photoid}
            }
        })
    });
};

export const addUsersOnPhoto: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ 
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    if (accessToken != "admin") { //imitation of admin user
        return res.status(403).json({ 
            status: 403,
            message: "You do not have access rights."
        }); 
    }
    const imgid: number = Number(req.params.id);
    const users: string = req.body.users;
    const imgResult = await getImageById(imgid);
    if (!imgResult.length) {
        return res.status(404).json({ 
            status: 404,
            message: `We don't have photo ${imgid} at our database.`
        });
    }
    if (!users) {
        return res.status(406).json({ 
            status: 406,
            message: "Fill form, to mark users on the photo."
        });
    }
    if (!LengthValidation(users)) {
        return res.status(406).json({ 
            status: 406,
            message: "Length of full name must be more than 5."
        });
    }
    await db.update(image).set({ fullname: users.toLowerCase().replaceAll(/[^A-Za-z]/g, ""), client: users}).where(eq(image.id, imgid));
    return res.status(200).json({ 
        status: 200,
        message: `${users} were marcked on this photo.`
    }); 
};

export const addAlbumPrice: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ 
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    if (accessToken != "admin") { // imitation of admin user
        return res.status(403).json({ 
            status: 403,
            message: "You do not have access rights."
        });     
    }
    const albumName: string = req.params.album;
    const albResult = await getAlbumInfo(albumName);
    if (!albResult.length) {
        return res.status(404).json({ 
            status: 404,
            message: `We don't have album, ${albumName}, at our database.`
        });
    }
    const price: number = req.body.price;
    if (!price) {
        return res.status(406).json({ 
            status: 406,
            message: "Don't be ridiculous, everything has a price."
        });
    }
    if (price < 0) {
        return res.status(406).json({ 
            status: 406,
            message: "Price must be greater than zero."
        });
    }
    await db.update(albums).set({ price: price}).where(eq(albums.albumname, albumName));
    return res.status(200).json({ 
        status: 200,
        message: "Price added."
    });
};