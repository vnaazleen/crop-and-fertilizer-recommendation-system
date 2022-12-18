from flask import Flask, jsonify, request
import pickle

app = Flask(__name__)

model = pickle.load(open('../crop_reommendation_model.pkl', 'rb'))

@app.route('/crops', methods = ['POST'])
def cropRecommender():
    data = request.get_json()
    print(data)

    N, P, K = data['N'], data['P'], data['K']
    temperature = data['temperature']
    humidity = data['humidity']
    pH = data['pH']
    rainfall = data['rainfall']
    features = [N, P, K, temperature, humidity, pH, rainfall]
    label = model.predict([features])
    return jsonify(label[0])


if __name__ == '__main__':
    app.run(port=5000, debug=True)   