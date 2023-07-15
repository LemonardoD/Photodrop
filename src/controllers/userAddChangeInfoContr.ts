import { ChangeEmailController, ChangeNameController, ChangeNotifReq, ChangePhoneController, MyResponse } from "./types";
import UsRepo from "../db/repositories/usersRepo";
import VerifRepo from "../db/repositories/verifyPhoneRepo";

export const addChngName = async (req: ChangeNameController, res: MyResponse) => {
    const { fullname } = req.body;
    const { phone } = res.locals;
    await UsRepo.updateName(fullname, phone);
    return res.status(200);
};

export const addChngEmail = async (req: ChangeEmailController, res: MyResponse) => {
    const { email } = req.body;
    const { phone } = res.locals;
    await UsRepo.updateEmail(email, phone);
    return res.status(200);
};

export const changePhone = async (req: ChangePhoneController, res: MyResponse) => {
    const { newPhone } = req.body;
    const { phone } = res.locals;
    await UsRepo.updatePhone(phone, newPhone);
    await VerifRepo.updatePhoneNumber(phone, newPhone);
    return res.status(200);
};

export const setNotif = async (req: ChangeNotifReq, res: MyResponse) => {
    const { phone } = res.locals;
    const { phoneNotif, emailNotif, unsubscribenotif } = req.body;
    if (unsubscribenotif === 1 || (phoneNotif === 0 && emailNotif === 0)) {
        // if unsubscribe is  1, setting phone & email notification at 0
        await UsRepo.SetUnsubNotif(phone);
        return res.status(200).json({
            status: 200,
            phoneNotif: 0,
            emailNotif: 0,
            unsubscribeNotif: 1,
        });
    }
    await UsRepo.updateNotif(phoneNotif, emailNotif, phone);
    return res.status(200).json({
        status: 200,
        phoneNotif,
        emailNotif,
        unsubscribeNotif: 0,
    });
};
