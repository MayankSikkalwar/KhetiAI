import requests

try:
    response = requests.post(
        "http://127.0.0.1:5000/api/chat",
        json={"query": "hello", "language": "en"}
    )
    print(response.status_code)
    print(response.json())
except Exception as e:
    print(e)
