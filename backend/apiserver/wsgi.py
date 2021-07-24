from app import app
from app import initialize

if __name__ == "__main__":
    initialize()
    app.run(host='0.0.0.0', debug=False, port=5000)