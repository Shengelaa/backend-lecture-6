#! /usr/bin/env node

import { Command } from "commander";
import fs from "fs/promises";

const program = new Command();

// program
//   .command("add")
//   .option("--task <fullname>")
//   .action(async (opts) => {
//     try {
//       const user = await fs.readFile("todo.json", "utf-8");

//       const parsedUsers = JSON.parse(user);

//       parsedUsers.push({ task: opts.task });

//       await fs.writeFile("todo.json", JSON.stringify(parsedUsers, null, 2));

//       console.log("Updated todo.json:", parsedUsers);
//     } catch (error) {
//       console.error("error", error);
//     }
//   });

// program.parse();




program
  .command("add")
  .option("--title <title>", "Title of the book")
  .option("--author <author>", "Author of the book")
  .option("--status <status>", "Status of the book (e.g., unread, read)")
  .action(async (opts) => {
    try {
      const data = await fs.readFile("todo.json", "utf-8").catch(() => '{"books": [], "lastId": 0}');
      const parsedData = JSON.parse(data);
      
      if (!parsedData.books) {
        parsedData.books = [];
      }
      if (parsedData.lastId === undefined) {
        parsedData.lastId = 0;
      }

      const newId = parsedData.lastId + 1;
      const newBook = {
        id: newId,
        title: opts.title,
        author: opts.author,
        status: opts.status || "unread",
      };

      parsedData.books.push(newBook);
      parsedData.lastId = newId;
      
      await fs.writeFile("todo.json", JSON.stringify(parsedData, null, 2));
      console.log("Book added:", newBook);
    } catch (error) {
      console.error("Error:", error);
    }
  });

program
  .command("show")
  .option("--read", "Show all read books")
  .option("--unread", "Show all unread books")
  .action(async (opts) => {
    try {
      const data = await fs.readFile("todo.json", "utf-8");
      const parsedData = JSON.parse(data);

      let filteredBooks = parsedData.books;
      if (opts.read) {
        filteredBooks = parsedData.books.filter(book => book.status === "read");
      } else if (opts.unread) {
        filteredBooks = parsedData.books.filter(book => book.status === "unread");
      }
      console.log("Books:", filteredBooks);
    } catch (error) {
      console.error("Error:", error);
    }
  });

program
  .command("update <id>")
  .option("--status <status>", "New status of the book (e.g., unread, read)")
  .action(async (id, opts) => {
    try {
      const data = await fs.readFile("todo.json", "utf-8");
      const parsedData = JSON.parse(data);

      const bookIndex = parsedData.books.findIndex(book => book.id === parseInt(id));
      if (bookIndex !== -1) {
        parsedData.books[bookIndex].status = opts.status || "read";
        await fs.writeFile("todo.json", JSON.stringify(parsedData, null, 2));
        console.log(`Book with ID ${id} updated to status: ${opts.status || "read"}`);
      } else {
        console.log(`Book with ID ${id} not found.`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

program.parse();
