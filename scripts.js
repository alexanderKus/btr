const LOCALSTORAGEKEY = "books_to_read";

function get_books_from_local_storage() {
  let books = JSON.parse(localStorage.getItem(LOCALSTORAGEKEY)) || [];
  return books;
}

function save_book_into_local_storage(book_title) {
  let data = get_books_from_local_storage(); 
  data.push(book_title);
  localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(data));
}

function generate_view() {
  let book_list = document.querySelector("#book-list");
  while(book_list.firstChild)
    book_list.removeChild(book_list.firstChild);
  let data = get_books_from_local_storage(); 
  data.forEach(el => {
    let book = clone_book_template(el);
    book_list.appendChild(book);
  });
}

function clone_book_template(book_title) {
  const template = document.querySelector("#book-template");
  let cloned_book = template.content.cloneNode(true);
  let cloned_book_title = cloned_book.querySelector(".book-title");
  let cloned_book_delete_btn = cloned_book.querySelector(".book-delete-btn");
  cloned_book_delete_btn.addEventListener("click",() => remove_book(book_title));
  cloned_book_title.innerHTML = book_title;

  return cloned_book;
}

function remove_book(book_title) {
  let data = get_books_from_local_storage(); 
  data = data.filter(el => el !== book_title);
  localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(data));
  generate_view();
}

function add_book() {
  const input = document.querySelector("#book-add-input"); 
  const book_title = input.value || "";
  if (book_title !== "") {
    input.value = "";
    save_book_into_local_storage(book_title);
    generate_view();
  }
}

const book_add_btn = document.querySelector("#book-add-btn");
book_add_btn.addEventListener("click", add_book);

window.addEventListener("load", (event) => {
  generate_view();
});


