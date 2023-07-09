process.env.NODE_ENV = "test"

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let book_isbn;

beforeEach(async () => {
    await db.query('DELETE FROM books');
  });

beforeEach(async () => {
  let result = await db.query(`
    INSERT INTO
      books (isbn, amazon_url,author,language,pages,publisher,title,year)
      VALUES(
        '123432122',
        'https://amazon.com/book',
        'Sam',
        'English',
        100,
        'Test Publishing',
        'Book Time', 
        2008)
      RETURNING isbn`);

  book_isbn = result.rows[0].isbn
});

afterAll(async () => {
    await db.end();
  });

describe("POST /books", function () {
    test("Create new book", async function () {
      const response = await request(app)
          .post(`/books`)
          .send({
            isbn: '75839588',
            amazon_url: "https://facebook.com",
            author: "sam",
            language: "english",
            pages: 600,
            publisher: "publisher",
            title: "the title of the book",
            year: 2020
          });
      expect(response.statusCode).toBe(201);
      expect(response.body.book).toHaveProperty("isbn");
    });
  });