from faker import Faker

fake = Faker()


with open('books_data.sql', 'w') as file:
    file.write("""TRUNCATE TABLE "Lab_1_book" RESTART IDENTITY CASCADE;\n""")
    for _ in range(10):
        values = []
        for i in range(1000):
            name = fake.name().replace("'", "''")
            description = fake.text(max_nb_chars=40).replace("'", "''")
            copies_sold = fake.pyint(min_value=1, max_value=100)
            publication_date = fake.date_between(start_date='-12y', end_date='today')
            author_id = fake.pyint(min_value=1, max_value=10000)
            values.append(f"('{name}', '{description}', '{copies_sold}', '{publication_date}', {author_id})")
        sql = f"""INSERT INTO "Lab_1_book" (name, description, copies_sold, publication_date, author_id) VALUES {', '.join(values)};\n"""
        file.write(sql)
