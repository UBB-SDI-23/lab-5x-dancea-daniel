from faker import Faker

fake = Faker()


with open('published_books_data.sql', 'w') as file:
    file.write("""TRUNCATE TABLE "Lab_1_publishedbooks" RESTART IDENTITY CASCADE;\n""")

    for i in range(10000):
        book_id = fake.random_int(min=i * 10 + 1, max=i * 100)
        values = []
        for j in range(1000):
            publisher_id = fake.random_int(min=j * 100 + 1, max=(j + 1) * 100)
            year = fake.pyint(min_value=2014, max_value=2022)
            price = fake.pyfloat(left_digits=2, right_digits=2, min_value=10, max_value=99)
            values.append(f"({year}, {price}, {book_id}, {publisher_id})")
        sql = f"""INSERT INTO "Lab_1_publishedbooks" (year, price, book_id, publisher_id) VALUES {', '.join(values)};\n"""
        file.write(sql)