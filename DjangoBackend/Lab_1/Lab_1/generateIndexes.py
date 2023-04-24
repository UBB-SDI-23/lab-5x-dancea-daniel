with open('newIndexes.sql', 'w') as file:
    file.write("""CREATE INDEX idx_nationality ON "Lab_1_book"(nationality);""")