const { readFile, writeFile } = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
require("colors");

const contactsArray = () => {
  return readFile("./db.txt", "utf-8")
    .then((data) => JSON.parse(data))
    .catch((err) => console.error(err.message.red));
};

const saveContactArray = (contacts) => {
  writeFile("./db.txt", JSON.stringify(contacts, null, 2), (err) => {
    if (err) {
      console.error(err.message.red);
    }
  });
};

function listContacts() {
  contactsArray()
    .then((contacts) => {
      return contacts.map((contact) => {
        return {
          Name: contact.name,
          Phone: contact.phone,
          Email: contact.email,
        };
      });
    })
    .then((result) => console.table(result))
    .catch((err) => console.error(err.message.red));
}

function getContactById(contactId) {
  contactsArray()
    .then((contacts) => {
      return contacts.find((user) => user.id === contactId);
    })
    .then((result) =>
      console.log(
        `Your searched contact is\n${result.name}\n${result.phone}\n${result.email}`
          .cyan
      )
    )
    .catch((err) => console.error(err.message.red));
}

async function removeContact(contactId) {
  contactsArray()
    .then((contacts) => {
      const index = contacts.findIndex((user) => user.id === contactId);
      const deleteContact = contacts.splice(index, 1);
      saveContactArray(contacts);

      return deleteContact[0];
    })
    .then((result) =>
      console.log(
        `Your deleted is contact\n${result.name}\n${result.phone}\n${result.email}`
          .yellow
      )
    )
    .catch((err) => console.error(err.message.red));
}

function addContact(name, email, phone) {
  contactsArray()
    .then((contacts) => {
      contacts.push({
        id: uuidv4(),
        name,
        email,
        phone,
      });
      saveContactArray(contacts);
      return contacts[contacts.length - 1];
    })
    .then((result) =>
      console.log(
        `Your added contact is\n${result.name}\n${result.phone}\n${result.email}`
          .blue
      )
    )
    .catch((err) => console.error(err.message.red));
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
