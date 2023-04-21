import { Book } from "./Book";

export interface Author {
  id?: number;
  first_name: string;
  last_name: string;
  DOB?: string;
  nationality: string;
  books_sold: number;
  description: string;
  books: Book[];
  num_book?: number;
}
