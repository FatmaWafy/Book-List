//Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//Handle UI Storage
class UI {
  static displayBooks() {
    const books = store.getBook();
    books.forEach((book) => UI.addBooksToList(book));
  }

  static addBooksToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${book.title}</td> 
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector(".alert").remove(), 1500);
  }

  static clearFilds() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Store Class : Handle Storage
class store {
  static getBook() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = store.getBook();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = store.getBook();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // instiate book
    const book = new Book(title, author, isbn);

    // add book to UI
    UI.addBooksToList(book);

    // add book to Store
    store.addBook(book);

    UI.showAlert("Book Added", "success");

    // Clear Filds
    UI.clearFilds();
  }
});

//Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  // remove book from UI
  UI.deleteBook(e.target);

  // remove book from store
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  UI.showAlert("Book Removed", "success");
});
