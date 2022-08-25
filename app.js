// UI
const ul = document.querySelector(".list");
const modals = document.querySelectorAll(".modal");
const container = document.querySelector(".container");
const empty = document.querySelector(".empty");
// Elements to add new contact
const add_btn = document.querySelector("nav .btn");
const modal_add = document.querySelector(".modal-add");
const close_add_modal = modal_add.querySelector(".close");
const modal_add_form = modal_add.querySelector(".modal-form");
const modal_add_inputs = modal_add.querySelectorAll(".modal-form input");
// Elements to edit existing contact
const modal_edit = document.querySelector(".modal-edit");
const edit_name_input = modal_edit.querySelector("#name_edit");
const edit_phone_input = modal_edit.querySelector("#phone_edit");
const edit_email_input = modal_edit.querySelector("#email_edit");
const form_edit = modal_edit.querySelector(".modal-form");
const form_edit_inputs = modal_edit.querySelectorAll(".modal-form input");
const close_modal_edit = modal_edit.querySelector(".close");
// Elements to delete contact
const modal_delete = document.querySelector(".modal-delete");
const cancel_delete = modal_delete.querySelector(".cancel");
const close_delete = modal_delete.querySelector(".close");
const confirm_delete = modal_delete.querySelector(".confirm");

const app = {
  users: JSON.parse(localStorage.getItem("users") || "[]"),
  values: {
    name: "",
    phone: "",
    email: "",
  },
  userId: null,
  singleUser: null,
  selectors() {
    const edit_buttons = document.querySelectorAll(".edit");
    const delete_buttons = document.querySelectorAll(".delete");
    return {
      edit_buttons,
      delete_buttons,
    };
  },
  eventListeners() {
    // Show Add Modal
    add_btn.addEventListener("click", () => this.modalOpen("modal-add"));
    // Close Add Modal
    close_add_modal.addEventListener("click", () =>
      this.modalClose("modal-add")
    );
    // Closes the modal if modal open and black part of the display clicked
    modals.forEach((modal) => {
      modal.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!e.target.closest(".modal-form")) {
          modal.style.display = "none";
        }
      });
    });
    // Submits to add new contact
    modal_add_form.addEventListener("submit", (e) => this.submitContact(e));
    // Writes the value if input value changes
    modal_add_inputs.forEach((input) => {
      input.addEventListener("input", (e) => this.changeAddHandler(e));
    });
    // Gets the elements after contacts renders
    const { edit_buttons, delete_buttons } = this.selectors();
    // Show Edit Modal
    edit_buttons.forEach((edit_button) => {
      edit_button.addEventListener("click", (e) =>
        this.renderEditUserValues(e)
      );
    });
    // Closes Edit Modal
    close_modal_edit.addEventListener("click", () =>
      this.modalClose("modal-edit")
    );
    // Edit input values
    form_edit_inputs.forEach((form_input) => {
      form_input.addEventListener("input", (e) => this.changeEditHandler(e));
    });
    // Submits edited contact
    modal_edit.addEventListener("submit", (e) => this.submitEditContact(e));
    // Shows Confirm to delete Modal
    delete_buttons.forEach((delete_button) => {
      delete_button.addEventListener("click", (e) => this.passIdToDelete(e));
    });
    // Close Delete Modal
    [close_delete, cancel_delete].forEach((close) => {
      close.addEventListener("click", () => this.modalClose("modal-delete"));
    });
    // Confirms to Delete and deletes
    confirm_delete.addEventListener("click", () => this.confirmDelete());
  },
  changeAddHandler(e) {
    const { name, value } = e.target;
    this.values.id = this.users.length + 1;
    this.values = { ...this.values, [name]: value };
  },
  changeEditHandler(e) {
    const { name, value } = e.target;
    this.singleUser[name] = value;
  },
  submitContact(e) {
    e.preventDefault();
    if (!this.isValuesEmpty()) {
      this.users.push(this.values);
      localStorage.setItem("users", JSON.stringify(this.users));
      ul.textContent = "";
      this.render();
      modal_add_form.reset();
      this.modalClose("modal-add");
      this.clearValues();
    }
  },
  submitEditContact(e) {
    e.preventDefault();
    const updatedUserIndex = this.users.findIndex(
      (u) => u.id === this.singleUser.id
    );
    this.users[updatedUserIndex].name = this.singleUser.name;
    this.users[updatedUserIndex].phone = this.singleUser.phone;
    this.users[updatedUserIndex].email = this.singleUser.email;
    localStorage.setItem("users", JSON.stringify(this.users));
    ul.textContent = "";
    this.render();
    form_edit.reset();
    this.modalClose("modal-edit");
  },
  renderEditUserValues(e) {
    this.modalOpen("modal-edit");
    const id = parseInt(e.target.getAttribute("data-id"));
    this.singleUser = this.users.filter((user) => user.id === id)[0];
    edit_name_input.value = this.singleUser.name;
    edit_phone_input.value = this.singleUser.phone;
    edit_email_input.value = this.singleUser.email;
  },
  passIdToDelete(e) {
    this.modalOpen("modal-delete");
    this.userId = parseInt(e.target.getAttribute("data-id"));
  },
  confirmDelete() {
    this.users = this.users.filter((user) => user.id !== this.userId);
    localStorage.setItem("users", JSON.stringify(this.users));
    ul.textContent = "";
    this.render();
    this.modalClose("modal-delete");
  },
  isValuesEmpty() {
    return Object.values(this.values).every((x) => x === null || x === "");
  },
  isUsersEmpty() {
    !this.users.length
      ? (empty.style.display = "block")
      : (empty.style.display = "none");
  },
  clearValues() {
    this.values = {
      name: "",
      phone: "",
      email: "",
    };
  },
  modalOpen(element) {
    const modal = document.querySelector(`.${element}`);
    modal.style.display = "block";
  },
  modalClose(element) {
    const modal = document.querySelector(`.${element}`);
    modal.style.display = "none";
  },
  render() {
    this.isUsersEmpty();
    this.users.forEach((user) => {
      const li = document.createElement("li");
      li.classList.add("list-item");
      li.innerHTML += `
                <div class="card">
                  <h2>${user.name}</h2>
                  <p>Phone: <a href="tel:${user.phone}"><strong>${user.phone}</strong></p></a>
                  <p>Email: <a href="mailto:${user.email}"><strong>${user.email}</strong></a></p>
                </div>
                <div class="actions">
                  <span class="edit" data-id="${user.id}">
                    <img src="./icons/edit.svg" alt="edit" data-id="${user.id}" />
                  </span>
                  <span class="delete" data-id="${user.id}">
                    <img src="./icons/delete.svg" alt="delete" data-id="${user.id}" />
                  </span>
                </div>
              `;
      ul.append(li);
    });
    this.eventListeners();
    this.selectors();
  },
};

app.render();
