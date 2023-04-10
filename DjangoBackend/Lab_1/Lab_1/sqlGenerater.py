# from faker import Faker
#
# fake = Faker()
#
# with open('first_data.sql', 'w') as file:
#     file.write("""TRUNCATE TABLE "Lab_1_author" RESTART IDENTITY CASCADE;\n""")
#     for _ in range(1000):
#         values = []
#         for i in range(1000):
#             last_name = fake.last_name().replace("'", "''")
#             first_name = fake.first_name().replace("'", "''")
#             nationality = fake.country().replace("'", "''")
#             books_sold = fake.pyint(min_value=1, max_value=1000)
#             DOB = fake.date_between(start_date='-12y', end_date='today')
#             description = fake.words(nb=100)
#             desc = " ".join(description)
#             values.append(f"('{first_name}', '{last_name}', '{DOB}', '{nationality}', {books_sold}, '{desc}')")
#
#         sql = f"""INSERT INTO "Lab_1_author" (first_name, last_name, "DOB", nationality, books_sold, description) VALUES {', '.join(values)};\n"""
#         file.write(sql)


#
# with open('books_data.sql', 'w') as file:
#     file.write("""TRUNCATE TABLE "Lab_1_book" RESTART IDENTITY CASCADE;\n""")
#     for _ in range(10):
#         values = []
#         for i in range(1000):
#             name = fake.name().replace("'", "''")
#             description = fake.text(max_nb_chars=40).replace("'", "''")
#             copies_sold = fake.pyint(min_value=1, max_value=100)
#             publication_date = fake.date_between(start_date='-12y', end_date='today')
#             author_id = fake.pyint(min_value=1, max_value=10000)
#             values.append(f"('{name}', '{description}', '{copies_sold}', '{publication_date}', {author_id})")
#         sql = f"""INSERT INTO "Lab_1_book" (name, description, copies_sold, publication_date, author_id) VALUES {', '.join(values)};\n"""
#         file.write(sql)

#
# with open('publishers_data.sql', 'w') as file:
#     file.write("""TRUNCATE TABLE "Lab_1_publisher" RESTART IDENTITY CASCADE;\n""")
#     for _ in range(10):
#         values = []
#         for i in range(1000):
#             name = fake.name().replace("'", "''")
#             description = fake.text(max_nb_chars=40).replace("'", "''")
#             total_copies_sold = fake.pyint(min_value=1, max_value=100)
#             headquarter = fake.city().replace("'", "''")
#             established = fake.date_between(start_date='-100y', end_date='-50yr')
#             values.append(f"('{name}', '{headquarter}', '{established}', '{description}', {total_copies_sold})")
#         sql = f"""INSERT INTO "Lab_1_publisher" (name, headquarter, established, description, total_copies_sold) VALUES {', '.join(values)};\n"""
#         file.write(sql)

#
# with open('published_books_data.sql', 'w') as file:
#     file.write("""TRUNCATE TABLE "Lab_1_publishedbooks" RESTART IDENTITY CASCADE;\n""")
#
#     for _ in range(1000):
#         values = []
#         pairs = set()
#         batch_size = 1000
#         while(batch_size > 0):
#             book_id = fake.pyint(min_value=1, max_value=10000)
#             publisher_id = fake.pyint(min_value=1, max_value=10000)
#             if (book_id, publisher_id) not in pairs:
#                 pairs.add((book_id, publisher_id))
#                 batch_size -= 1
#                 year = fake.pyint(min_value=1950, max_value=2022)
#                 price = fake.pyfloat(left_digits=2, right_digits=2, min_value=10, max_value=99)
#                 values.append(f"({year}, {price}, {book_id}, {publisher_id})")
#         sql = f"""INSERT INTO "Lab_1_publishedbooks" (year, price, book_id, publisher_id) VALUES {', '.join(values)};\n"""
#         file.write(sql)
