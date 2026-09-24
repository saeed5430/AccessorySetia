Agent Rules
General Rules
Always read the contents of the Plans directory located in the project root before making any implementation decisions.

The following files must be treated as project sources of truth:

Plans/TechStack.md
Plans/Structure.md
Plans/Project.md
Follow the rules, architecture, naming conventions, and constraints defined in these files.

Do not make assumptions that conflict with the contents of the Plans directory.

Code Generation Rules
Do not add comments to generated code.
Do not add inline comments.
Do not add block comments.
Generated code should remain clean and self-explanatory through naming and structure.
Frontend Rules
Use the frontend-design skill for frontend design and UI implementation tasks.
Follow the project's existing design system and component architecture.
Respect the technology stack defined in Plans/TechStack.md.
Documentation Rules
Before creating any new .md file, ask for explicit user approval.
Do not create documentation files automatically.
Do not generate new Markdown files unless permission has been granted.
Context and Research Rules
Always use Context7 MCP when working with libraries, frameworks, SDKs, APIs, or external tooling.
Prefer Context7 MCP documentation over assumptions or memory.
Verify implementation details against Context7 MCP before generating code.
Architecture Rules
Follow the project architecture defined in:

Plans/Project.md
Plans/Structure.md
Respect existing folder structures.

Do not introduce new architectural patterns unless explicitly requested.

Keep implementations aligned with the project's defined stack and architecture.

Priority Order
User instructions
Contents of the Plans directory
Context7 MCP documentation
Existing project conventions
General best practices
