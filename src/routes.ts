import { homeAction } from "./controller/HomeAction";
import { crawlLinksAction } from "./controller/CrawlLinksAction";
import { movieGetAllAction } from "./controller/MovieGetAllAction";

/**
 * All routes.
 */
const Routes = [
    {
        path: "/",
        method: "get",
        action: homeAction
    },
    {
        path: "/",
        method: "post",
        action: crawlLinksAction
    },
    {
        path: "/movies",
        method: "get",
        action: movieGetAllAction
    },
];

/**
 * All application routes.
 */
export default Array.prototype.concat(Routes);

