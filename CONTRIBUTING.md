# Contributing to CQRS Application System Design

Thank you for your interest in contributing to this project! This document provides guidelines for contributing to the CQRS Application System Design project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CQRS-Application-System-Design.git
   cd CQRS-Application-System-Design
   ```
3. **Set up the development environment** by following instructions in the README.md
4. **Create a new branch** for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   ```

## Development Workflow

1. **Follow the CQRS pattern** as described in the developer guide
2. **Write tests** for your changes
3. **Ensure all tests pass** before submitting your changes
4. **Update documentation** if necessary

## Code Style Guidelines

- Use ES6+ features
- Follow the established project structure
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Format code using Prettier (configuration provided in the project)

## Commit Guidelines

- Use clear, descriptive commit messages
- Reference issue numbers in commit messages when applicable
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")

Example commit message:
```
Add user profile caching in Redis

- Implement Redis caching for user profiles
- Add cache invalidation on profile updates
- Create fallback mechanism for Redis failures

Closes #42
```

## Pull Request Process

1. **Update your fork** with the latest from upstream
   ```bash
   git remote add upstream https://github.com/sahil2832005/CQRS-Application-System-Design.git
   git fetch upstream
   git rebase upstream/main
   ```
2. **Push your changes** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
3. **Create a Pull Request** from your fork to the main repository
4. **Provide a clear description** of the changes
5. **Reference any related issues**
6. **Wait for review** - respond to any feedback from maintainers

## Reporting Bugs

- Check if the issue already exists before creating a new one
- Use the issue template provided
- Include detailed steps to reproduce the bug
- Include relevant details like OS, Node version, etc.
- Include screenshots if applicable

## Suggesting Features

- Check if the feature has already been suggested or implemented
- Provide a clear description of the feature
- Explain why this feature would benefit the project
- Consider how it fits with the existing architecture

## Code of Conduct

- Be respectful and inclusive in your interactions
- Focus on the technical aspects of discussions
- Accept and provide constructive feedback gracefully
- Report inappropriate behavior to project maintainers

## Questions?

If you have any questions about contributing, please open an issue with the "question" label.
