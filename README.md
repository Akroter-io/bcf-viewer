# BCF Viewer Web Application

A modern web application for viewing and analyzing BIM Collaboration Format (BCF) files directly in your browser. Supported versions: `3.0`.

🚀 **[Web app](https://akroter-io.github.io/bcf-viewer)**


## Features

- **Drag & Drop Interface**: Simply drag and drop BCF files into the browser
- **Complete BCF Support**: Displays all BCF information including:
  - Topic details (title, status, priority, creation/modification info)
  - Comments with author, date, and modification history
  - Associated images with navigation
  - Viewpoint information
- **Responsive Design**: Works on desktop and mobile devices
- **No Installation Required**: Runs entirely in the browser
- **Real-time Processing**: Instant parsing and display of BCF contents


## Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Akroter-io/bcf-viewer.git
   cd bcf-viewer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8080`


## References

- [BCF XML Documentation](https://github.com/BuildingSMART/BCF-XML)
- [BCF 3.0 Specification](https://github.com/BuildingSMART/BCF-XML/tree/release_3_0/Documentation)


> This project is inspired by [BCF2PDF](https://sourceforge.net/projects/bcf2pdf/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.
