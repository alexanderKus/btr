const LOCALSTORAGEKEY = "books_to_read";
const BTR_API = "http://localhost:8000/books"

class Book {
  constructor(title) {
    this.title = title;
  }

  get_title() {
    return this.title;
  }
}

/*
 * Get list of books from api.
 *
 * @returns {Book[]} list of books.
 */
async function get_books() {
  const data = await fetch(BTR_API);
  const books = await data.json();
  // FIXME: return list of object of type `Book`
  return books;
}


/*
 * Add book to collecion. Calls api.
 *
 * @param {Book} book to add.
 */
async function save_book(book) {
  const config = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book)
  };
  await fetch(BTR_API, config);
}

/*
 * Remove book from collecion. Calls api.
 *
 * @param {Book} book to add.
 */
async function remove_book(book) {
  const config = {
    method: "DELETE",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book)
  };
  await fetch(BTR_API, config);
  // TODO: come up with better solution.
  await generate_view();
}

/*
 * Generate view. Calls api `/books` in order to get books. Then create element on the DOM.
 */
async function generate_view() {
  let book_list = document.querySelector("#book-list");
  while(book_list.firstChild)
    book_list.removeChild(book_list.firstChild);
  let data = await get_books(); 
  data.forEach(el => {
    // FIXME: el should aleardy be of type Bokk
    let book = clone_book_template(new Book(el.Title));
    book_list.appendChild(book);
  });
}

/*
 * Create DOM element from template
 *
 * @param {Book} 
 */
function clone_book_template(book) {
  const template = document.querySelector("#book-template");
  let cloned_book = template.content.cloneNode(true);
  let cloned_book_title = cloned_book.querySelector(".book-title");
  let cloned_book_delete_btn = cloned_book.querySelector(".book-delete-btn");
  cloned_book_delete_btn.addEventListener("click",() => remove_book(book));
  cloned_book_title.innerHTML = book.get_title();
  return cloned_book;
}

/*
 * Creates new book to read.
 *
 * Get book's title. Save book. Generate view
 */
async function add_book() {
  const input = document.querySelector("#book-add-input"); 
  const book_title = input.value || "";
  if (book_title !== "") {
    input.value = "";
    const book = new Book(book_title);
    await save_book(book);
    await generate_view();
  }
}

const book_add_btn = document.querySelector("#book-add-btn");
book_add_btn.addEventListener("click", async () => { await add_book() });

window.addEventListener("load", async (event) => {
  await generate_view();
});


