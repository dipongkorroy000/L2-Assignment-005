import { Request, Response } from "express";
import status from "http-status-codes";

const notFound = (req: Request, res: Response) => {
  res.status(status.NOT_FOUND).json({ success: false, message: "Route Not Round" });
};

export default notFound;