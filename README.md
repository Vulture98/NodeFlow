# Flow Editor

A React-based visual flow editor for creating and managing data processing pipelines. Built with React Flow and modern React practices.

## Features

- **Drag-and-Drop Interface**: Easily create pipelines by dragging and dropping nodes
- **Multiple Node Types**:
  - Input Node: Define input data sources
  - Text Node: Create text templates with variable substitution
  - LLM Node: Language model integration
  - Output Node: Define pipeline outputs

- **Interactive Connections**: Create smooth animated connections between nodes
- **Real-time Updates**: Dynamic node resizing and state management
- **Modern UI**: Clean and intuitive interface with responsive design

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Development Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from create-react-app

## Project Structure

- `/src`
  - `/nodes`: Node type implementations
  - `store.js`: Global state management
  - `ui.js`: Main flow editor UI
  - `toolbar.js`: Node palette toolbar
  - `submit.js`: Pipeline submission logic

## Dependencies

- React
- React Flow
- Testing Libraries
- Web Vitals

## Contributing

Feel free to submit issues and enhancement requests!
