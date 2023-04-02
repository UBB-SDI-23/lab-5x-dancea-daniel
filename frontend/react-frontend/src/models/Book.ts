import { Author } from "./Author";
import { PublishedBooks } from "./PublisherBooks";

export interface Book {
  id?: number;
  name: string;
  description: string;
  copies_sold: number;
  publication_date?: Date;
  author?: Author;
  published_in?: PublishedBooks[];
}
