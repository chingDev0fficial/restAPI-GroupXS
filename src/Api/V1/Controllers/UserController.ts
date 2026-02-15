import type { Request, Response } from "express";
import Controller from "./Controller";

export default class UserController extends Controller {
  // Implement the logic for the user controller
  // This could include methods for creating, updating, deleting, and retrieving users
  // Each method will typically take a Request and Response object, and return a Promise
  // The Promise will resolve to the data to be sent in the response
  // The Promise will reject with an error if there is an issue
  // The Promise will resolve to the data to be sent in the response

  /**
   *
   * @param req The request object
   * @param res The response object
   * @returns The data to be sent in the response
   */
  public index(req: Request, res: Response) {
    return this.sendSuccessResponse(res, { message: "Hello, world!" });
  }
}
