import { getManager } from "typeorm";
import { Movie } from "../entities/Movie";


/**
 * get all Movies.
 */
export async function movieGetAll() {
    const repository = getManager().getRepository(Movie);

    const entities = await repository.find();

    return entities;
}

/**
 * save a Movie
 * returns 0 if the movie saved as new
 * return 1 if the movie was only updated
 * returns -1 if there was a db exeption
 * return -2 if the input is not valid
 */
export async function movieSave(imdb_id: string, rating: number, release: string, title: string, year: string) {
    if (!imdb_id || !rating || !release || !title || !year) {
        return -2;
    }
    try {
        const repository = getManager().getRepository(Movie);
        const oldMovie = await repository.findOne({
            imdb_id: imdb_id
        });

        if (oldMovie instanceof Movie) {//the movie already exists so only update the rating
            oldMovie.rating = rating;
            await repository.update(oldMovie.id, oldMovie);
            return 1;
        } else {//this is a new movie
            const newMovie = new Movie();
            newMovie.imdb_id = imdb_id;
            newMovie.rating = rating;
            newMovie.release = release;
            newMovie.title = title;
            newMovie.year = year;
            await repository.save(newMovie);
            return 0;
        }

    } catch (err) {
        console.log(err);
        return -1;
    }
}