
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2024-07-24

### Added
- **Resizable & Collapsible UI:** Implemented a fully resizable and collapsible panel system for the sidebar and code view, providing a flexible and customizable workspace.

### Changed
- **Modernized View Toggles:** Upgraded the Code/Preview view switcher from standard buttons to a sleek, icon-based toggle switch for a cleaner UI.

### Fixed
- **React Stability:** Downgraded React from an unstable pre-release version to the latest stable version (18.2.0) to resolve critical runtime errors and ensure application stability.
- Stabilized code generation rendering by implementing a more robust streaming parser that prevents incomplete code snippets from being processed.
- Resolved module import errors in the preview pane by creating a custom path resolver that correctly handles relative paths (`./`, `../`) and various file extensions.
- Overhauled the preview engine to support modern ES modules and React 19, enabling live previews of generated components.

## [1.0.0] - 2023-10-27

### Added
- Initial project setup with React, TypeScript, and Tailwind CSS.
- Core components: `Sidebar`, `ChatView`, `CodeView`, `WelcomeScreen`.
- Gemini API integration for chat responses and code generation.
- Real-time preview pane for generated components.
- State management for chat sessions and file trees.

### Changed
- Complete UI overhaul for a more polished, "herochat-ui" inspired look.
- Standardized color palette to a dark, monochromatic theme.
- Refined styling for chat bubbles, input fields, and code viewer.
- Improved layout and consistency across all components.
- Reworked welcome screen suggested prompts to a 4-3-2 layout.
- Removed the header from the welcome screen for a cleaner initial view.
