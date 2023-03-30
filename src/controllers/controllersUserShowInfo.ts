import { RequestHandler } from "express";
import { getUsSelfies } from "../db/services/usrImagesService";
import { getUserByPhone } from "../db/services/usersService";

export const showAllSelfies: RequestHandler = async (req, res) => {
    const userInDB = await getUserByPhone(req.body.phone);
    const selfies = await getUsSelfies(userInDB[0].phone);
    if (selfies.length) {
        return res.status(200).json({
            status: 200,
            message: selfies.map(function(el) {return {selfiePath: el.photopath}})
        });
    }
    return res.status(200).json({
        status: 200,
        message: "User don't uploaded selfies yet."
    });
};

export const showNotif: RequestHandler = async (req, res) => {
    const userInDB = await getUserByPhone(req.body.phone);
    return res.status(200).json({
        status: 200,
        message: {
            phoneNotif: userInDB[0].phonenotif,
            emailNotif: userInDB[0].emailnotif,
            unsubscribeNotif: userInDB[0].unsubscribenotif
        }
    });
};