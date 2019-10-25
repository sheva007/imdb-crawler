import { Request, Response } from "express";
import * as  path from 'path';

/**
 * home page
 */
export async function homeAction(request: Request, response: Response) {
    response.sendFile(path.join(__dirname + '/../../assets/links_form.html'));
}