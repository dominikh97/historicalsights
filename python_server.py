from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/process-node', methods=['POST'])
def process_node():
    try:
        # Get the data sent by server.js (selectedNode)
        selected_node = request.json
        # Process the data (you can add any processing logic here)
        print("Received Node Data:", selected_node)

        # Example response (you can modify this based on what you want)
        return jsonify({
            "status": "success",
            "message": "Node data processed",
            "received_node": selected_node
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


# Start the Flask server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)  # Change port if needed
