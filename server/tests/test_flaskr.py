from flaskr import create_app

def test_hello(client):
    response = client.get("/hello")
    assert response.data == b"Hello, World!"

def test_bad(client):
    response = client.get("/hello")
    assert response.data == b"Hello"
