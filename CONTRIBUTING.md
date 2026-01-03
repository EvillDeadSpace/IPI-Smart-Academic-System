# 🤝 Contributing to IPI Smart Academic System

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards others

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/IPI-Smart-Academic-System.git
   cd IPI-Smart-Academic-System
   ```

3. **Set up environment**

   ```bash
   # Backend
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file

   # Frontend
   cd ../frontend
   npm install
   cp .env.example .env

   # NLP Service
   cd ../NLP
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   ```

4. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-grade-export`)
- `bugfix/` - Bug fixes (e.g., `bugfix/fix-login-issue`)
- `hotfix/` - Urgent production fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

### Commit Message Format

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**

```bash
feat(student): add exam registration feature
fix(auth): resolve login timeout issue
docs(readme): update installation instructions
refactor(api): improve error handling
```

## 💻 Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for type safety
- Follow **ESLint** rules (run `npm run lint`)
- Use **Prettier** for code formatting
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

### Python

- Follow **PEP 8** style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions focused and small

### General Guidelines

- **DRY** - Don't Repeat Yourself
- **SOLID** principles
- Write unit tests for new features
- Keep functions under 50 lines when possible
- Use meaningful commit messages

## 🔍 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Run linter and tests**

   ```bash
   # Backend
   npm run lint
   npm run test

   # Frontend
   npm run lint
   npm run build
   ```

4. **Create Pull Request** with:

   - Clear title and description
   - Reference related issues
   - Screenshots/GIFs for UI changes
   - Test results

5. **Wait for review** - maintainers will review your PR
6. **Address feedback** if requested
7. **Merge** - Once approved, your PR will be merged

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings generated
```

## 🐛 Reporting Bugs

**Before submitting:**

1. Check if the bug is already reported
2. Use the latest version
3. Gather relevant information

**Bug Report Template:**

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**

- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]
```

## 💡 Feature Requests

We welcome feature suggestions! Please:

1. **Search existing issues** first
2. **Describe the feature** clearly
3. **Explain the use case**
4. **Provide examples** if possible

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make this project better for everyone!

---

For questions, reach out to the maintainers or open a discussion on GitHub.
