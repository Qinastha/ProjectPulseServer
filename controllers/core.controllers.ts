import {Request, Response} from "express";
import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (req: Request,res: Response) => {
    const {avatar} = req.body;
    try {
        if(avatar) {
            const uploadResult = await cloudinary.uploader
                .upload(
                    avatar, {
                        public_id: 'profiles',
                    }
                )
                .catch((error) => {
                    console.log(error);
                });
            if(uploadResult?.secure_url) {
                res.success(uploadResult?.secure_url,'Avatar is successfully uploaded',201,true)
            } else {
                res.error({message: 'Invalid data format'},400)
            }
        }
    }catch (e: any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}
