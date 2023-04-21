from faker import Faker

fake = Faker()

with open('author_data.sql', 'w') as file:
    file.write("""TRUNCATE TABLE "Lab_1_author" RESTART IDENTITY CASCADE;\n""")
    for _ in range(1000):
        values = []
        for i in range(1000):
            last_name = fake.last_name().replace("'", "''")
            first_name = fake.first_name().replace("'", "''")
            nationality = fake.country().replace("'", "''")
            books_sold = fake.pyint(min_value=1, max_value=1000)
            DOB = fake.date_between(start_date='-49y', end_date='-30y')
            description = fake.words(nb=100)
            desc = " ".join(description)
            values.append(f"('{first_name}', '{last_name}', '{DOB}', '{nationality}', {books_sold}, '{desc}')")

        sql = f"""INSERT INTO "Lab_1_author" (first_name, last_name, "DOB", nationality, books_sold, description) VALUES {', '.join(values)};\n"""
        file.write(sql)