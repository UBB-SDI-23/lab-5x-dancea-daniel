import { Book } from "./Book";
import { Publisher } from "./Publisher";

export interface PublishedBooks {
  year: number;
  price: string;
  book: Book;
  publisher: Publisher;
}
