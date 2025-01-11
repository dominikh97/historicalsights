from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/fetch-description', methods=['GET'])
def fetch_description():
    node_name = request.args.get('nodeName', '')
    if not node_name:
        return jsonify({'error': 'nodeName is required'}), 400

    wikipedia_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{node_name}"

    try:
        response = requests.get(wikipedia_url)
        response.raise_for_status()
        data = response.json()

        description = data.get('extract', 'No description available.')
        return jsonify({'description': description})
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Failed to fetch description', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000)
