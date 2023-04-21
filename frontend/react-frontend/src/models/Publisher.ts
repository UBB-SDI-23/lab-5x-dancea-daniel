import { PublishedBooks } from "./PublisherBooks";

export interface Publisher {
  id?: number;
  name: string;
  headquarter: string;
  established: string;
  description: string;
  total_copies_sold: number;
  publishing_details?: PublishedBooks[];
  num_published?: number;
}
