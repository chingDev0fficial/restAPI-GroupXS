import type { Request, Response } from "express";
import Controller from "./Controller";
import CloseProtocol from "../Services/CloseProtocolServices";

export default class UserController extends Controller {
  // Implement the logic for the user controller
  // This could include methods for creating, updating, deleting, and retrieving users
  // Each method will typically take a Request and Response object, and return a Promise
  // The Promise will resolve to the data to be sent in the response
  // The Promise will reject with an error if there is an issue
  // The Promise will resolve to the data to be sent in the response

    public async fetchAllClosedProtocols(_req: Request, res: Response) {
        const closedProtocols = await CloseProtocol.getAllClosedProtocols();
        return this.sendSuccessResponse(res, closedProtocols);
    }

    public async getClosedProtocolById(req: Request, res: Response) {
        const { id } = req.params;
        const closedProtocol = await CloseProtocol.getClosedProtocolById(id as string);
        return this.sendSuccessResponse(res, closedProtocol);
    }
}
