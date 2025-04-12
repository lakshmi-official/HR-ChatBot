# HCL HR Policy Assistant Chatbot

A web-based chatbot application that provides instant answers to employee queries about HCL's HR policies using natural language processing and text similarity matching.

![HCL HR Policy Assistant Screenshot](https://via.placeholder.com/800x450.png?text=HCL+HR+Policy+Assistant)

## Features

- **Natural Language Processing**: Uses TF-IDF vectorization and cosine similarity to match user questions with relevant HR policies
- **Synonym Recognition**: Intelligently recognizes alternative terms for common HR concepts
- **User-Friendly Interface**: Clean, responsive design with typing indicators and structured responses
- **Secure Authentication**: Simple login system with password visibility toggle
- **Real-Time Responses**: Provides immediate answers to policy questions without the need to search through documents

## Technology Stack

### Backend
- Python 3.9+
- Flask web framework
- scikit-learn for NLP operations
- pandas for data handling
- NumPy for numerical operations

### Frontend
- HTML5, CSS3, JavaScript
- Font Awesome icons
- Responsive design for desktop and mobile devices

## Installation

### Prerequisites
- Python 3.9 or higher
- pip (Python package manager)
- Modern web browser
- Node.js and npm (optional, for development)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hcl-hr-policy-chatbot.git
   cd hcl-hr-policy-chatbot
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Place your HR policy dataset (CSV file) in the project root directory. The file should be named `HCL_HR_Policies_Comprehensive_Dataset.csv` and have the following columns:
   - `Keyword`: The policy category or keyword
   - `Detailed Information`: The full policy details

5. Start the Flask application:
   ```bash
   python app.py
   ```

6. Open a web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

1. Log in using the following credentials:
   - Username: `HRbot`
   - Password: `123`

2. Type your HR policy question in the input field and press Enter or click the send button.

3. The chatbot will respond with the most relevant policy information from the database.

4. Use the logout button to exit the application.

## Project Structure

```
hcl-hr-policy-chatbot/
│
├── app.py                # Flask backend application
├── index.html            # Frontend HTML
├── style.css             # CSS styling
├── script.js             # Frontend JavaScript
├── requirements.txt      # Python dependencies
└── HCL_HR_Policies_Comprehensive_Dataset.csv  # Policy database
```

## Customization

### Modifying the Policy Database

The application uses a CSV file named `HCL_HR_Policies_Comprehensive_Dataset.csv` for policy information. To update the policies:

1. Maintain the same column structure (`Keyword` and `Detailed Information`)
2. Add, remove, or modify rows as needed
3. Restart the Flask application to load the updated data

### Adjusting NLP Parameters

The natural language processing parameters can be adjusted in the `app.py` file:

- `ngram_range`: Controls the size of word groups considered (currently 1-2 words)
- `max_features`: Limits the vocabulary size (currently 5000 terms)
- `stop_words`: Common words to ignore during processing

### Frontend Customization

- Modify `style.css` to change the appearance of the application
- Update branding elements in `index.html` as needed
- Adjust the chat interface behavior in `script.js`

## Future Enhancements

- Integration with enterprise authentication systems
- Multi-language support
- Conversation history storage
- Administrative dashboard for HR teams
- Mobile application version
- Integration with Microsoft Teams/Slack
- Voice interaction capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:

Project Maintainer - [your-email@example.com](mailto:your-email@example.com)

---

*This project was developed for demonstration purposes and should be customized for production use with appropriate security measures.*
