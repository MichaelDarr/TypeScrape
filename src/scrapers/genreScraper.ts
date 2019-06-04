/**
 * Manages storage of a single genre string
 */

// library dependencies
import { getManager } from 'typeorm';

// internal class dependencies
import { AbstractScraper } from './abstractScraper';
import { GenreEntity } from '../entities/GenreEntity';
import { Log } from '../helpers/classes/log';

export class GenreScraper extends AbstractScraper {
    public name: string;

    public constructor(
        name: string,
        verbose = false,
    ) {
        const urlEncodedName = encodeURIComponent(name);
        const url = `https://rateyourmusic.com/genre/${urlEncodedName}`;
        super(url, 'RYM genre', verbose);
        this.name = name;
    }

    /**
     *  Either find this genre in DB or create it, then return the entity
     *
     * @return Genre Database Entity
     */
    public async getEntity(): Promise<GenreEntity> {
        return getManager().findOne(GenreEntity, { name: this.name });
    }

    protected extractInfo(): void {
    }

    protected async scrapeDependencies(): Promise<void> {
        return Promise.resolve();
    }

    protected async saveToDB(): Promise<GenreEntity> {
        let genre = new GenreEntity();
        genre.name = this.name;
        genre = await getManager().save(genre);
        this.databaseID = genre.id;
        return genre;
    }

    public static createScrapers(genres: string[]): GenreScraper[] {
        const genreArr: GenreScraper[] = [];
        genres.forEach((genre): void => {
            const genreEntity = new GenreScraper(genre);
            genreArr.push(genreEntity);
        });
        return genreArr;
    }

    public requestScrape(): Promise<void> {
        return Promise.resolve();
    }

    public printInfo(): void {
        if(this.dataReadFromDB) {
            this.printResult();
            return;
        }
        Log.log(`Genre: ${this.name}`);
    }
}
