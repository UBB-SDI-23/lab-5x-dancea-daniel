import { Book } from "./Book";
import { Publisher } from "./Publisher";

export interface PublishedBooks {
  year: number;
  price: number;
  book: Book;
  publisher: Publisher;
}
