from requests import Response
from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)

model = pickle.load(open('./model/crop_recommendation_model.pkl', 'rb'))
fertilizer_recommendation_model = pickle.load(open('./model/fertilizer_recommendation_model.pkl','rb'))


@app.route('/crops', methods = ['POST'])
def cropRecommender():
    data = request.get_json()
    print(data)

    N, P, K = data['N'], data['P'], data['K']
    temperature = data['temperature']
    humidity = data['humidity']
    pH = data['pH']
    rainfall = data['rainfall']
    features = [int(N), int(P), int(K), float(temperature), float(humidity), float(pH), float(rainfall)]
    label = model.predict([features])
    return jsonify({"crop": label[0]})

@app.route('/fertilizer', methods = ['POST'])
def fertilizerRecommender():
    sc = StandardScaler()
    data = request.get_json()
    print(data)

    N, P, K = data['N'], data['P'], data['K']
    temperature = data['temperature']
    humidity = data['humidity']
    moisture = data['moisture']
    soiltype = data['soiltype']
    croptype = data['croptype']
    
    features = [[int(temperature),int(humidity),int(moisture),int(soiltype),int(croptype),int(N),int(K),int(P)]]
    finalfeatures = np.array(features)
    print("final features- ",finalfeatures)
    label = fertilizer_recommendation_model.predict(finalfeatures)
    
    return jsonify({"fertilizer": int(label[0])})


app.after_request
def after_request(response: Response) -> Response:
    response.access_control_allow_origin = "*"
    return response

if __name__ == '__main__':
    app.run(port=5000, debug=True)   