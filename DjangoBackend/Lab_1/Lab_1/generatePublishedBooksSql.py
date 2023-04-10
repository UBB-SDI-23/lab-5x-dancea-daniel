from faker import Faker

fake = Faker()


with open('published_books_data.sql', 'w') as file:
    file.write("""TRUNCATE TABLE "Lab_1_publishedbooks" RESTART IDENTITY CASCADE;\n""")

    for i in range(1000):
        book_id = fake.random_int(min=i * 100 + 1, max=(i + 1) * 100)
        values = []
        for j in range(1000):
            publisher_id = fake.random_int(min=j * 1000 + 1, max=(j + 1) * 1000)
            year = fake.pyint(min_value=1950, max_value=2022)
            price = fake.pyfloat(left_digits=2, right_digits=2, min_value=10, max_value=99)
            values.append(f"({year}, {price}, {book_id}, {publisher_id})")
        sql = f"""INSERT INTO "Lab_1_publishedbooks" (year, price, book_id, publisher_id) VALUES {', '.join(values)};\n"""
        file.write(sql)