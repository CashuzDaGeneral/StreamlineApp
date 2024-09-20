# Streamline App

Streamline App is a low-code app development platform with AI assistance, built using Flask and Vanilla JS.

## Features

1. User Authentication
2. Project Management
3. AI-assisted Component Suggestions
4. Drag-and-Drop Interface
5. Real-time Preview
6. Code Generation
7. Component Optimization
8. Version Control
9. Team Collaboration

## Version Control

Streamline App now includes version control features, allowing users to:

- Create new versions of their projects
- View a list of all project versions
- Switch between different versions (coming soon)

## Team Collaboration

The new team collaboration features enable users to:

- Add collaborators to their projects
- View a list of collaborators for each project
- Remove collaborators from projects

## Setup and Installation

1. Clone the repository
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up the environment variables:
   - `SECRET_KEY`: A secret key for the application
   - `DATABASE_URL`: The URL for your database
   - `OPENAI_API_KEY`: Your OpenAI API key for AI assistance features

4. Initialize the database:
   ```
   flask db upgrade
   ```

5. Run the application:
   ```
   python main.py
   ```

## Usage

1. Register a new account or log in to an existing account
2. Create a new project or select an existing project from the dashboard
3. Use the drag-and-drop interface to add components to your project
4. Utilize AI suggestions for component recommendations
5. Generate code for your project
6. Create versions of your project to track changes
7. Add collaborators to work on projects together

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
