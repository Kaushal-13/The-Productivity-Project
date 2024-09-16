Here’s the improved documentation using markdown:

---

# Welcome to The Productivity Project

### Overview

**The Productivity Project** is designed to offer users a unified platform that combines different productivity systems like **Kanban**, **Getting Things Done (GTD)**, and more.

For example, if you're working on a college project and prefer using a **Kanban board**, while also managing a simple **To-Do List** for a different task, you can do both within the same app. The project is currently a basic prototype, with only the Kanban board implemented, but we have big plans for future expansion.

---

### Structure

The project uses a simple yet flexible architecture:

- **Frontend:** React
- **Backend:** Flask
- **Database:** SQLite

The database design is straightforward: if we support `k` different productivity frameworks, we will have `k + 1` tables—`k` for each specific framework, plus one central table to track all active projects.

Here’s a visualization of the current database structure:
![Database Structure](https://github.com/user-attachments/assets/b0db8c79-85f8-445b-b8ed-e67811279795)

This will evolve as we integrate more frameworks.

---

### Backend Structure

The backend is organized as follows:

```
Backend
├── App.py                # Main entry point for the Flask server
├── models                # Contains definitions of database tables
│   ├── model1.py
│   ├── model2.py
├── blueprints            # Blueprints for different API endpoints
│   ├── Framework.py
│   ├── Kanban.py
```

The **API calls** are structured like this:

```
/Framework_type/Framework_id
```

For example, if you're accessing a Kanban project with an ID of 1, the API call would look like:

```
/Kanban/1
```

---

### Frontend Structure

The frontend consists of standard React components that can be easily styled and extended. When integrating API calls, ensure they follow the format explained above.

---

### Running the Project

To run the project locally:

1. **Clone the repository**:
   ```bash
   git clone git@github.com:Kaushal-13/The-Productivity-Project.git
   ```

2. **Start the Flask server**:
   Run the Flask backend by executing:
   ```bash
   python run.py
   ```

   The `run.py` file serves as the entry point, making it easier for contributors to manage imports and paths.

3. **Start the React frontend**:
   Navigate to the `client` folder and run:
   ```bash
   npm start
   ```

Once both the backend and frontend are running, the project will be live.

---

### Future Plans

Currently, the app is focused on offering a **Kanban board**, but the foundational structure is scalable. In the future, we plan to integrate additional productivity frameworks and expand the core functionality.

---

### How You Can Contribute

#### If you are a programmer:
- Clone the repository, pick an issue, and start coding!

#### If you are not a programmer:
- Have you read a productivity book and want to share insights? Contribute by summarizing productivity methods for developers to implement. We will create a dedicated section for these contributions.

---

Feel free to check out our repository and get involved:

[The Productivity Project GitHub Repository](https://github.com/Kaushal-13/The-Productivity-Project)

---


   
