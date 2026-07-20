<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,6,12,20&height=200&section=header&text=Airbnb%20Price%20Predictor&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Predict%20fair%2C%20data-driven%20Airbnb%20prices%20with%20ML&descAlignY=55&descSize=18" width="100%"/>

<a href="https://github.com/zaidbharde/AIRBNB-PRICE-PREDICTION-">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=FF5A5F&center=true&vCenter=true&width=600&lines=End-to-End+ML+Web+App;Predicts+Fair+Airbnb+Prices;Flask+%2B+XGBoost+%2B+CatBoost;Built+by+Zaid+Bharde" alt="Typing SVG" />
</a>

<br/>

![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Web%20App-000000?style=for-the-badge&logo=flask&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-ML%20Model-FF6600?style=for-the-badge)
![CatBoost](https://img.shields.io/badge/CatBoost-ML%20Model-FFCC00?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-3DA639?style=for-the-badge)

![GitHub last commit](https://img.shields.io/github/last-commit/zaidbharde/AIRBNB-PRICE-PREDICTION-?style=flat-square&color=success)
![GitHub repo size](https://img.shields.io/github/repo-size/zaidbharde/AIRBNB-PRICE-PREDICTION-?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/zaidbharde/AIRBNB-PRICE-PREDICTION-?style=flat-square&color=yellow)

</div>

---

## 📌 Overview

Airbnb hosts constantly struggle to price their listings competitively — price too high and the listing sits empty, price too low and money is left on the table. This project uses data science and machine learning to predict a **fair, data-driven price** for a listing based on factors like location, property type, amenities, host details, and guest reviews.

The goal: give hosts a quick, reliable price estimate — and give guests a sense of whether a listing is fairly priced.

---

## ✨ Features

| | |
|---|---|
| 🔮 | Real-time price prediction through a simple web interface |
| 📊 | End-to-end ML pipeline: ingestion → transformation → training → prediction |
| 🧠 | Trained regression models (XGBoost / CatBoost) on real Airbnb listing data |
| 🐳 | Docker support for one-command, environment-free deployment |
| 📈 | Experiment tracking via DVC and Jupyter notebooks |
| 🌐 | Flask-based web app with a clean, responsive UI |

---

## 🛠️ Tech Stack

<div align="center">

![Skills](https://skillicons.dev/icons?i=python,flask,docker,sklearn,html,css,js&theme=dark)

</div>

<div align="center">

| Category | Tools |
|---|---|
| Language | Python |
| ML / Data | Numpy, Pandas, Scikit-learn, XGBoost, CatBoost |
| Visualization | Matplotlib, Seaborn |
| Web Framework | Flask |
| Experiment Tracking | DVC |
| Deployment | Docker |

</div>

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

<div align="center">

<!-- Replace this with an actual screen recording of your app -->
<img src="static/demo.gif" width="80%" alt="App demo — replace with your own screen recording"/>

</div>

> 💡 **Tip:** Record a quick screen capture of the app in action (e.g. with [ScreenToGif](https://www.screentogif.com/) on Windows or [Peek](https://github.com/phw/peek) on Linux), save it as `static/demo.gif`, and commit it. A live demo GIF is the single best thing you can add to this README — it's worth more than any badge.

---

## 🧪 Model Development

Model experimentation and EDA live in `Notebook_Experiments/`. The pipeline follows a modular structure:

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

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,6,12,20&height=100&section=footer" width="100%"/>

⭐ **If this project helped you, consider giving it a star!** ⭐

</div>
