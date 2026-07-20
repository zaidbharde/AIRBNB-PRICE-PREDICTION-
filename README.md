# 🏠 Airbnb Price Prediction — End to End ML Project

A Machine Learning-powered web application that predicts Airbnb listing prices based on property details, location, host information, amenities, and review metrics. Built with a Flask front end and a trained regression model served through a modular ML pipeline.

![Python](https://img.shields.io/badge/Python-3.x-blue)
![Flask](https://img.shields.io/badge/Flask-Web%20App-black)
![XGBoost](https://img.shields.io/badge/XGBoost-ML%20Model-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Overview

Airbnb hosts constantly struggle to price their listings competitively — price too high and the listing sits empty, price too low and money is left on the table. This project uses data science and machine learning to predict a fair, data-driven price for a listing based on factors like location, property type, amenities, host details, and guest reviews.

The goal is to give hosts a quick, reliable price estimate and give guests a sense of whether a listing is fairly priced.

---

## ✨ Features

- 🔮 Real-time price prediction through a simple web interface
- 📊 End-to-end ML pipeline: data ingestion → transformation → model training → prediction
- 🧠 Trained regression models (XGBoost / CatBoost) on Airbnb listing data
- 🐳 Docker support for easy, environment-free deployment
- 📈 Experiment tracking via DVC and Jupyter notebooks
- 🌐 Flask-based web app with a clean, user-friendly UI

---

## 🗂️ Project Structure

```
AIRBNB-PRICE-PREDICTION/
├── src/Airbnb/              # Core package: pipeline, components, utils
├── Notebook_Experiments/    # EDA and model experimentation notebooks
├── Artifacts/               # Generated artifacts (processed data, trained models)
├── static/                  # CSS/JS/static assets for the web app
├── templates/                # HTML templates for the Flask app
├── app.py                   # Flask application entry point
├── setup.py                  # Package setup
├── template.py               # Project scaffolding script
├── Dockerfile                 # Container build configuration
├── requirements.txt           # Python dependencies
└── README.md
```

---

## 🛠️ Tech Stack

| Category | Tools |
|---|---|
| Language | Python |
| ML / Data | Numpy, Pandas, Scikit-learn, XGBoost, CatBoost |
| Visualization | Matplotlib, Seaborn |
| Web Framework | Flask |
| Experiment Tracking | DVC |
| Deployment | Docker |

---

## ⚙️ Installation

### Prerequisites

Make sure you have Python installed along with the following packages (all listed in `requirements.txt`):

- Numpy, Pandas, Seaborn, Matplotlib
- Scikit-learn, XGBoost, CatBoost
- Flask, Pillow
- DVC

### Option 1: Run from Source

```bash
# 1. Clone the repository
git clone https://github.com/zaidbharde/AIRBNB-PRICE-PREDICTION-.git
cd AIRBNB-PRICE-PREDICTION-

# 2. Create a virtual environment (recommended)
conda create -p venv python==3.10 -y
conda activate venv/

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Then open `http://localhost:5000` in your browser.

### Option 2: Run with Docker

```bash
# Build the image locally
docker build -t airbnb-price-prediction .

# Run the container
docker run -p 5000:5000 airbnb-price-prediction
```

Then open `http://localhost:5000` in your browser.

---

## 🚀 Usage

1. Launch the app using either method above.
2. Enter listing details — location, property type, number of bedrooms/bathrooms, amenities, host info, and review metrics.
3. Click **Predict** to get an estimated price for the listing.

---

## 🧪 Model Development

Model experimentation and EDA can be found in `Notebook_Experiments/`. The pipeline follows a modular structure:

1. **Data Ingestion** — loads and splits the raw Airbnb dataset
2. **Data Transformation** — handles preprocessing, encoding, and feature engineering
3. **Model Training** — trains and evaluates regression models (XGBoost, CatBoost)
4. **Prediction Pipeline** — serves predictions through the Flask app

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for improving the model, pipeline, or UI, feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a PR

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

This project was inspired by Kaggle's Airbnb Price Prediction dataset and competition, along with the open-source Python libraries used throughout — Scikit-learn, XGBoost, CatBoost, and Flask.
