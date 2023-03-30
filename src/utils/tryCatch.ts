import { RequestHandler } from "express";

export const handleCallback = (callback: Function):RequestHandler => {
    return async (req, res, next) => {
      try {
        await callback(req, res, next);
      } catch (error) {
        next(error);
      }
    };
};