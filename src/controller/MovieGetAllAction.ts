import { Request, Response } from "express";
import { movieGetAll } from "../module/movies";

/**
 * return all movies
 */
export async function movieGetAllAction(request: Request, response: Response) {
    response.send(await movieGetAll())
}