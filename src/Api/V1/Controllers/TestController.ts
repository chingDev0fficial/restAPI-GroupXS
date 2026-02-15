import type { Request, Response } from "express";
import Controller from "./Controller";

export default class TestController extends Controller {
  // Implement the logic for the TestController controller
  // This could include methods for creating, updating, deleting, and retrieving users
  // Each method will typically take a Request and Response object, and return a Promise
  // The Promise will resolve to the data to be sent in the response
  // The Promise will reject with an error if there is an issue
  // The Promise will resolve to the data to be sent in the response

  public testIndex(req: Request, res: Response) {
    return this.sendSuccessResponse(res, { message: "Testing controller!" });
  }
}
