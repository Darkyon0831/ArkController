# Login Page (Front-end)
- **Design:** A simple login screen with a fixed centered background and a login window in the middle with "Login" text and username, password inputs with a login button

- **Logic:** given that username and password has been filled out, the login button will submit the credentials via SSL to a check_credential script, if credentials are legit. it will give you a valid session_key that will be saved to a secure cookie

**Sub modules**
- check_credential script (Backend)

# check_credentials (Back-end)
- **Design:** None

- **Logic:** check credentials will listen to incoming POST calls and read input as json, check input.

    If username and password: Password will then hash sha256, salted (With key saved in MySQL) and encoded with Base64. The script will then check with the saved username and password in the MySQL database to check if right. if right it will generate a new session_key. Save it to MySQL for a time period and return it to the caller via json.

    If session_key: It will check with saved session_keys from MySQL database. if right. it will simply return session_key.

    If None: do nothing

    If invalid session_key, username/password: return a invalid package.

**Sub modules**
- ArkControllerHasher
- MySQL

# DashBoard Page (Front-End)
- **Design:** A view for all different ark servers, a server will have a information card with a image (with default backup) and basic information about the server. the server cards will be stacked verticality and vary between a gray and dark gray background color. It will also have a special view if card is under a set size (To support mobile view).

- **Logic:** Frontend will fetch the neccassary data from the ArkControllerQuery Websocket api and show them on the card, Each server card will have a stop, restart and modify button. The stop server will query ArkControllerQuery Websocket api to stop the server, the restart will do the same but restart and the modify button will open a seperate modify page to modify server.

**Sub modules**
- ArkControllerQuery Websocket api

# Modify server page (Front-End)