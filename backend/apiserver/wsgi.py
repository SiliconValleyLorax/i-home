from app import app
from app import initialize

if __name__ == "__main__":
    initialize()
    app.run(host='0.0.0.0', debug=True, port=5000)