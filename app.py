from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import json

app = Flask(__name__)

FLIGHT_HISTORY_DIR = 'flight-history'
os.makedirs(FLIGHT_HISTORY_DIR, exist_ok=True)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/history")
def list_history():
    files_info = []
    for f in os.listdir(FLIGHT_HISTORY_DIR):
        if f.endswith(".geojson"):
            path = os.path.join(FLIGHT_HISTORY_DIR, f)
            mtime = os.path.getmtime(path) 
            files_info.append({"name": f, "mtime": mtime})
    files_info.sort(key=lambda x: x["mtime"], reverse=True)
    return jsonify(files_info)


@app.route("/history/<filename>")
def get_history(filename):
    path = os.path.join(FLIGHT_HISTORY_DIR, filename)
    if not os.path.exists(path):
        return jsonify({"error": "Not found"}), 404
    with open(path) as f:
        data = json.load(f)
    return jsonify(data)


@app.route("/history/<filename>", methods=["POST"])
def save_history(filename):
    data = request.get_json()
    path = os.path.join(FLIGHT_HISTORY_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    return jsonify({"status": "saved"})


@app.route("/history/<filename>", methods=["DELETE"])
def delete_history(filename):
    path = os.path.join(FLIGHT_HISTORY_DIR, filename)
    if os.path.exists(path):
        os.remove(path)
        return jsonify({"status": "deleted"})
    return jsonify({"error": "Not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
