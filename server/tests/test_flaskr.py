from flaskr import create_app
from flask import json, jsonify

def test_hello(client):
    response = client.get("/hello")
    assert response.data == b"Hello, World!"

def test_register(client):
    response = client.post("/api/register", json={
        "username": "test_admin", "password": "test_admin", "name": "admin", "email": "admin@gmail.com"
    })
    assert response.data == b'Username Already Exists' or response.data == b"User successfully created"

def test_login(client):
    test_register(client)
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/checkauth", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    assert response.status_code == 200