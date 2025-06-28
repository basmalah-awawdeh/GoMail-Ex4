# GoMail - Exercise 4

A full Gmail-like web using **React**, **Node.js**, and a TCP-based **C++ server** with a Bloom filter.  

This project supports multiple users, live email management, looks and works like Gmail.

## Clone the Repository

```bash
git clone https://github.com/basmalah-awawdeh/GoMail-Ex4.git
```
---

## Running the System in Docker

This project supports Docker-based execution via `docker-compose`.

---

## In The Terminal — Build and Start All Containers

```bash
docker-compose up --build
```
This will build and start the Node.js API container, the C++ server container and the React-Web container.

---

## Example Usage

### Open the React-Web

http://localhost:5173

---

### Register a New User

```bash
Create a new account, and fill your details:
1. Full name

2. Email or username

3. Password (min 8 characters, at least 1 letter, digit and special character from @$!%*?&)

4. Confirm password

5. Choose a profile picture from your computer
```

![Image](https://github.com/user-attachments/assets/67e7f264-cf60-49b1-91da-ae275d6e0d72)

---

### Login to the Account

```bash
Fill in your username and password

Click Login
```
If you want to open 2 users accounts at the same time, you can open the second account in incognito window.

![Image](https://github.com/user-attachments/assets/45fbb68b-1571-474a-85d1-20430423fd6e)

---

### Compose a New Mail

```bash
Click compose button

Fill in recipient, subject, body that can optionally include link.

Click Send to send it immediately.
    ==> The mail appears in Sent for the sender.
    ==> Refresh the Inbox, now it appears in Inbox for the recipient.
```

![Image](https://github.com/user-attachments/assets/6bbd9e3d-d428-4e48-ac20-48f7d3d9b954)

```bash
If you don’t send it, it is saved as a Draft, which you can edit later.
Once sent, you can no longer edit the mail.
```

![Image](https://github.com/user-attachments/assets/75b34488-f5f5-45fc-8eb9-16dfec7f849f)
---

### Spam Mail

```bash
If a sent mail includes a new URL, it is added to the blacklist.
The blacklist is stored in `data/blacklist.txt` and `data/bloom_filter.txt`. These files are automatically loaded and updated by the C++ server.
```

![Image](https://github.com/user-attachments/assets/f328774f-07d2-472f-b2cc-b62423545dab)

```bash
Future mails with the blacklisted URL will go to the Spam label.
```

![Image](https://github.com/user-attachments/assets/f2e74308-dfcc-498f-b69b-2c6165a127ae)

```bash
If you remove a mail from Spam, the URL is removed from the blacklist
```

![Image](https://github.com/user-attachments/assets/e657d9fe-50bb-476d-b10c-8a5e1a67a674)

---

### Mark as Important

```bash
You can toggle the "star" icon to mark/unmark importance.

Click "Important" to see all mails you’ve marked as important.
```

![Image](https://github.com/user-attachments/assets/d18eea2b-98c6-44e2-a697-b37ba13aefa5)

---

### Labels (Categories)

```bash
Click "+ New Label" to create a new custom label.

You can attach mails to these labels.
```

![Image](https://github.com/user-attachments/assets/da3b6629-0ef4-4468-b553-4dd882044621)

---

### Delete Mail
```bash
You can delete a mail.

It is removed only for you, not for the other user.
```

![Image](https://github.com/user-attachments/assets/999b03fb-7f03-4622-918a-64d6509e74bf)

---

### Search Mail

```bash
Use the top search bar to search for a specific word in the mail.

Results update in real time.
```

![Image](https://github.com/user-attachments/assets/9114b9e0-6448-4ad3-ad23-d69f465af3f2)

---

### Dark Mode

```bash
Toggle Dark Mode using the button in the top-right.

The theme updates instantly.
```

![Image](https://github.com/user-attachments/assets/dd6fdbad-2eba-48ab-a830-a6e70b495c1c)

---

###  Logout

```bash
Click your profile picture and then select Logout to exit your session.
```

![Image](https://github.com/user-attachments/assets/472f71aa-3a86-4cae-b3b3-b99d7b641c58)
