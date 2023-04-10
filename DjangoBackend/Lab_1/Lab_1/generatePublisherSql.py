from faker import Faker

fake = Faker()

with open('publishers_data.sql', 'w') as file:
    file.write("""TRUNCATE TABLE "Lab_1_publisher" RESTART IDENTITY CASCADE;\n""")
    for _ in range(10):
        values = []
        for i in range(1000):
            name = fake.name().replace("'", "''")
            description = fake.text(max_nb_chars=40).replace("'", "''")
            total_copies_sold = fake.pyint(min_value=1, max_value=100)
            headquarter = fake.city().replace("'", "''")
            established = fake.date_between(start_date='-100y', end_date='-50yr')
            values.append(f"('{name}', '{headquarter}', '{established}', '{description}', {total_copies_sold})")
        sql = f"""INSERT INTO "Lab_1_publisher" (name, headquarter, established, description, total_copies_sold) VALUES {', '.join(values)};\n"""
        file.write(sql)
