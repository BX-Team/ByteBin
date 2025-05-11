# ByteBin

**ByteBin is a simple web app for writing & sharing code**. This site is very similar to other pastebin services, but we decided to make the site the way we see fit.

Anyone can create a paste, and it will be available for 14 days. After that, the paste will be deleted. The public instance can be accessed using the endpoints listed below.

##### 1) In a Web Browser
Just go to https://bin.bxteam.org!

##### 2) Using Curl
You can submit content most easily using [curl](https://curl.se/docs/manpage.html).

```shell
# Upload the contents of a file
> curl -T example.txt https://bin.bxteam.org/api/post

# Upload the contents of a file and specify the language
> curl -T example.yml https://bin.bxteam.org/api/post?language=yaml

# Pipe in some output from any command
> echo "Hello world" | curl -T - https://bin.bxteam.org/api/post
```

<details>
  <summary>If you don't want to do so much typing, you can create a shorter <b>alias</b>.</summary>
  
  ```bash
  # Add this to the end of `~/.bashrc` and run 'source ~/.bashrc'
  bytebin() {
    curl -T $1 https://bin.bxteam.org/api/post
  }
  ```

  then...

  ```shell
  # Upload the contents of a file
  > paste example.txt

  # Pipe in some output from any command
  > echo "Hello!" | paste -
  ```
</details>

##### 3) From Code
Send GET/POST/PUT requests to `https://bin.bxteam.org/`. More info [below](#API).

---

### About
The frontend is written using the Next.js framework with TypeScript, providing both server and client-side rendering capabilities. The UI is built with React and styled using Tailwind CSS with shadcn/ui components for a modern look and feel. For the backend, we leverage Next.js API routes along with Supabase for the database and authentication. The application includes built-in rate limiting and content filtering systems to prevent abuse.

The user-interface is based on the [Monaco Editor](https://microsoft.github.io/monaco-editor), the engine behind the popular Visual Studio Code text editor. It's quite simple; it supports syntax highlighting, automatic indentation, many supported languages, linking to specific lines or sections, and more!

> [!TIP]
> ByteBin is publically available at [https://bin.bxteam.org](https://bin.bxteam.org).

### ByteBin Rules

Please, follow the rules described in the file [RULES.md](RULES.md) when using the site. If you find any bugs or issues, please report them in our [Discord server](https://discord.gg/qNyybSSPm5).

### API

* To **read** content, send a HTTP `GET` request to `https://bin.bxteam.org/api/<key>`.
  * Replace `<key>` with the id of the paste.
  * The response will be a JSON object containing the paste's content, language, and other metadata.
  * Example of a response:
    ```json
    {
        "id": "RXvAuVllKA",
        "language": "Plain",
        "expires_at": "2025-05-17T16:23:15.181+00:00",
        "url": "https://bin.bxteam.org/RXvAuVllKA",
        "content": "Hello world!"
    }
    ```
* To **upload** content, send a HTTP `POST` request to `https://bin.bxteam.org/api/post`.
  * The request body should contain the content you want to upload.
  * You can also specify the language by adding a query parameter `?language=<language>` to the end of URL.
  * The response will be a JSON object containing the paste's id, language, expiration date, and URL.

