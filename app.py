from flask import Flask, request, render_template
from Airbnb.pipelines.Prediction_Pipeline import CustomData, PredictPipeline

app = Flask(__name__)

# Define the home route
@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        try:
            # Validate and convert form data to CustomData object
            data = CustomData(
                property_type=request.form.get("property_type"),
                room_type=request.form.get("room_type"),
                amenities=(request.form.get("amenities")),
                accommodates=(request.form.get("accommodates")),
                bathrooms=(request.form.get("bathrooms")),
                bed_type=request.form.get("bed_type"),
                cancellation_policy=request.form.get("cancellation_policy"),
                cleaning_fee=(request.form.get("cleaning_fee")),
                city=request.form.get("city"),
                host_has_profile_pic=request.form.get("host_has_profile_pic"),
                host_identity_verified=request.form.get("host_identity_verified"),
                host_response_rate=request.form.get("host_response_rate"),
                instant_bookable=request.form.get("instant_bookable"),
                latitude=(request.form.get("latitude")),
                longitude=(request.form.get("longitude")),
                number_of_reviews=(request.form.get("number_of_reviews")),
                review_scores_rating=(request.form.get("review_scores_rating")),
                bedrooms=(request.form.get("bedrooms")),
                beds=(request.form.get("beds"))
            )

            final_data = data.get_data_as_dataframe()

            # Make prediction
            predict_pipeline = PredictPipeline()
            pred = predict_pipeline.predict(final_data)
            result = round(pred[0], 2)
            return render_template("index.html", final_result=result)

        except Exception as e:
            # Handle exceptions gracefully
            error_message = f"Error during prediction: {str(e)}"
            return render_template("error.html", error_message=error_message)

    else:
        # Render the initial page
        return render_template("index.html")

# Execution begins
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
