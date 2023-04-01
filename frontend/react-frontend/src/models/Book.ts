import { Author } from "./Author";

export interface Book {
  id: number;
  name: string;
  description: string;
  copies_sold: number;
  publication_date: Date;
  author: Author;
}
