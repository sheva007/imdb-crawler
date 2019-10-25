import { Request, Response } from "express";
import axois from 'axios';
import * as cheerio from 'cheerio';
import { movieSave } from "../module/movies";
import * as fs from 'fs';
/**
 * crawl links
 */
export async function crawlLinksAction(request: Request, response: Response) {

    if (request.body.links) {
        // split the incoming string into links
        const links = request.body.links.split('\n') as [];

        // numbers to be used in stats
        let crawled = 0;
        let newAdded = 0;
        let updated = 0;
        let failed = 0;

        // HTML to be used in the final page
        let itemHTML = fs.readFileSync(__dirname + '/../../assets/result_item.html').toString();
        let pageHTML = fs.readFileSync(__dirname + '/../../assets/results_page.html').toString();
        let collection = "";

        // loop around the links
        for (let i = 0; i < links.length; i++) {
            const url = links[i] as string;
            if (url.indexOf('imdb.com/title/tt') !== -1) {//only process imdb URLs
                try {
                    //use RegEx to extract the movie id, thanks to https://stackoverflow.com/questions/31623704/js-regular-expression-to-match-imdb-url
                    const imdb_id = url.match(/(?:.*\.|.*)imdb.com\/(?:t|T)itle(?:\?|\/)(..\d+)/i)[1];

                    // HTTP request for the url
                    const page = await axois.get(url.trim());

                    // prepare cheerio
                    let $ = cheerio.load(page.data);

                    // declearing the variables that will be used
                    let title: string, year: string, release: string, rating: string;

                    // slecting the title string
                    title = $('h1').text();
                    // removing any excess spaces
                    title = title.trim();

                    // getting the year from the title string
                    const start = title.indexOf("(");
                    year = title.substr(start + 1, 4);

                    // clearing the title string of the year
                    title = title.substr(0, start - 1);

                    // getting the realse date
                    release = $('div.subtext').children().last().text();
                    release = release.trim();

                    // getting the rating
                    rating = $('span[itemprop|="ratingValue"]').text();

                    // save and register the returned code into stats
                    crawled += 1;

                    const code = await movieSave(imdb_id, +rating, release, title, year);

                    if (code === 0) {
                        newAdded += 1;
                    } else if (code === 1) {
                        updated += 1;
                    } else {
                        failed += 1;
                    }

                    if (code === 0 || code === 1) {
                        // add the needed html 
                        let singleItem = itemHTML;
                        singleItem = singleItem.replace("[[title]]", title);
                        singleItem = singleItem.replace("[[year]]", year);
                        singleItem = singleItem.replace("[[release]]", release);
                        singleItem = singleItem.replace("[[rating]]", rating);
                        singleItem = singleItem.replace("[[url]]", "https://www.imdb.com/title/" + imdb_id + "/");
                        collection += singleItem;
                    }

                } catch (err) {
                    console.error(err);
                }

            }
        }

        pageHTML = pageHTML.replace('[[total]]', '' + links.length);
        pageHTML = pageHTML.replace('[[rejected]]', '' + (links.length - crawled));
        pageHTML = pageHTML.replace('[[crawled]]', '' + crawled);
        pageHTML = pageHTML.replace('[[newAdded]]', '' + newAdded);
        pageHTML = pageHTML.replace('[[updated]]', '' + updated);
        pageHTML = pageHTML.replace('[[failed]]', '' + failed);
        pageHTML = pageHTML.replace('[[collection]]', collection);
        response.send(pageHTML);
    }

    // INPUT_Not_Acceptable
    response.status(406);
    response.end();
    return;


}